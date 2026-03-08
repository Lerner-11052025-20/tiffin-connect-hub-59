import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { TrendingUp, Package, Utensils, Wallet, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
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

  const stats = [
    {
      label: "Active Plan",
      value: subscription?.plan_type ? subscription.plan_type.charAt(0).toUpperCase() + subscription.plan_type.slice(1) : "None",
      icon: TrendingUp,
      gradient: "gradient-hero",
    },
    {
      label: "Meal Type",
      value: subscription?.meal_type ? subscription.meal_type.charAt(0).toUpperCase() + subscription.meal_type.slice(1) : "—",
      icon: Utensils,
      gradient: "gradient-warm",
    },
    {
      label: "Recent Orders",
      value: String(recentOrders?.length ?? 0),
      icon: Package,
      gradient: "gradient-cool",
    },
    {
      label: "Total Spent",
      value: `₹${totalSpent.toLocaleString()}`,
      icon: Wallet,
      gradient: "gradient-sunset",
    },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Greeting */}
      <motion.div variants={item}>
        <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-foreground">
          Welcome back, {profile?.full_name || "there"} 👋
        </h2>
        <p className="text-muted-foreground text-sm mt-1.5">Here's your meal overview for today</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={container} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={item}
            whileHover={{ y: -4, transition: { duration: 0.25 } }}
            className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl ${stat.gradient} flex items-center justify-center shadow-soft`}>
                <stat.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
            </div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
            <p className="font-heading text-2xl font-extrabold text-foreground mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Active Subscription */}
      <motion.div variants={item} className="bg-card rounded-2xl p-7 shadow-card hover:shadow-card-hover transition-all duration-300">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading font-bold text-foreground text-lg">Active Subscription</h2>
          <Link to="/dashboard/subscription" className="text-xs text-primary font-semibold hover:underline">View all →</Link>
        </div>
        {subscription ? (
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                <span className="text-muted-foreground">Vendor</span>
                <span className="font-semibold text-foreground">{(subscription.vendors as any)?.business_name}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-semibold text-foreground capitalize">{subscription.plan_type}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                <span className="text-muted-foreground">Meals</span>
                <span className="font-semibold text-foreground capitalize">{subscription.meal_type}</span>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-semibold text-foreground">₹{Number(subscription.amount).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                <span className="text-muted-foreground">Start</span>
                <span className="font-semibold text-foreground">{format(new Date(subscription.start_date), "dd MMM yyyy")}</span>
              </div>
              {subscription.end_date && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                  <span className="text-muted-foreground">End</span>
                  <span className="font-semibold text-foreground">{format(new Date(subscription.end_date), "dd MMM yyyy")}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-10 bg-muted/20 rounded-2xl">
            <span className="text-5xl block mb-4">🍽️</span>
            <p className="text-muted-foreground font-medium">No active subscription yet.</p>
            <Link to="/dashboard/meals" className="text-sm text-primary font-semibold hover:underline mt-2 inline-block">
              Browse meals to get started →
            </Link>
          </div>
        )}
      </motion.div>

      {/* Recent Orders */}
      <motion.div variants={item} className="bg-card rounded-2xl p-7 shadow-card hover:shadow-card-hover transition-all duration-300">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading font-bold text-foreground text-lg">Recent Orders</h2>
          <Link to="/dashboard/history" className="text-xs text-primary font-semibold hover:underline">View all →</Link>
        </div>
        {recentOrders && recentOrders.length > 0 ? (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <motion.div
                key={order.id}
                whileHover={{ x: 4 }}
                className="flex items-center justify-between rounded-xl p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{(order.vendors as any)?.business_name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{order.meal_type} · {format(new Date(order.delivery_date), "dd MMM yyyy")}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground text-sm">₹{Number(order.amount).toLocaleString()}</p>
                  <span className={`text-xs px-2.5 py-1 rounded-full capitalize font-medium ${
                    order.status === "delivered" ? "bg-primary/10 text-primary" :
                    order.status === "pending" ? "bg-warning/10 text-warning" :
                    order.status === "cancelled" ? "bg-destructive/10 text-destructive" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-muted/20 rounded-2xl">
            <span className="text-5xl block mb-4">📦</span>
            <p className="text-muted-foreground font-medium">No orders yet.</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
