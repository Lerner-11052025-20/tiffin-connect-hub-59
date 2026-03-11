import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { TrendingUp, Package, Utensils, Wallet, ArrowUpRight, RotateCcw, Calendar, Star, ShieldCheck, Target, Bell, History } from "lucide-react";
import { Link } from "react-router-dom";
import NumberTicker from "@/components/ui/number-ticker";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import OrderDialog from "@/components/order/OrderDialog";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Cell 
} from "recharts";

export default function DashboardHome() {
  const { user } = useAuth();

  const { data: subscription } = useQuery({
    queryKey: ["active-subscription", user?.id],
    enabled: !!user,
    queryFn: () => api.get<any>("/subscriptions/active"),
  });

  const { data: recentOrders } = useQuery({
    queryKey: ["recent-orders-today", user?.id],
    enabled: !!user,
    queryFn: () => api.get<any[]>("/orders?limit=5"),
  });

  const profile = user;
  const totalSpent = recentOrders?.reduce((sum, o) => sum + Number(o.price), 0) ?? 0;

  // Process data for 14-day spending trend
  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return format(d, "yyyy-MM-dd");
  });

  const spendingTrendData = last14Days.map(date => {
    const dailyTotal = recentOrders
      ?.filter(o => o.deliveryDate === date)
      .reduce((sum, o) => sum + Number(o.price), 0) ?? 0;
    return {
      date: format(new Date(date), "dd MMM"),
      amount: dailyTotal
    };
  });

  // Culinary profile distribution
  const culinaryMap = recentOrders?.reduce((acc: any, o: any) => {
    const name = o.mealName || "Standard";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {}) || {};

  const culinaryData = Object.entries(culinaryMap).map(([name, value]) => ({ name, value }));

  const DASHBOARD_COLORS = ["#0ea5e9", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899"];

  const [reorderMenu, setReorderMenu] = useState<any>(null);
  const [isReorderOpen, setIsReorderOpen] = useState(false);

  const handleReorder = async (mealId: string) => {
    try {
      const data = await api.get<any>(`/menus/${mealId}`);
      if (!data || !data.is_available) {
        toast.error(
          "This meal is currently unavailable. Please browse the latest menu."
        );
        return;
      }
      setReorderMenu(data);
      setIsReorderOpen(true);
    } catch (err) {
      toast.error("Failed to retrieve meal details.");
    }
  };

  const stats = [
    {
      label: "Subscription Plan",
      value: subscription?.plan_type ? subscription.plan_type.charAt(0).toUpperCase() + subscription.plan_type.slice(1) : "None",
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      label: "Selected Meal",
      value: subscription?.meal_type ? subscription.meal_type.charAt(0).toUpperCase() + subscription.meal_type.slice(1) : "None",
      icon: Utensils,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
    },
    {
      label: "Orders This Month",
      value: <NumberTicker value={recentOrders?.length ?? 0} />,
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      label: "Total Spent",
      value: <NumberTicker value={totalSpent} prefix="₹" />,
      icon: Wallet,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-24"
    >
      {/* Premium Greeting */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-2">
              <Target className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80 leading-none">Overview</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <span className="text-[10px] font-semibold text-muted-foreground/60">{format(new Date(), "EEEE, dd MMMM")}</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-none">
            Welcome, <span className="text-primary">{profile?.full_name?.split(' ')[0] || "User"}</span>
          </h2>
          <p className="text-muted-foreground font-medium text-base max-w-2xl">Manage your subscriptions and meal activity.</p>
        </div>

        <div className="flex items-center gap-4 pt-2 lg:pt-0">
          {recentOrders && recentOrders.length > 0 && (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => handleReorder(recentOrders[0].mealId)}
                className="gap-3 font-bold uppercase tracking-widest text-[10px] h-12 rounded-xl px-8 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 transition-all shadow-lg group border-none"
              >
                <RotateCcw className="h-3.5 w-3.5 group-hover:rotate-[-180deg] transition-transform duration-500" /> Reorder last
              </Button>
            </motion.div>
          )}
          <div className="w-12 h-12 rounded-xl bg-card border border-border/50 flex items-center justify-center shadow-lg hover:bg-muted/10 transition-colors cursor-pointer relative">
            <Bell className="h-5 w-5 text-foreground" />
            <div className="absolute top-3.5 right-3.5 w-2 h-2 bg-primary rounded-full border-2 border-card" />
          </div>
        </div>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: "circOut" }}
            className={`premium-card p-6 group transition-all duration-500 relative overflow-hidden`}
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} opacity-20 rounded-full blur-[30px] -mr-12 -mt-12 transition-transform duration-700 group-hover:scale-150`} />
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between mb-8">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center border border-white/5 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <Badge variant="outline" className="text-[9px] font-semibold bg-background/50 border-border/40 opacity-50 px-2"> Live </Badge>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1.5 opacity-60">{stat.label}</p>
                <div className="text-3xl font-bold text-foreground tracking-tight flex items-baseline gap-2">
                  {stat.value}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Complex Analytics Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Spending Trend Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="premium-card p-6 lg:p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -ml-32 -mt-32 pointer-events-none" />
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-3">
                <div className="w-1 h-5 bg-primary rounded-full" />
                Spending Velocity
              </h2>
              <p className="text-[10px] text-muted-foreground/50 font-bold uppercase tracking-widest pl-4">14-Day Financial Log</p>
            </div>
            <div className="flex items-center gap-2">
              <History className="h-3.5 w-3.5 text-muted-foreground/40" />
              <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">Historical Pulse</span>
            </div>
          </div>

          <div className="h-[200px] w-full">
            {spendingTrendData.some(d => d.amount > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={spendingTrendData}>
                  <defs>
                    <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)', fontWeight: 'bold' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)', fontWeight: 'bold' }}
                    tickFormatter={(val) => `₹${val}`}
                  />
                  <Tooltip 
                    cursor={{ stroke: '#0ea5e9', strokeWidth: 1 }}
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      background: 'rgba(10, 10, 15, 0.98)', 
                      backdropFilter: 'blur(12px)',
                      padding: '12px 16px',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}
                    itemStyle={{ color: '#ffffff', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#0ea5e9" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorSpend)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-muted/5 rounded-2xl border border-dashed border-border/20">
                <History className="w-10 h-10 text-muted-foreground/10 mb-4" />
                <p className="text-muted-foreground/30 font-bold uppercase tracking-widest text-[9px]">Awaiting spending sequence</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Culinary Profile distribution */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="premium-card p-6 lg:p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-3">
                <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                Culinary Profile
              </h2>
              <p className="text-[10px] text-muted-foreground/50 font-bold uppercase tracking-widest pl-4">Personal Tiffin Breakdown</p>
            </div>
            <div className="px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/20 text-[9px] font-bold uppercase tracking-widest text-emerald-500">Dietary Intelligence</div>
          </div>

          <div className="h-[200px] w-full flex items-center justify-center">
            {culinaryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={culinaryData}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 8, fill: 'rgba(255,255,255,0.3)', fontWeight: 'bold' }}
                    hide
                  />
                  <YAxis axisLine={false} tickLine={false} hide />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      background: 'rgba(10, 10, 15, 0.98)', 
                      backdropFilter: 'blur(12px)',
                      padding: '12px 16px',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}
                    itemStyle={{ color: '#ffffff', fontSize: '11px', fontWeight: '800' }}
                    labelStyle={{ display: 'none' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={30} animationDuration={1500}>
                    {culinaryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={DASHBOARD_COLORS[index % DASHBOARD_COLORS.length]} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-muted/10 rounded-3xl border border-dashed border-border/20">
                <Utensils className="w-8 h-8 text-muted-foreground/10 mb-3" />
                <p className="text-muted-foreground/30 font-bold uppercase tracking-widest text-[8px]">Awaiting meal logs</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Featured Planner Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="relative overflow-hidden group shadow-xl rounded-[2.5rem]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-400" />
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white opacity-10 rounded-full blur-[80px]" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between p-10 lg:p-14 gap-10">
          <div className="max-w-xl space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20">
              <Calendar className="h-4 w-4 text-white" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white">Meal Planner</span>
            </div>
            <div className="space-y-3">
              <h3 className="text-4xl lg:text-5xl font-bold text-white tracking-tight leading-none">
                Plan Your <span className="text-emerald-950/40 italic">Weekly Budget</span>
              </h3>
              <p className="text-emerald-50/90 font-medium text-base lg:text-lg leading-relaxed">
                Choose meals for the entire week to save time and money.
              </p>
            </div>
          </div>
          <Link to="/dashboard/planner" className="shrink-0 transition-all duration-500 hover:scale-105 active:scale-95">
            <Button size="lg" className="h-16 px-10 rounded-2xl bg-white text-emerald-600 font-bold uppercase tracking-widest text-[11px] hover:bg-emerald-50 transition-all shadow-xl group border-none">
              Start Planning
              <ArrowUpRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Button>
          </Link>
        </div>
      </motion.div>

      <div className="space-y-8">
        {/* Active Subscription - Full Width */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="premium-card p-8 lg:p-10 group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-primary rounded-full shadow-lg" />
                <h2 className="font-bold text-foreground text-2xl lg:text-3xl tracking-tight">Your Subscription</h2>
              </div>
              <p className="text-xs text-muted-foreground font-semibold pl-5 opacity-60">Manage your recurring meal plan.</p>
            </div>
            <Link to="/dashboard/subscription">
              <Button className="h-14 px-8 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-lg border-none">
                Manage Plan
              </Button>
            </Link>
          </div>

          {subscription ? (
            <div className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Provider", value: (subscription.vendors as any)?.business_name, icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
                  { label: "Plan Type", value: subscription.plan_type, capitalize: true, icon: ShieldCheck, color: "text-blue-500", bg: "bg-blue-500/10" },
                  { label: "Meal Type", value: subscription.meal_type, capitalize: true, icon: Utensils, color: "text-orange-500", bg: "bg-orange-500/10" },
                  { label: "Premium", value: `₹${Number(subscription.amount).toLocaleString()}`, icon: Wallet, color: "text-violet-500", bg: "bg-violet-500/10" },
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -3 }}
                    className="p-6 rounded-[2rem] bg-muted/20 border border-border/40 group/item hover:bg-card hover:border-primary/20 transition-all duration-500 shadow-inner"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center border border-white/5 group-hover/item:scale-110 transition-transform duration-500`}>
                        <item.icon className={`h-6 w-6 ${item.color}`} />
                      </div>
                      <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">{item.label}</p>
                    </div>
                    <p className={`font-bold text-foreground text-xl lg:text-2xl tracking-tight group-hover/item:text-primary transition-colors ${item.capitalize ? 'capitalize' : ''}`}>
                      {item.value || "Not Set"}
                    </p>
                  </motion.div>
                ))}
              </div>
              
              <div className="p-8 rounded-[2.5rem] bg-zinc-900 dark:bg-zinc-100 flex flex-col md:flex-row items-center justify-between shadow-xl group/status overflow-hidden relative">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-[60px] -mr-24 -mt-24 pointer-events-none" />
                <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
                  <p className="text-[9px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest mb-2 opacity-60">Status Overview</p>
                  <p className="text-white dark:text-zinc-900 font-bold text-xl lg:text-2xl tracking-tight">Active until {subscription.end_date ? format(new Date(subscription.end_date), "dd MMM yyyy") : "Service Active"}</p>
                </div>
                <div className="flex items-center gap-4 relative z-10">
                   <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-800 dark:bg-zinc-200" />)}
                   </div>
                   <Badge className="bg-primary text-white font-bold uppercase tracking-widest text-[10px] px-8 py-3 rounded-full shadow-lg border-none">ACTIVE</Badge>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/10 rounded-[3rem] border-2 border-dashed border-border/40 transition-all backdrop-blur-sm relative overflow-hidden">
              <div className="w-24 h-24 bg-muted/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Utensils className="h-10 w-10 text-muted-foreground/30" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 tracking-tight">No Active Plan</h3>
              <p className="text-muted-foreground text-base max-w-sm mx-auto mb-10 font-medium leading-relaxed">Choose a kitchen partner to start your healthy meal journey today.</p>
              <Link to="/dashboard/meals">
                <Button className="rounded-xl font-bold uppercase tracking-widest text-[11px] px-10 h-14 bg-primary text-white hover:scale-105 transition-all shadow-lg">Explore Partners</Button>
              </Link>
            </div>
          )}
        </motion.div>

        {/* Recent Orders - Full Width */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="premium-card p-8 lg:p-10 group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] -ml-48 -mt-48 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-accent rounded-full shadow-lg" />
                <h2 className="font-bold text-foreground text-2xl lg:text-3xl tracking-tight">Recent Activity</h2>
              </div>
              <p className="text-xs text-muted-foreground font-semibold pl-5 opacity-60">Track your latest meal deliveries.</p>
            </div>
            <Link to="/dashboard/history" className="group/all">
              <Button variant="outline" className="h-14 px-8 rounded-xl border-border/60 bg-background/50 backdrop-blur-md font-bold uppercase tracking-widest text-[10px] hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all flex items-center justify-center gap-3 group/btn">
                <span>Dispatch History</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
              </Button>
            </Link>
          </div>

          <div className="space-y-4 relative z-10">
            <AnimatePresence mode="popLayout">
              {recentOrders && recentOrders.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-4">
                    {recentOrders.map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.5, ease: "circOut" }}
                        className="flex flex-col md:flex-row items-center justify-between rounded-[2rem] p-6 lg:p-8 bg-muted/20 border border-border/30 hover:bg-card hover:border-primary/20 transition-all duration-500 cursor-default group/order gap-6"
                      >
                        <div className="flex items-center gap-6 flex-1 w-full">
                          <div className="w-16 h-16 rounded-2xl bg-background flex items-center justify-center border border-border shadow-inner group-hover/order:border-primary/20 group-hover/order:rotate-2 transition-all duration-500 shrink-0">
                            <span className="text-3xl drop-shadow-sm">🍱</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1.5">
                               <p className="text-[9px] font-bold text-primary uppercase tracking-widest leading-none">#{order.id.slice(-6).toUpperCase()}</p>
                               <div className="w-1 h-1 rounded-full bg-border" />
                               <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest leading-none">{order.deliveryDate ? format(new Date(order.deliveryDate), "dd MMM") : "Today"}</p>
                            </div>
                            <h4 className="font-bold text-foreground text-xl lg:text-2xl tracking-tight leading-none mb-2 truncate group-hover/order:text-primary transition-colors">
                                {(order.vendors as any)?.business_name}
                            </h4>
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="outline" className="text-[9px] font-bold bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-widest border-primary/20">{order.mealName}</Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-border/10">
                          <div className="text-right">
                             <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5 opacity-60">Price</p>
                             <p className="font-bold text-2xl text-foreground tracking-tight">₹{Number(order.price).toLocaleString()}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2 min-w-[120px]">
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5 opacity-60">Status</p>
                            <span className={`text-[9px] px-4 py-1.5 rounded-full capitalize font-bold leading-none border shadow-md ${
                              order.orderStatus === "delivered" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                              order.orderStatus === "pending" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                              order.orderStatus === "confirmed" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                              order.orderStatus === "preparing" ? "bg-indigo-500/10 text-indigo-600 border-indigo-600" :
                              "bg-zinc-500/10 text-zinc-600 border-zinc-600"
                            }`}>
                              {order.orderStatus}
                            </span>
                          </div>
                          <Link to={`/dashboard/track/${order.id}`} className="hidden lg:block">
                            <Button size="icon" className="h-10 w-10 rounded-xl bg-muted/20 text-muted-foreground hover:bg-primary hover:text-white transition-all border-none">
                              <ArrowUpRight className="h-5 w-5" />
                            </Button>
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <Link to="/dashboard/history" className="block mt-8">
                    <Button className="w-full h-14 rounded-2xl bg-muted/10 border-2 border-dashed border-border/40 font-bold uppercase tracking-widest text-[10px] hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-3 text-muted-foreground">
                      <History className="h-4 w-4" /> Activity Log
                    </Button>
                  </Link>
                </>
              ) : (
                <div className="text-center py-24 bg-muted/10 rounded-[3rem] border-2 border-dashed border-border/40 transition-all relative overflow-hidden">
                  <History className="h-12 w-12 text-muted-foreground/20 mx-auto mb-6 relative z-10" />
                  <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] opacity-60 relative z-10">No recent activity</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

      <OrderDialog
        menu={reorderMenu}
        open={isReorderOpen}
        onOpenChange={(open) => {
          setIsReorderOpen(open);
          if (!open) setTimeout(() => setReorderMenu(null), 300);
        }}
      />
      </div>
    </motion.div>
  );
}
