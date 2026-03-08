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

export default function DashboardHome() {
  const { user } = useAuth();

  const { data: subscription } = useQuery({
    queryKey: ["active-subscription", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("subscriptions")
        .select("*, vendors(business_name), menus(name, items, meal_type)")
        .eq("user_id", user!.id)
        .eq("status", "active")
        .maybeSingle();
      return data;
    },
  });

  const { data: recentOrders } = useQuery({
    queryKey: ["recent-orders", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("orders")
        .select("*, vendors(business_name)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(5);
      return data ?? [];
    },
  });

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
  });

  const totalSpent = recentOrders?.reduce((sum, o) => sum + Number(o.amount), 0) ?? 0;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Greeting */}
      <motion.div variants={item}>
        <h2 className="font-heading text-2xl font-bold text-foreground">
          Welcome back, {profile?.full_name || "there"} 👋
        </h2>
        <p className="text-muted-foreground text-sm mt-1">Here's your meal overview</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={container} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Active Plan",
            value: subscription?.plan_type ? subscription.plan_type.charAt(0).toUpperCase() + subscription.plan_type.slice(1) : "None",
            icon: "📋",
            gradient: "from-primary/10 to-accent/10",
          },
          {
            label: "Meal Type",
            value: subscription?.meal_type ? subscription.meal_type.charAt(0).toUpperCase() + subscription.meal_type.slice(1) : "—",
            icon: "🍱",
            gradient: "from-accent/10 to-primary/5",
          },
          {
            label: "Recent Orders",
            value: String(recentOrders?.length ?? 0),
            icon: "📦",
            gradient: "from-primary/5 to-accent/10",
          },
          {
            label: "Total Spent",
            value: `₹${totalSpent.toLocaleString()}`,
            icon: "💰",
            gradient: "from-accent/10 to-primary/10",
          },
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

      {/* Active Subscription */}
      <motion.div variants={item} className="glass-card rounded-2xl p-6 hover:shadow-card-hover transition-all duration-300">
        <h2 className="font-heading font-semibold text-foreground text-lg mb-4">Active Subscription</h2>
        {subscription ? (
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Vendor:</span> <span className="font-medium text-foreground">{(subscription.vendors as any)?.business_name}</span></p>
              <p><span className="text-muted-foreground">Plan:</span> <span className="font-medium text-foreground capitalize">{subscription.plan_type}</span></p>
              <p><span className="text-muted-foreground">Meals:</span> <span className="font-medium text-foreground capitalize">{subscription.meal_type}</span></p>
              <p><span className="text-muted-foreground">Amount:</span> <span className="font-medium text-foreground">₹{Number(subscription.amount).toLocaleString()}</span></p>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Start:</span> <span className="font-medium text-foreground">{format(new Date(subscription.start_date), "dd MMM yyyy")}</span></p>
              {subscription.end_date && <p><span className="text-muted-foreground">End:</span> <span className="font-medium text-foreground">{format(new Date(subscription.end_date), "dd MMM yyyy")}</span></p>}
              {subscription.lunch_time && <p><span className="text-muted-foreground">Lunch:</span> <span className="font-medium text-foreground">{subscription.lunch_time}</span></p>}
              {subscription.dinner_time && <p><span className="text-muted-foreground">Dinner:</span> <span className="font-medium text-foreground">{subscription.dinner_time}</span></p>}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <span className="text-4xl block mb-3">🍽️</span>
            <p className="text-muted-foreground">No active subscription yet.</p>
            <p className="text-sm text-muted-foreground mt-1">Browse meals to get started!</p>
          </div>
        )}
      </motion.div>

      {/* Recent Orders */}
      <motion.div variants={item} className="glass-card rounded-2xl p-6 hover:shadow-card-hover transition-all duration-300">
        <h2 className="font-heading font-semibold text-foreground text-lg mb-4">Recent Orders</h2>
        {recentOrders && recentOrders.length > 0 ? (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between border border-border/30 rounded-xl p-4 glass-subtle">
                <div>
                  <p className="font-medium text-foreground text-sm">{(order.vendors as any)?.business_name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{order.meal_type} · {format(new Date(order.delivery_date), "dd MMM yyyy")}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground text-sm">₹{Number(order.amount).toLocaleString()}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                    order.status === "delivered" ? "bg-green-100 text-green-700" :
                    order.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    order.status === "cancelled" ? "bg-red-100 text-red-700" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <span className="text-4xl block mb-3">📦</span>
            <p className="text-muted-foreground">No orders yet.</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
