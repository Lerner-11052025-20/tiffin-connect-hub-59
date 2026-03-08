import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format } from "date-fns";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function VendorHome() {
  const { user } = useAuth();

  const { data: vendor } = useQuery({
    queryKey: ["vendor-profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("vendors")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
  });

  const { data: todayOrders } = useQuery({
    queryKey: ["vendor-today-orders", vendor?.id],
    enabled: !!vendor,
    queryFn: async () => {
      const today = format(new Date(), "yyyy-MM-dd");
      const { data } = await supabase
        .from("orders")
        .select("*, profiles!orders_user_id_fkey(full_name)")
        .eq("vendor_id", vendor!.id)
        .eq("delivery_date", today)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const { data: activeSubscribers } = useQuery({
    queryKey: ["vendor-subscribers", vendor?.id],
    enabled: !!vendor,
    queryFn: async () => {
      const { data } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("vendor_id", vendor!.id)
        .eq("status", "active");
      return data ?? [];
    },
  });

  const { data: recentOrders } = useQuery({
    queryKey: ["vendor-recent-orders", vendor?.id],
    enabled: !!vendor,
    queryFn: async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("vendor_id", vendor!.id)
        .order("created_at", { ascending: false })
        .limit(5);
      return data ?? [];
    },
  });

  const todayEarnings = todayOrders
    ?.filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + Number(o.amount), 0) ?? 0;

  const pendingCount = todayOrders?.filter((o) => ["pending", "preparing", "out_for_delivery"].includes(o.status)).length ?? 0;

  const statusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "preparing": return "bg-blue-100 text-blue-700";
      case "out_for_delivery": return "bg-purple-100 text-purple-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (!vendor) {
    return (
      <div className="glass-card rounded-2xl p-16 text-center">
        <span className="text-6xl block mb-4">👨‍🍳</span>
        <h3 className="font-heading font-semibold text-foreground text-lg">Vendor profile not found</h3>
        <p className="text-muted-foreground mt-2 text-sm">Please set up your business profile first.</p>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h2 className="font-heading text-2xl font-bold text-foreground">
          {vendor.business_name} 👨‍🍳
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          {vendor.is_approved ? "✅ Approved" : "⏳ Pending approval"} · Today's overview
        </p>
      </motion.div>

      <motion.div variants={container} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Orders", value: String(todayOrders?.length ?? 0), icon: "📦", gradient: "from-primary/10 to-accent/10" },
          { label: "Pending", value: String(pendingCount), icon: "🚚", gradient: "from-accent/10 to-primary/5" },
          { label: "Today's Earnings", value: `₹${todayEarnings.toLocaleString()}`, icon: "💰", gradient: "from-primary/5 to-accent/10" },
          { label: "Active Subscribers", value: String(activeSubscribers?.length ?? 0), icon: "👥", gradient: "from-accent/10 to-primary/10" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            variants={item}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`glass-card rounded-2xl p-6 hover:shadow-card-hover transition-all duration-300 bg-gradient-to-br ${stat.gradient}`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className="font-heading text-2xl font-bold text-foreground mt-2">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={item} className="glass-card rounded-2xl p-6 hover:shadow-card-hover transition-all">
        <h2 className="font-heading font-semibold text-foreground text-lg mb-5">Recent Orders</h2>
        {recentOrders && recentOrders.length > 0 ? (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between border border-border/30 rounded-xl p-4 glass-subtle">
                <div>
                  <p className="font-medium text-foreground text-sm capitalize">{order.meal_type}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(order.delivery_date), "dd MMM yyyy")} · ₹{Number(order.amount).toLocaleString()}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColor(order.status)}`}>
                  {order.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No orders yet.</p>
        )}
      </motion.div>
    </motion.div>
  );
}
