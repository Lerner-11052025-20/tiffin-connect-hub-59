import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Menu from '../models/Menu.js';
import Vendor from '../models/Vendor.js';
import Order from '../models/Order.js';

const router = express.Router();

/**
 * TEST ROUTE: GET /api/chatbot/test
 */
router.get('/test', (req, res) => {
    res.json({
        status: "chatbot API working",
        timestamp: new Date().toISOString(),
        environment: {
            hasApiKey: !!process.env.OPENAI_API_KEY,
            nodeVersion: process.version
        }
    });
});

/**
 * Helper to search meals from MongoDB
 */
async function searchMeals(filters) {
    console.log("🔍 [DB Query] Searching meals with filters:", JSON.stringify(filters));
    try {
        const query = { is_available: true };

        if (filters.maxPrice) {
            query.price = { $lte: filters.maxPrice };
        }

        if (filters.mealType) {
            // Search in name or description for tags
            query.$or = [
                { name: new RegExp(filters.mealType, 'i') },
                { description: new RegExp(filters.mealType, 'i') }
            ];
        }

        if (filters.search) {
            if (!query.$or) query.$or = [];
            query.$or.push({ name: new RegExp(filters.search, 'i') });
            // For items array, we check if any item matches the search
            query.$or.push({ items: { $elemMatch: { $regex: filters.search, $options: 'i' } } });
        }

        const meals = await Menu.find(query).populate('vendor_id').limit(5);
        console.log(`✅ [DB Result] Found ${meals.length} matching meals`);

        return meals.map(m => ({
            name: m.name,
            price: m.price,
            rating: 4.8,
            vendor: m.vendor_id?.business_name || "Premium Kitchen",
            description: m.description,
            type: "meal"
        }));
    } catch (err) {
        console.error("❌ [DB Error] Search failed:", err);
        return [];
    }
}

/**
 * Helper to get user's last order
 */
async function getLastOrder(userId) {
    console.log("🔍 [DB Query] Fetching last order for user ID:", userId);
    try {
        if (!userId) return "User ID missing.";
        // Note: The Order model uses 'userId' (camelCase)
        const order = await Order.findOne({ userId: userId }).sort({ createdAt: -1 }).populate('vendorId');

        if (!order) {
            console.log("ℹ️ [DB Result] No orders found for this user");
            return "No past orders found on your account.";
        }

        console.log("✅ [DB Result] Found last order:", order.mealName);
        return {
            name: order.mealName,
            price: order.price,
            status: order.orderStatus,
            vendor: order.vendorId?.business_name || "Independent Kitchen",
            date: order.createdAt,
            type: "order"
        };
    } catch (err) {
        console.error("❌ [DB Error] Order fetch failed:", err);
        return "I encountered an error looking up your order history.";
    }
}

const tools = [
    {
        type: "function",
        function: {
            name: "search_meals",
            description: "Find meals based on price, type (veg/diet), or keywords.",
            parameters: {
                type: "object",
                properties: {
                    maxPrice: { type: "number" },
                    mealType: { type: "string", enum: ["veg", "non-veg", "diet", "vegan"] },
                    search: { type: "string" }
                }
            }
        }
    },
    {
        type: "function",
        function: {
            name: "get_my_last_order",
            description: "Fetch the details of the user's most recent valid order.",
            parameters: { type: "object", properties: {} }
        }
    }
];

/**
 * Fallback to standard messages if AI is completely down
 */
function getFallbackResponse(userMessage) {
    if (userMessage.toLowerCase().includes("veg")) {
        return "I'm having a technical glitch, but I highly recommend our Gujarati Thali for a great veg option! You can find it in the Planner.";
    }
    return "I'm currently undergoing some maintenance and can't process that specific request. Please try browsing our latest menus manually!";
}

/**
 * OpenAI API Wrapper
 */
async function callOpenAI(messages, toolChoice = "auto") {
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error("OPENAI_API_KEY_NOT_FOUND");

    const fetchMethod = globalThis.fetch || fetch;
    if (!fetchMethod) throw new Error("NODE_FETCH_NOT_AVAILABLE");

    const response = await fetchMethod("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${key}`
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages,
            tools,
            tool_choice: toolChoice
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `AI API returned status ${response.status}`);
    }

    return await response.json();
}

/**
 * MAIN POST ROUTE: /api/chatbot
 */
router.post('/', authenticate, async (req, res) => {
    console.log("\n--- [Chatbot Request START] ---");
    console.log(`User: ${req.user?.email} (${req.user?.userId})`);
    console.log(`Message: "${req.body.message}"`);

    try {
        const { message, history = [] } = req.body;

        if (!message) {
            return res.status(400).json({ status: "error", message: "Missing message field" });
        }

        const systemMessage = {
            role: "system",
            content: "You are the TiffinConnect Assistant. You help users find food. Use the search_meals tool for finding food. If results come back, suggest them. Keep it professional."
        };

        const messages = [systemMessage, ...history, { role: "user", content: message }];

        let aiResponse;
        try {
            aiResponse = await callOpenAI(messages);
        } catch (err) {
            console.error("🛑 [AI Primary Error]:", err.message);
            return res.json({
                type: "text",
                message: getFallbackResponse(message),
                status: "success"
            });
        }

        let assistantMsg = aiResponse.choices[0].message;
        let structuredData = [];

        // Handle Tool Calls
        if (assistantMsg.tool_calls) {
            const toolMessages = [...messages, assistantMsg];

            for (const tool of assistantMsg.tool_calls) {
                const funcName = tool.function.name;
                const args = JSON.parse(tool.function.arguments);
                let result;

                if (funcName === "search_meals") {
                    result = await searchMeals(args);
                    structuredData = Array.isArray(result) ? [...structuredData, ...result] : [];
                } else if (funcName === "get_my_last_order") {
                    result = await getLastOrder(req.user.userId);
                    if (typeof result !== "string") structuredData.push(result);
                }

                toolMessages.push({
                    tool_call_id: tool.id,
                    role: "tool",
                    name: funcName,
                    content: JSON.stringify(result)
                });
            }

            // Get final summary from AI
            try {
                const finalAi = await callOpenAI(toolMessages, "none");
                assistantMsg = finalAi.choices[0].message;
            } catch (err) {
                console.warn("⚠️ [AI Summary Warning]: Failed to get final summary, using data only.");
            }
        }

        const finalPayload = {
            type: structuredData.length > 0 ? "structured" : "text",
            message: assistantMsg.content || "I've found some results for you below.",
            meals: structuredData, // 'meals' field for backward compatibility or front-end specific parsing
            data: structuredData,
            status: "success",
            history: [...history, { role: "user", content: message }, assistantMsg]
        };

        console.log("✅ [Chatbot] Response sent successfully");
        console.log("--- [Chatbot Request END] ---\n");
        return res.json(finalPayload);

    } catch (err) {
        console.error("❌ [FATAL ROUTE ERROR]:", err);
        return res.status(200).json({ // Return 200 to prevent front-end crash
            type: "text",
            message: "I'm having a bit of trouble with my internal circuits. Please try again or browse our menu manually!",
            status: "success"
        });
    }
});

export default router;
