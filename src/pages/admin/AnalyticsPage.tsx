import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";

export default function AnalyticsPage() {
  const { data: orders } = useQuery({
    queryKey: ["admin-analytics-orders"],
    queryFn: async () => {
      const { data } = await supabase
        .from("orders")
        .select("amount, status, delivery_date, meal_type")
        .neq("status", "cancelled");
      return data ?? [];
    },
  });

  const { data: subscriptions } = useQuery({
    queryKey: ["admin-analytics-subs"],
    queryFn: async () => {
      const { data } = await supabase.from("subscriptions").select("status, plan_type, amount");
      return data ?? [];
    },
  });

  const today = format(new Date(), "yyyy-MM-dd");
  const last7 = format(subDays(startOfDay(new Date()), 7), "yyyy-MM-dd");
  const last30 = format(subDays(startOfDay(new Date()), 30), "yyyy-MM-dd");

  const todayRev = orders?.filter((o) => o.delivery_date === today).reduce((s, o) => s + Number(o.amount), 0) ?? 0;
  const weekRev = orders?.filter((o) => o.delivery_date >= last7).reduce((s, o) => s + Number(o.amount), 0) ?? 0;
  const monthRev = orders?.filter((o) => o.delivery_date >= last30).reduce((s, o) => s + Number(o.amount), 0) ?? 0;
  const totalRev = orders?.reduce((s, o) => s + Number(o.amount), 0) ?? 0;

  const activeSubs = subscriptions?.filter((s) => s.status === "active").length ?? 0;
  const totalSubRev = subscriptions?.filter((s) => s.status === "active").reduce((s, o) => s + Number(o.amount), 0) ?? 0;

  // Meal type breakdown
  const mealCounts: Record<string, number> = {};
  orders?.forEach((o) => { mealCounts[o.meal_type] = (mealCounts[o.meal_type] ?? 0) + 1; });

  // Daily breakdown (last 14 days)
  const dailyMap = new Map<string, number>();
  orders?.forEach((o) => {
    if (o.delivery_date >= last30) {
      dailyMap.set(o.delivery_date, (dailyMap.get(o.delivery_date) ?? 0) + Number(o.amount));
    }
  });
  const dailyBreakdown = Array.from(dailyMap.entries()).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 14);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" /> Analytics
        </h2>
        <p className="text-muted-foreground text-sm mt-1">Platform revenue and insights</p>
      </div>

      {/* Revenue Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today", value: `₹${todayRev.toLocaleString()}`, icon: "📅" },
          { label: "This Week", value: `₹${weekRev.toLocaleString()}`, icon: "📊" },
          { label: "This Month", value: `₹${monthRev.toLocaleString()}`, icon: "📈" },
          { label: "All Time", value: `₹${totalRev.toLocaleString()}`, icon: "💰" },
        ].map((stat) => (
          <motion.div key={stat.label} whileHover={{ y: -4 }} className="glass-card rounded-2xl p-6 hover:shadow-card-hover transition-all">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className="font-heading text-2xl font-bold text-foreground mt-2">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Subscription & Meal Stats */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-heading font-semibold text-foreground text-lg mb-4">Subscriptions</h3>
          <div className="space-y-3">
            <div className="flex justify-between border border-border/30 rounded-xl p-3 glass-subtle">
              <span className="text-sm text-muted-foreground">Active Subscriptions</span>
              <span className="font-heading font-bold text-foreground">{activeSubs}</span>
            </div>
            <div className="flex justify-between border border-border/30 rounded-xl p-3 glass-subtle">
              <span className="text-sm text-muted-foreground">Monthly Subscription Revenue</span>
              <span className="font-heading font-bold text-foreground">₹{totalSubRev.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-heading font-semibold text-foreground text-lg mb-4">Meal Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(mealCounts).length > 0 ? Object.entries(mealCounts).map(([type, count]) => (
              <div key={type} className="flex justify-between border border-border/30 rounded-xl p-3 glass-subtle">
                <span className="text-sm text-muted-foreground capitalize">{type}</span>
                <span className="font-heading font-bold text-foreground">{count} orders</span>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground text-center py-2">No data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Daily Breakdown */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-heading font-semibold text-foreground text-lg mb-4">Daily Revenue (Last 14 Days)</h3>
        {dailyBreakdown.length > 0 ? (
          <div className="space-y-2">
            {dailyBreakdown.map(([date, amount]) => {
              const maxAmount = Math.max(...dailyBreakdown.map(([, a]) => a));
              const width = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
              return (
                <div key={date} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-28 flex-shrink-0">{format(new Date(date), "EEE, dd MMM")}</span>
                  <div className="flex-1 h-6 bg-muted/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${width}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    />
                  </div>
                  <span className="font-heading font-bold text-foreground text-sm w-20 text-right">₹{amount.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No revenue data yet.</p>
        )}
      </div>
    </motion.div>
  );
}
