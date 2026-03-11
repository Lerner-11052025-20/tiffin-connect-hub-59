import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, Bot, User, Loader2, Star, ChevronRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface Message {
    role: "user" | "assistant";
    content: string;
    data?: any[];
}

const QUICK_PROMPTS = [
    "Show veg meals under ₹100",
    "Suggest a healthy lunch",
    "Repeat my last order",
    "Find diet meals"
];

export function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hi! I'm your TiffinConnect AI Assistant. How can I help you today? 🍱" }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleSend = async (text: string) => {
        if (!text.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: text };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await api.post<any>("/chatbot", {
                message: text,
                history: messages.slice(1).map(({ role, content }) => ({ role, content }))
            });

            setMessages(prev => [...prev, {
                role: "assistant",
                content: response.message,
                data: response.data
            }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "I'm having a little trouble connecting right now. Please check if our backend is running!"
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom right" }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="mb-4 w-[420px] h-[620px] bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border border-primary/20 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
                    >
                        {/* Header - Premium Gradient */}
                        <div className="relative overflow-hidden p-6 flex items-center justify-between text-white">
                            {/* Animated Background Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-cyan-500 opacity-90"></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
                            
                            {/* Animated Light Effects */}
                            <motion.div
                                animate={{ 
                                    x: [0, 30, 0],
                                    y: [0, -20, 0]
                                }}
                                transition={{ duration: 6, repeat: Infinity }}
                                className="absolute -right-40 -top-40 w-80 h-80 bg-white/20 rounded-full blur-3xl pointer-events-none"
                            />
                            
                            <div className="relative z-10 flex items-center gap-3">
                                {/* AI Icon with Glow */}
                                <motion.div
                                    animate={{ 
                                        boxShadow: ["0 0 20px rgba(255,255,255,0.3)", "0 0 30px rgba(255,255,255,0.5)", "0 0 20px rgba(255,255,255,0.3)"]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/30"
                                >
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                                        <Bot className="h-6 w-6 text-white" />
                                    </motion.div>
                                </motion.div>
                                <div>
                                    <h3 className="font-heading font-black text-base tracking-tight leading-none">Tiffin AI</h3>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <motion.span 
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            className="w-2 h-2 rounded-full bg-green-300"
                                        />
                                        <span className="text-xs font-bold uppercase tracking-widest opacity-90">Premium AI</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Close Button - Premium */}
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsOpen(false)}
                                className="relative z-10 w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all backdrop-blur-sm border border-white/30 hover:border-white/50"
                            >
                                <X className="h-5 w-5" />
                            </motion.button>
                        </div>

                        {/* Chat Body */}
                        <ScrollArea className="flex-1 p-6">
                            <div className="space-y-6 pb-4">
                                {messages.map((m, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "flex flex-col gap-2",
                                            m.role === "user" ? "items-end" : "items-start"
                                        )}
                                    >
                                        <div className={cn(
                                            "flex gap-3 max-w-[90%]",
                                            m.role === "user" ? "flex-row-reverse" : ""
                                        )}>
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                className={cn(
                                                    "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs",
                                                    m.role === "assistant" 
                                                        ? "bg-gradient-to-br from-primary/90 to-purple-500/90 text-white shadow-lg shadow-primary/25" 
                                                        : "bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700"
                                                )}>
                                                {m.role === "assistant" ? <Zap className="h-4 w-4" /> : <User className="h-4 w-4" />}
                                            </motion.div>
                                            <motion.div
                                                whileHover={{ scale: 1.02 }}
                                                className={cn(
                                                    "p-4 rounded-2xl text-sm leading-relaxed shadow-md whitespace-pre-wrap transition-all",
                                                    m.role === "assistant"
                                                        ? "bg-white dark:bg-slate-800 rounded-tl-none text-foreground border border-primary/20 dark:border-primary/30 backdrop-blur-sm"
                                                        : "bg-gradient-to-r from-primary to-purple-500 text-white rounded-tr-none font-medium shadow-lg shadow-primary/20"
                                                )}>
                                                {m.content}
                                            </motion.div>
                                        </div>

                                        {/* Structured Data (Meals/Orders) */}
                                        {m.data && m.data.length > 0 && (
                                            <div className="w-full mt-2 pl-11 space-y-3">
                                                {m.data.map((item, idx) => (
                                                    <motion.div 
                                                        key={idx}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        whileHover={{ scale: 1.02, y: -2 }}
                                                        className="bg-white dark:bg-slate-800 border border-primary/20 rounded-2xl p-4 shadow-md hover:shadow-lg transition-all group"
                                                    >
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h4 className="font-bold text-sm text-foreground">{item.name || item.meal}</h4>
                                                            <span className="text-primary font-black text-xs bg-primary/10 px-2 py-1 rounded-lg">₹{item.price}</span>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-3">
                                                            <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-500 fill-amber-500" /> {item.rating || 4.5}</span>
                                                            <span className="truncate max-w-[120px]">By {item.vendor}</span>
                                                        </div>
                                                        <Button asChild size="sm" className="w-full rounded-xl text-[10px] font-black uppercase tracking-widest h-8 bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-600 text-white shadow-md shadow-primary/25 transition-all">
                                                            <Link to={item.status ? "/dashboard/orders" : `/dashboard/planner`}>
                                                                {item.status ? "Track Order" : "Plan this Meal"} <ChevronRight className="ml-2 h-3 w-3" />
                                                            </Link>
                                                        </Button>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                                {isLoading && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex gap-3 max-w-[85%]"
                                    >
                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/90 to-purple-500/90 text-white flex items-center justify-center shrink-0 shadow-lg">
                                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                                                <Zap className="h-4 w-4" />
                                            </motion.div>
                                        </div>
                                        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-primary/20 dark:border-primary/30">
                                            <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                                <Loader2 className="h-4 w-4 text-primary" />
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </ScrollArea>

                        {/* Suggestions & Input */}
                        <div className="p-6 pt-4 space-y-4 bg-gradient-to-t from-white/80 to-transparent dark:from-slate-800/80 dark:to-transparent">
                            {messages.length < 3 && !isLoading && (
                                <div className="flex flex-wrap gap-2">
                                    {QUICK_PROMPTS.map((p, idx) => (
                                        <motion.button
                                            key={p}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: idx * 0.05 }}
                                            whileHover={{ scale: 1.05, backgroundColor: "var(--primary-lighter)" }}
                                            onClick={() => handleSend(p)}
                                            className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-white dark:bg-slate-700 border border-primary/30 hover:border-primary/60 transition-all text-primary dark:text-white shadow-sm hover:shadow-md"
                                        >
                                            {p}
                                        </motion.button>
                                    ))}
                                </div>
                            )}

                            <div className="relative group">
                                <motion.div 
                                    className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity"
                                    layoutId="inputGlow"
                                />
                                <Input
                                    className="relative pr-12 h-12 bg-white dark:bg-slate-800 border border-primary/20 dark:border-primary/30 rounded-2xl focus-visible:ring-primary/30 focus-visible:border-primary/50 transition-all shadow-sm"
                                    placeholder="Ask me anything..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="absolute right-1 top-1 bottom-1 h-10 w-10 rounded-xl bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-600 text-white p-0 shadow-lg shadow-primary/30 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => handleSend(input)}
                                    disabled={!input.trim() || isLoading}
                                >
                                    <Send className="h-4 w-4" />
                                </motion.button>
                            </div>

                            <p className="text-[9px] text-center text-muted-foreground font-medium flex items-center justify-center gap-1.5">
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                                    <Sparkles className="h-3 w-3 text-primary" />
                                </motion.div>
                                Powered by OpenAI Advanced Intelligence
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chatbot Toggle Button - Premium Design */}
            <div className="flex flex-col gap-2 items-end">
                {/* Status Badge */}
                {!isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="bg-white dark:bg-slate-800 text-primary text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-lg border border-primary/30 backdrop-blur-md"
                    >
                        💬 Chat Now
                    </motion.div>
                )}

                {/* Main Button */}
                <motion.button
                    whileHover={{ scale: 1.1, rotate: -10 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "relative w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-2xl transition-all duration-500 font-bold text-white border-2",
                        isOpen 
                            ? "bg-gradient-to-br from-red-500 to-red-600 border-red-400/50 rotate-90" 
                            : "bg-gradient-to-br from-primary via-purple-500 to-cyan-500 border-primary/50 hover:border-primary"
                    )}
                >
                    {/* Animated Background Shimmer */}
                    <motion.div
                        animate={{ 
                            opacity: [0.3, 0.8, 0.3]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-[1.5rem] bg-white/20"
                    />
                    
                    <div className="relative z-10">
                        {isOpen ? (
                            <motion.div
                                initial={{ rotate: 0 }}
                                animate={{ rotate: -90 }}
                                transition={{ duration: 0.3 }}
                            >
                                <X className="h-7 w-7 text-white drop-shadow-lg" />
                            </motion.div>
                        ) : (
                            <motion.div
                                animate={{ y: [0, -2, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="relative"
                            >
                                <MessageSquare className="h-7 w-7 text-white drop-shadow-lg" />
                                <motion.span 
                                    animate={{ 
                                        scale: [1, 1.2, 1],
                                        boxShadow: ["0 0 4px rgba(255,255,255,0.5)", "0 0 8px rgba(255,255,255,0.8)", "0 0 4px rgba(255,255,255,0.5)"]
                                    }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"
                                />
                            </motion.div>
                        )}
                    </div>
                </motion.button>
            </div>
        </div>
    );
}
