import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, TrendingUp, Calendar, CalendarRange, Wallet, ArrowUpRight, BarChart3, TrendingDown, Layers, PieChart, Activity, ChevronRight, Zap } from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";
import NumberTicker from "@/components/ui/number-ticker";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function EarningsPage() {
  const { user } = useAuth();

  const { data: vendor } = useQuery({
    queryKey: ["vendor-profile", user?.id],
    enabled: !!user,
    queryFn: () => api.get<any>("/vendors/me"),
  });

  const { data: orders, isLoading } = useQuery({
    queryKey: ["vendor-earnings", vendor?.id],
    enabled: !!vendor,
    queryFn: () => api.get<any[]>("/orders/vendor/earnings"),
  });

  const today = format(new Date(), "yyyy-MM-dd");
  const last7 = format(subDays(startOfDay(new Date()), 7), "yyyy-MM-dd");
  const last30 = format(subDays(startOfDay(new Date()), 30), "yyyy-MM-dd");

  const todayEarnings = orders?.filter((o) => o.deliveryDate === today).reduce((s, o) => s + Number(o.price), 0) ?? 0;
  const weekEarnings = orders?.filter((o) => o.deliveryDate >= last7).reduce((s, o) => s + Number(o.price), 0) ?? 0;
  const monthEarnings = orders?.filter((o) => o.deliveryDate >= last30).reduce((s, o) => s + Number(o.price), 0) ?? 0;
  const totalEarnings = orders?.reduce((s, o) => s + Number(o.price), 0) ?? 0;

  const dailyMap = new Map<string, number>();
  orders?.slice(0, 100).forEach((o) => {
    if (o.deliveryDate) {
      dailyMap.set(o.deliveryDate, (dailyMap.get(o.deliveryDate) ?? 0) + Number(o.price));
    }
  });
  const dailyBreakdown = Array.from(dailyMap.entries()).slice(0, 14).sort((a, b) => b[0].localeCompare(a[0]));

  if (isLoading) {
    return (
      <div className="space-y-12 animate-pulse">
        <div className="h-32 premium-card" />
        <div className="grid md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 premium-card" />
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Today's Earnings", value: <NumberTicker value={todayEarnings} prefix="₹" />, icon: Activity, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
    { label: "This Week", value: <NumberTicker value={weekEarnings} prefix="₹" />, icon: BarChart3, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { label: "This Month", value: <NumberTicker value={monthEarnings} prefix="₹" />, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Total Revenue", value: <NumberTicker value={totalEarnings} prefix="₹" />, icon: Wallet, color: "text-violet-500", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-24"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="badge-premium">Revenue</span>
            <div className="w-1 h-1 rounded-full bg-border" />
            <span className="text-[10px] font-semibold text-muted-foreground/60">Financial Overview</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-none">
            Earnings <span className="text-primary">Reports</span>.
          </h2>
          <p className="text-muted-foreground font-medium text-base max-w-2xl">Track your sales and revenue across different time periods.</p>
        </div>

        <div className="flex items-center gap-3 bg-green-500/10 px-5 py-3 rounded-xl border border-green-500/20 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-green-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <Zap className="h-4 w-4 text-green-600 relative z-10" />
          <div className="relative z-10">
            <p className="text-[9px] font-bold text-green-600/60 leading-none mb-1 uppercase tracking-widest">Status</p>
            <p className="text-xs font-bold text-green-600 tracking-tight">Verified Vendor</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: "circOut" }}
            className="premium-card p-6 relative overflow-hidden group/stat"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} opacity-20 rounded-full blur-[30px] -mr-12 -mt-12 transition-transform duration-500 group-hover/stat:scale-110`} />
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between mb-8">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center border border-white/10 shadow-inner`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <Badge variant="outline" className="text-[9px] font-bold bg-background/50 border-border/40 opacity-40 uppercase tracking-widest px-2 py-0.5"> STAT </Badge>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1 opacity-60">{stat.label}</p>
                <div className="text-2xl font-bold text-foreground tracking-tight flex items-baseline gap-2">
                  {stat.value}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="lg:col-span-12 premium-card p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[80px] -mr-40 -mt-40 pointer-events-none" />

        <div className="flex items-center justify-between mb-10 px-2">
          <div className="space-y-1">
            <h2 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight flex items-center gap-3">
              <div className="w-1.5 h-6 bg-primary rounded-full shadow-lg" />
              Daily Breakdown
            </h2>
            <p className="text-[10px] text-muted-foreground/50 font-bold uppercase tracking-widest pl-4">Recent earnings per day</p>
          </div>
          <Badge variant="outline" className="font-bold text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full bg-muted/20 border-border/40">LAST 14 DAYS</Badge>
        </div>

        <AnimatePresence mode="popLayout">
          {dailyBreakdown.length > 0 ? (
            <motion.div
              layout
              className="grid gap-6"
            >
              {dailyBreakdown.map(([date, amount], index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={date}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between rounded-xl p-5 bg-muted/20 border border-primary/10 transition-all duration-300 hover:border-primary/30 group/row"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-background border border-border/60 flex items-center justify-center shadow-inner group-hover/row:rotate-3 transition-transform duration-500">
                      <Calendar className="h-5 w-5 text-muted-foreground/60 group-hover/row:text-primary transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-base tracking-tight mb-1">{format(new Date(date), "EEEE, dd MMMM")}</h4>
                      <p className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-widest">Protocol Settled</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end mt-4 sm:mt-0">
                    <p className="text-xl font-bold text-primary tracking-tighter">₹{amount.toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                      <span className="text-[10px] text-green-600/70 font-bold uppercase tracking-widest">Ready</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="premium-card p-32 text-center border-dashed"
            >
              <div className="w-24 h-24 bg-muted/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Wallet className="h-10 w-10 text-muted-foreground/20" />
              </div>
              <h3 className="text-2xl font-bold text-foreground tracking-tight mb-4">No Earnings Yet</h3>
              <p className="text-muted-foreground mt-3 font-medium text-base max-w-lg mx-auto leading-relaxed">You haven't made any sales yet. Your earnings will appear here once customers start ordering.</p>
              <div className="mt-10 inline-block">
                <Button
                  className="h-14 px-10 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                >
                  Start Selling
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
