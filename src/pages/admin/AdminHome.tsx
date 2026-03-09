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

export default function AdminHome() {
  const { data: profiles } = useQuery({
    queryKey: ["admin-profiles-count"],
    queryFn: async () => {
      const { count } = await supabase.from("profiles").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: vendors } = useQuery({
    queryKey: ["admin-vendors-stats"],
    queryFn: async () => {
      const { data } = await supabase.from("vendors").select("is_approved, is_active");
      const active = data?.filter((v) => v.is_approved && v.is_active).length ?? 0;
      const pending = data?.filter((v) => !v.is_approved).length ?? 0;
      return { total: data?.length ?? 0, active, pending };
    },
  });

  const { data: orderStats } = useQuery({
    queryKey: ["admin-order-stats"],
    queryFn: async () => {
      const today = format(new Date(), "yyyy-MM-dd");
      const { data } = await supabase.from("orders").select("amount, status, delivery_date");
      const todayOrders = data?.filter((o) => o.delivery_date === today) ?? [];
      const totalRevenue = data?.filter((o) => o.status !== "cancelled").reduce((s, o) => s + Number(o.amount), 0) ?? 0;
      return { total: data?.length ?? 0, today: todayOrders.length, revenue: totalRevenue };
    },
  });

  const { data: recentOrders } = useQuery({
    queryKey: ["admin-recent-orders"],
    queryFn: async () => {
      const { data } = await supabase
        .from("orders")
        .select("*, vendors(business_name)")
        .order("created_at", { ascending: false })
        .limit(5);
      return data ?? [];
    },
  });

  const statusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";
      case "pending": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300";
      case "preparing": return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
      case "out_for_delivery": return "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300";
      case "cancelled": return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h2 className="font-heading text-2xl font-bold text-foreground">Admin Dashboard 🛡️</h2>
        <p className="text-muted-foreground text-sm mt-1">Platform overview and management</p>
      </motion.div>

      <motion.div variants={container} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: String(profiles ?? 0), icon: "👤", gradient: "from-primary/10 to-accent/10" },
          { label: "Active Vendors", value: `${vendors?.active ?? 0} / ${vendors?.total ?? 0}`, icon: "👨‍🍳", gradient: "from-accent/10 to-primary/5" },
          { label: "Orders Today", value: String(orderStats?.today ?? 0), icon: "📦", gradient: "from-primary/5 to-accent/10" },
          { label: "Total Revenue", value: `₹${(orderStats?.revenue ?? 0).toLocaleString()}`, icon: "📊", gradient: "from-accent/10 to-primary/10" },
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

      {/* Pending Vendors Alert */}
      {vendors && vendors.pending > 0 && (
        <motion.div variants={item} className="glass-card rounded-2xl p-5 border-l-4 border-yellow-400 bg-yellow-50/50 dark:bg-yellow-900/20">
          <p className="font-heading font-semibold text-foreground">⏳ {vendors.pending} vendor(s) pending approval</p>
          <p className="text-sm text-muted-foreground mt-1">Go to <a href="/admin/vendors" className="text-primary underline">Vendors</a> to review and approve.</p>
        </motion.div>
      )}

      {/* Recent Orders */}
      <motion.div variants={item} className="glass-card rounded-2xl p-6">
        <h3 className="font-heading font-semibold text-foreground text-lg mb-4">Recent Orders</h3>
        {recentOrders && recentOrders.length > 0 ? (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between border border-border/30 rounded-xl p-4 glass-subtle">
                <div>
                  <p className="font-medium text-foreground text-sm">{(order.vendors as any)?.business_name ?? "Unknown"}</p>
                  <p className="text-xs text-muted-foreground capitalize">{order.meal_type} · {format(new Date(order.delivery_date), "dd MMM yyyy")}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground text-sm">₹{Number(order.amount).toLocaleString()}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusColor(order.status)}`}>
                    {order.status.replace("_", " ")}
                  </span>
                </div>
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
