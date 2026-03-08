import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { DollarSign } from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";

export default function EarningsPage() {
  const { user } = useAuth();

  const { data: vendor } = useQuery({
    queryKey: ["vendor-profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("vendors").select("*").eq("user_id", user!.id).maybeSingle();
      return data;
    },
  });

  const { data: orders, isLoading } = useQuery({
    queryKey: ["vendor-earnings", vendor?.id],
    enabled: !!vendor,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("amount, status, delivery_date, created_at")
        .eq("vendor_id", vendor!.id)
        .neq("status", "cancelled")
        .order("delivery_date", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const today = format(new Date(), "yyyy-MM-dd");
  const last7 = format(subDays(startOfDay(new Date()), 7), "yyyy-MM-dd");
  const last30 = format(subDays(startOfDay(new Date()), 30), "yyyy-MM-dd");

  const todayEarnings = orders?.filter((o) => o.delivery_date === today).reduce((s, o) => s + Number(o.amount), 0) ?? 0;
  const weekEarnings = orders?.filter((o) => o.delivery_date >= last7).reduce((s, o) => s + Number(o.amount), 0) ?? 0;
  const monthEarnings = orders?.filter((o) => o.delivery_date >= last30).reduce((s, o) => s + Number(o.amount), 0) ?? 0;
  const totalEarnings = orders?.reduce((s, o) => s + Number(o.amount), 0) ?? 0;

  // Group by date for recent breakdown
  const dailyMap = new Map<string, number>();
  orders?.slice(0, 100).forEach((o) => {
    dailyMap.set(o.delivery_date, (dailyMap.get(o.delivery_date) ?? 0) + Number(o.amount));
  });
  const dailyBreakdown = Array.from(dailyMap.entries()).slice(0, 14);

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" /> Earnings
        </h2>
        <p className="text-muted-foreground text-sm mt-1">Track your revenue and earnings</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today", value: `₹${todayEarnings.toLocaleString()}`, icon: "📅" },
          { label: "This Week", value: `₹${weekEarnings.toLocaleString()}`, icon: "📊" },
          { label: "This Month", value: `₹${monthEarnings.toLocaleString()}`, icon: "📈" },
          { label: "All Time", value: `₹${totalEarnings.toLocaleString()}`, icon: "💰" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="glass-card rounded-2xl p-6 hover:shadow-card-hover transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className="font-heading text-2xl font-bold text-foreground mt-2">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-heading font-semibold text-foreground text-lg mb-4">Daily Breakdown</h3>
        {dailyBreakdown.length > 0 ? (
          <div className="space-y-2">
            {dailyBreakdown.map(([date, amount]) => (
              <div key={date} className="flex items-center justify-between border border-border/30 rounded-xl p-3 glass-subtle">
                <p className="text-sm text-foreground">{format(new Date(date), "EEE, dd MMM yyyy")}</p>
                <p className="font-heading font-bold text-foreground">₹{amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No earnings data yet.</p>
        )}
      </div>
    </motion.div>
  );
}
