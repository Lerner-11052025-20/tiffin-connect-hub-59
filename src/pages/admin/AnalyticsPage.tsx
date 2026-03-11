import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { TrendingUp, Calendar, Wallet, PieChart as PieChartIcon, Activity, ArrowRight, Zap } from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";
import NumberTicker from "@/components/ui/number-ticker";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar
} from "recharts";

export default function AnalyticsPage() {
  const [pulseTime, setPulseTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setPulseTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: () => api.get<any>("/admin/analytics"),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Compiling Intelligence</p>
      </div>
    );
  }

  const orders = analyticsData?.orders ?? [];
  const subscriptions = analyticsData?.subscriptions ?? [];

  const today = format(new Date(), "yyyy-MM-dd");
  const last7 = format(subDays(startOfDay(new Date()), 7), "yyyy-MM-dd");
  const last30 = format(subDays(startOfDay(new Date()), 30), "yyyy-MM-dd");

  const todayRev = orders?.filter((o: any) => o.deliveryDate === today).reduce((s: number, o: any) => s + Number(o.price || 0), 0) ?? 0;
  const weekRev = orders?.filter((o: any) => o.deliveryDate >= last7).reduce((s: number, o: any) => s + Number(o.price || 0), 0) ?? 0;
  const monthRev = orders?.filter((o: any) => o.deliveryDate >= last30).reduce((s: number, o: any) => s + Number(o.price || 0), 0) ?? 0;
  const totalRev = orders?.reduce((s: number, o: any) => s + Number(o.price || 0), 0) ?? 0;

  const activeSubs = subscriptions?.filter((s: any) => s.status === "active").length ?? 0;
  const totalSubRev = subscriptions?.filter((s: any) => s.status === "active").reduce((s: number, o: any) => s + Number(o.amount || 0), 0) ?? 0;

  // Meal type breakdown for PieChart
  const mealDistributionData = Object.entries(
    orders?.reduce((acc: any, o: any) => {
      const key = o.mealName || "Other";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {}) || {}
  ).map(([name, value]) => ({ name, value: Number(value) }));

  const COLORS = ["#00f2fe", "#4facfe", "#38bdf8", "#0ea5e9", "#0284c7"];

  // Daily breakdown trend processing
  const dailyMap = new Map<string, number>();
  orders?.forEach((o: any) => {
    if (o.deliveryDate >= last30) {
      dailyMap.set(o.deliveryDate, (dailyMap.get(o.deliveryDate) ?? 0) + Number(o.price || 0));
    }
  });

  const dailyTrendData = Array.from(dailyMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, amount]) => ({
      date: format(new Date(date), "dd MMM"),
      amount
    }));

  // Subscription Growth trend processing
  const subMap = new Map<string, number>();
  subscriptions?.forEach((s: any) => {
    const subDate = s.createdAt || s.start_date;
    if (subDate && subDate >= last30) {
      const dateKey = subDate.split('T')[0];
      subMap.set(dateKey, (subMap.get(dateKey) ?? 0) + 1);
    }
  });

  const subTrendData = Array.from(subMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({
      date: format(new Date(date), "dd MMM"),
      amount: count
    }));

  const revenueStats = [
    { label: "Daily Yield", value: todayRev, icon: Calendar, color: "text-primary", bg: "bg-primary/10" },
    { label: "Weekly Volume", value: weekRev, icon: Activity, color: "text-accent", bg: "bg-accent/10" },
    { label: "Monthly Growth", value: monthRev, icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Lifetime Asset", value: totalRev, icon: Wallet, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="badge-premium w-fit mb-1.5">
            <span>Advanced Analytics</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-none">
            Business <span className="text-primary">Viability</span>.
          </h2>
          <p className="text-muted-foreground font-medium text-base max-w-2xl">
            Sovereign oversight of platform health, revenue volatility, and culinary trends.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-card/40 backdrop-blur-md px-5 py-2.5 rounded-xl border border-border/40 shadow-lg">
          <Zap className="h-3.5 w-3.5 text-primary animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Pulse: <span className="text-foreground ml-2 font-mono">{format(pulseTime, "HH:mm:ss")}</span></span>
        </div>
      </div>

      {/* Primary Revenue Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {revenueStats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className="premium-card p-6 relative overflow-hidden group/stat"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-[30px] -mr-12 -mt-12 group-hover/stat:scale-110 transition-transform duration-500" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-8 border border-primary/20 shadow-inner">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1.5 opacity-60">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground tracking-tight leading-none">
                <NumberTicker value={stat.value} prefix="₹" />
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Trajectory Bar Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="premium-card p-8 relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="flex flex-col gap-0.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Expansion Metrics</p>
            <h3 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Platform Trajectory</h3>
          </div>
          <Badge variant="outline" className="bg-accent/5 border-accent/20 text-accent font-bold text-[9px] uppercase tracking-widest px-4 py-1.5 rounded-full">Growth Gradient</Badge>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyTrendData.slice(-7)}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 9, fill: 'var(--muted-foreground)', fontWeight: '800' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 9, fill: 'var(--muted-foreground)', fontWeight: '800' }}
              />
              <Tooltip 
                cursor={{ fill: 'var(--muted)', opacity: 0.1 }}
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: '1px solid var(--border)', 
                  background: 'var(--popover)', 
                  backdropFilter: 'blur(12px)',
                  padding: '12px 16px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
                itemStyle={{ color: 'var(--foreground)', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}
                labelStyle={{ display: 'none' }}
              />
              <Bar 
                dataKey="amount" 
                fill="#4facfe" 
                radius={[6, 6, 0, 0]} 
                animationDuration={1500}
              >
                {dailyTrendData.slice(-7).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Subscription Core Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="premium-card p-6 lg:p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col gap-0.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Recurring Revenue</p>
              <h3 className="text-xl lg:text-2xl font-bold tracking-tight text-foreground">Subscription Core</h3>
            </div>
            <div className="px-4 py-1.5 rounded-full bg-primary/5 border border-primary/20 text-[9px] font-bold uppercase tracking-widest text-primary">
              Live Assets
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-muted/20 border border-primary/10 flex items-center justify-between transition-all hover:bg-muted/30 group/sub">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-background border border-primary/10 flex items-center justify-center shadow-md">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest mb-0.5">Active Memberships</p>
                  <p className="text-2xl font-bold text-foreground">{activeSubs.toLocaleString()}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover/sub:opacity-100 transition-opacity" />
            </div>

            <div className="p-6 rounded-2xl bg-muted/20 border border-primary/10 flex items-center justify-between transition-all hover:bg-muted/30 group/mrr">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-background border border-primary/10 flex items-center justify-center shadow-md">
                  <Wallet className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest mb-0.5">Projected Volume</p>
                  <p className="text-2xl font-bold text-foreground">₹{totalSubRev.toLocaleString()}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover/mrr:opacity-100 transition-opacity" />
            </div>
          </div>
        </motion.div>

        {/* Product Performance Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="premium-card p-6 lg:p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col gap-0.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Market Share</p>
              <h3 className="text-xl lg:text-2xl font-bold tracking-tight text-foreground">Product Performance</h3>
            </div>
            <div className="px-4 py-1.5 rounded-full bg-accent/5 border border-accent/20 text-[9px] font-bold uppercase tracking-widest text-accent">
              Meal Velocity
            </div>
          </div>

          <div className="h-[280px] w-full flex items-center justify-center">
            {mealDistributionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mealDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {mealDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: '1px solid var(--border)', 
                      background: 'var(--popover)', 
                      backdropFilter: 'blur(12px)',
                      padding: '12px 16px',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)'
                    }}
                    itemStyle={{ 
                      color: 'var(--foreground)', 
                      fontSize: '11px', 
                      fontWeight: '800',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em'
                    }}
                    labelStyle={{ display: 'none' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground/30">
                <PieChartIcon className="w-8 h-8 mb-3 opacity-40" />
                <p className="font-bold tracking-widest uppercase text-[9px]">No distribution logs</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Volatility Trend Area */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="premium-card p-6 lg:p-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="flex flex-col gap-0.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Subscription Velocity</p>
            <h3 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">Trend Gradient</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
              <div className="w-2.5 h-2.5 bg-primary/10 border border-primary/30 rounded-xs" /> Platform Average
            </div>
          </div>
        </div>

        <div className="h-[400px] w-full mt-4">
          {subTrendData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={subTrendData}>
                <defs>
                  <linearGradient id="colorSubGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: 'var(--muted-foreground)', fontWeight: 'bold' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: 'var(--muted-foreground)', fontWeight: 'bold' }}
                  tickFormatter={(val) => `${val}`}
                />
                <Tooltip 
                  cursor={{ stroke: 'var(--primary)', strokeWidth: 1 }}
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: '1px solid var(--border)', 
                    background: 'var(--popover)', 
                    backdropFilter: 'blur(12px)',
                    padding: '12px 16px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                  }}
                  itemStyle={{ 
                    color: 'var(--foreground)', 
                    fontSize: '11px', 
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorSubGrowth)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 bg-muted/10 rounded-2xl border border-dashed border-border/20">
              <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center text-4xl mb-4 grayscale opacity-40">📈</div>
              <p className="text-muted-foreground/40 font-bold uppercase tracking-widest text-[10px]">Awaiting subscription sequence</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Revenue Flow Pulsation Area Chart */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="premium-card p-10 relative overflow-hidden group/pulse shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8 relative z-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground tracking-tight flex items-center gap-5">
              <div className="w-2.5 h-10 bg-primary/20 rounded-full flex items-center justify-center p-1.5 border border-primary/20">
                <div className="w-full h-full bg-primary rounded-full animate-pulse" />
              </div>
              Revenue Flow Pulsation
            </h2>
            <p className="text-xs text-muted-foreground/60 font-bold uppercase tracking-widest pl-14">Live 14-Day Financial Architecture</p>
          </div>
          <div className="flex items-center gap-3 bg-muted/20 px-6 py-3 rounded-2xl border border-white/5 shadow-inner backdrop-blur-md">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Growth Pulse Optimized</span>
          </div>
        </div>

        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyTrendData}>
              <defs>
                <linearGradient id="revenueFlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontWeight: '800' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontWeight: '800' }}
                tickFormatter={(val) => `₹${val}`}
              />
              <Tooltip 
                cursor={{ stroke: 'var(--primary)', strokeWidth: 2 }}
                contentStyle={{ 
                  borderRadius: '20px', 
                  border: '1px solid var(--border)', 
                  background: 'var(--popover)', 
                  backdropFilter: 'blur(20px)',
                  padding: '16px 20px',
                  boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.3)'
                }}
                itemStyle={{ color: 'var(--foreground)', fontSize: '13px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}
              />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#0ea5e9" 
                strokeWidth={4} 
                fillOpacity={1} 
                fill="url(#revenueFlow)" 
                animationDuration={2500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
