import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarDays, Users, Package, TrendingUp, Wallet, CheckCircle2, AlertCircle, ArrowUpRight, ChefHat, Activity, Zap, History, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import NumberTicker from "@/components/ui/number-ticker";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart as RePieChart,
  Pie,
  Cell 
} from "recharts";

export default function VendorHome() {
  const { user } = useAuth();

  const { data: vendor } = useQuery({
    queryKey: ["vendor-profile", user?.id],
    enabled: !!user,
    queryFn: () => api.get<any>("/vendors/me"),
  });

  const { data: todayOrders } = useQuery({
    queryKey: ["vendor-today-orders", vendor?.id],
    enabled: !!vendor,
    queryFn: () => api.get<any[]>("/orders/vendor"),
  });

  const { data: activeSubscriptions } = useQuery({
    queryKey: ["vendor-active-subscriptions", vendor?.id],
    enabled: !!vendor,
    queryFn: () => api.get<any[]>("/subscriptions/vendor"),
  });

  const { data: recentOrders } = useQuery({
    queryKey: ["vendor-recent-orders-today", vendor?.id],
    enabled: !!vendor,
    queryFn: () => api.get<any[]>("/orders/vendor?limit=5"),
  });

  const todayDate = new Date().toISOString().split('T')[0];
  const todayOrdersOnly = todayOrders?.filter(o => o.deliveryDate === todayDate) ?? [];

  const todayEarnings = todayOrdersOnly
    ?.filter((o) => o.orderStatus !== "cancelled")
    .reduce((sum, o) => sum + Number(o.price), 0) ?? 0;

  // Process data for 7-day revenue trend
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return format(d, "yyyy-MM-dd");
  });

  const revenueTrendData = last7Days.map(date => {
    const dailyTotal = todayOrders
      ?.filter(o => o.deliveryDate === date && o.orderStatus !== "cancelled")
      .reduce((sum, o) => sum + Number(o.price), 0) ?? 0;
    return {
      date: format(new Date(date), "dd MMM"),
      amount: dailyTotal
    };
  });

  // Order status distribution
  const orderStatusMap = todayOrders?.reduce((acc: any, o: any) => {
    const status = o.orderStatus || "pending";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {}) || {};

  const orderStatusData = Object.entries(orderStatusMap).map(([name, value]) => ({ 
    name: name.replace(/_/g, " "), 
    value 
  }));

  // Meal Popularity distribution
  const mealPopularityMap = todayOrders?.reduce((acc: any, o: any) => {
    const name = o.mealName || "Other";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {}) || {};

  const mealPopularityData = Object.entries(mealPopularityMap).map(([name, value]) => ({ name, value }));

  const VENDOR_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#8b5cf6"];

  const statusStyle = (orderStatus: string) => {
    switch (orderStatus) {
      case "delivered": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "pending": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "confirmed": return "bg-primary/10 text-primary border-primary/20";
      case "preparing": return "bg-primary/10 text-primary border-primary/20";
      case "out_for_delivery": return "bg-primary/10 text-primary border-primary/20";
      case "cancelled": return "bg-red-500/10 text-red-600 border-red-500/20";
      default: return "bg-muted/10 text-muted-foreground border-border/20";
    }
  };

  if (!vendor) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-card p-24 text-center border-dashed"
      >
        <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner animate-pulse">
          <ChefHat className="h-10 w-10 text-primary" />
        </div>
        <h3 className="font-bold text-2xl text-foreground tracking-tight">Profile Configuration Incomplete</h3>
        <p className="text-muted-foreground mt-4 font-medium text-base max-w-sm mx-auto leading-relaxed">Please complete your business profile to begin receiving orders.</p>
        <Link to="/vendor/profile" className="block mt-10">
          <Button className="rounded-xl font-bold text-sm px-10 h-14 bg-primary text-white hover:opacity-90 transition-all shadow-lg shadow-primary/20">Establish Profile</Button>
        </Link>
      </motion.div>
    );
  }

  const stats = [
    { label: "Daily Load", value: <NumberTicker value={todayOrdersOnly.length} />, icon: Package, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
    { label: "Cycle Volume", value: <NumberTicker value={todayOrders?.length ?? 0} />, icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { label: "Daily Revenue", value: <NumberTicker value={todayEarnings} prefix="₹" />, icon: Wallet, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Active Nodes", value: <NumberTicker value={activeSubscriptions?.length ?? 0} />, icon: Users, color: "text-violet-500", bg: "bg-violet-500/10", border: "border-violet-500/20" },
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
              <ChefHat className="h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80 leading-none">Vendor Overview</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <span className="text-[10px] font-semibold text-muted-foreground/60">{format(new Date(), "EEEE, dd MMMM")}</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-none">
            Kitchen Online, <span className="text-primary">{vendor.business_name}</span>.
          </h2>
          <p className="text-muted-foreground font-medium text-base flex items-center gap-3">
            {vendor.is_approved ? (
              <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 font-bold text-[9px] px-2.5 py-0.5 uppercase tracking-widest">Verified</Badge>
            ) : (
              <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-bold text-[9px] px-2.5 py-0.5 uppercase tracking-widest">Pending</Badge>
            )}
            Status: Active
          </p>
        </div>

        <div className="flex items-center gap-4 pt-4 lg:pt-0">
          <Link to="/vendor/orders">
            <Button className="gap-2 font-bold text-sm h-12 rounded-xl px-6 bg-foreground text-background hover:opacity-90 transition-all shadow-lg border-none group">
              Manage Orders <Activity className="h-4 w-4" />
            </Button>
          </Link>
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
            className="premium-card p-6 relative overflow-hidden group/stat"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} opacity-20 rounded-full blur-[30px] -mr-12 -mt-12 transition-transform duration-500 group-hover/stat:scale-110`} />
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between mb-8">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center border border-white/5 shadow-inner`}>
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

      {/* Dual Insights Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Revenue Trend Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="premium-card p-6 lg:p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-3">
                <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                Revenue Pulsation
              </h2>
              <p className="text-[10px] text-muted-foreground/50 font-bold uppercase tracking-widest pl-4">7-Day Financial Trajectory</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Live Flow</span>
            </div>
          </div>

          <div className="h-[240px] w-full">
            {revenueTrendData.some(d => d.amount > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueTrendData}>
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
                    cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }}
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
                  <Bar 
                    dataKey="amount" 
                    radius={[4, 4, 0, 0]} 
                    animationDuration={1500}
                  >
                    {revenueTrendData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.amount > 0 ? '#10b981' : 'rgba(255,255,255,0.05)'} 
                        fillOpacity={0.8}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-muted/5 rounded-2xl border border-dashed border-border/20">
                <Activity className="w-10 h-10 text-muted-foreground/10 mb-4" />
                <p className="text-muted-foreground/30 font-bold uppercase tracking-widest text-[9px]">Awaiting transaction sequence</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Status Distribution Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="premium-card p-6 lg:p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-3">
                <div className="w-1 h-5 bg-primary rounded-full" />
                Order Logistics
              </h2>
              <p className="text-[10px] text-muted-foreground/50 font-bold uppercase tracking-widest pl-4">Real-time status breakdown</p>
            </div>
            <div className="px-3 py-1 rounded-full bg-primary/5 border border-primary/20 text-[9px] font-bold uppercase tracking-widest text-primary">Live Efficiency</div>
          </div>

          <div className="h-[240px] w-full flex items-center justify-center">
            {orderStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={VENDOR_COLORS[index % VENDOR_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      background: 'rgba(10, 10, 15, 0.98)', 
                      backdropFilter: 'blur(12px)',
                      padding: '12px 16px',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}
                    itemStyle={{ color: '#ffffff', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}
                    labelStyle={{ display: 'none' }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-muted/5 rounded-2xl border border-dashed border-border/20">
                <Zap className="w-8 h-8 text-muted-foreground/10 mb-3" />
                <p className="text-muted-foreground/30 font-bold uppercase tracking-widest text-[8px]">No status logs</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Menu Popularity Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="premium-card p-6 lg:p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-64 h-64 bg-violet-500/5 rounded-full blur-[80px] -ml-32 -mt-32 pointer-events-none" />
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-3">
                <div className="w-1 h-5 bg-violet-500 rounded-full" />
                Menu Popularity
              </h2>
              <p className="text-[10px] text-muted-foreground/50 font-bold uppercase tracking-widest pl-4">Sales Distribution by Meal</p>
            </div>
            <div className="px-3 py-1 rounded-full bg-violet-500/5 border border-violet-500/20 text-[9px] font-bold uppercase tracking-widest text-violet-500">Meal Volume</div>
          </div>

          <div className="h-[240px] w-full flex items-center justify-center">
            {mealPopularityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={mealPopularityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {mealPopularityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={VENDOR_COLORS[(index + 2) % VENDOR_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      background: 'rgba(10, 10, 15, 0.98)', 
                      backdropFilter: 'blur(12px)',
                      padding: '12px 16px',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}
                    itemStyle={{ color: '#ffffff', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}
                    labelStyle={{ display: 'none' }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-muted/5 rounded-2xl border border-dashed border-border/20">
                <ChefHat className="w-8 h-8 text-muted-foreground/10 mb-3" />
                <p className="text-muted-foreground/30 font-bold uppercase tracking-widest text-[8px]">No meal data</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="flex flex-col gap-10"
      >
        {/* Active Subscriptions Section */}
        <div className="premium-card p-6 lg:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />

          <div className="flex items-center justify-between mb-10 px-2">
            <div className="space-y-1">
              <h2 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight flex items-center gap-3">
                <div className="w-1.5 h-6 bg-primary rounded-full shadow-lg" />
                Active Subscriptions
              </h2>
              <p className="text-[10px] text-muted-foreground/50 font-bold uppercase tracking-widest pl-4">All currently active customer plans</p>
            </div>
            <Link to="/vendor/menu">
              <Button variant="ghost" className="h-9 px-5 rounded-lg bg-muted/20 text-foreground font-bold text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all border-none">
                Expand Menu
              </Button>
            </Link>
          </div>

          {activeSubscriptions && activeSubscriptions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
              {activeSubscriptions.map((sub: any, i: number) => {
                const progress = (sub.delivered_count / sub.total_plan_days) * 100;
                return (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-5 rounded-2xl bg-muted/20 border border-primary/10 shadow-sm hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="flex justify-between gap-6 mb-6">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center border border-border shadow-inner">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-foreground text-base tracking-tight mb-1 truncate">
                            {sub.profiles?.full_name || sub.user_id?.full_name || "Guest Customer"}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge className="bg-primary/5 text-primary border-primary/10 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">{sub.menus?.name || "Standard"}</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="font-bold text-lg text-foreground tracking-tighter">₹{Number(sub.amount).toLocaleString()}</p>
                        <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest opacity-40">
                          {sub.plan_type}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">
                        <span>Progress</span>
                        <span>{sub.delivered_count}/{sub.total_plan_days} Days</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden p-0.5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24 premium-card border-dashed">
              <div className="w-20 h-20 bg-muted/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Zap className="h-10 w-10 text-muted-foreground/30" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 tracking-tight">No Active Subscriptions</h3>
              <p className="text-muted-foreground text-base max-w-sm mx-auto mb-10 font-medium leading-relaxed">You don't have any active subscriptions at the moment. Update your menu to attract more customers.</p>
              <Link to="/vendor/menu">
                <Button className="rounded-xl font-bold text-sm px-10 h-14 bg-primary text-white hover:opacity-90 transition-all shadow-lg shadow-primary/20">Refine Menu</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Recent Activity Section */}
        <div className="premium-card p-6 lg:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] -ml-48 -mt-48 pointer-events-none" />

          <div className="flex items-center justify-between mb-10 px-2">
            <div className="space-y-1">
              <h2 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight flex items-center gap-3">
                <div className="w-1.5 h-6 bg-accent rounded-full shadow-lg" />
                Recent Orders
              </h2>
              <p className="text-[10px] text-muted-foreground/50 font-bold uppercase tracking-widest pl-4">Latest orders from customers</p>
            </div>
            <Link to="/vendor/orders" className="group/all">
              <ArrowUpRight className="h-6 w-6 text-muted-foreground group-hover/all:text-primary transition-all group-hover/all:translate-x-1 group-hover/all:-translate-y-1" />
            </Link>
          </div>

          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {recentOrders && recentOrders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-2">
                  {recentOrders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.5, ease: "circOut" }}
                      className="group/order relative p-5 rounded-2xl bg-muted/20 border border-border/40 hover:bg-card hover:border-primary/20 transition-all duration-500"
                    >
                      <div className="flex flex-col gap-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center border border-border shadow-inner group-hover/order:rotate-3 transition-transform duration-500">
                              <Package className="h-5 w-5 text-accent" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-foreground text-base tracking-tight leading-none mb-1.5 truncate capitalize group-hover/order:text-primary transition-colors">{order.mealName}</h4>
                              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">
                                {order.deliveryDate ? format(new Date(order.deliveryDate), "dd MMM") : "TBD"}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className={`text-[8px] px-2 py-0.5 rounded-full capitalize font-bold border shadow-sm ${statusStyle(order.orderStatus)}`}>
                            {order.orderStatus?.replace(/_/g, " ")}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-border/10">
                          <div className="space-y-0.5">
                            <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest opacity-40">Price</p>
                            <p className="font-bold text-lg text-foreground tracking-tighter">₹{Number(order.price).toLocaleString()}</p>
                          </div>
                          <Link to="/vendor/orders">
                            <Button size="icon" variant="ghost" className="h-9 w-9 rounded-lg bg-background/50 border border-border/40 hover:bg-primary hover:text-white transition-all">
                              <ArrowUpRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-muted/5 rounded-3xl border-2 border-dashed border-border/40">
                  <History className="h-8 w-8 text-muted-foreground/20 mx-auto mb-4 opacity-40" />
                  <p className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest opacity-60">No activity</p>
                </div>
              )}
            </AnimatePresence>
            
            {recentOrders && recentOrders.length > 0 && (
              <Link to="/vendor/orders" className="block mt-4">
                <Button variant="outline" className="w-full h-12 rounded-xl border-border/60 bg-background/50 backdrop-blur-md font-bold text-[10px] uppercase tracking-widest hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all flex items-center justify-center gap-3">
                  <History className="h-4 w-4" /> Comprehensive Order Logs
                </Button>
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
