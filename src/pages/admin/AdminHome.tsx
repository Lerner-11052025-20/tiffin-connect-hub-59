import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import NumberTicker from "@/components/ui/number-ticker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Users,
  ChefHat,
  Package,
  Wallet,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminHome() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => api.get<any>("/admin/stats"),
  });

  const { data: recentOrders } = useQuery({
    queryKey: ["admin-recent-orders-today"],
    queryFn: () => api.get<any[]>("/admin/recent-orders"),
  });

  const statusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "pending": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "confirmed": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "preparing": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "out_for_delivery": return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "cancelled": return "bg-red-500/10 text-red-600 border-red-500/20";
      default: return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  const statCards = [
    { label: "Platform Users", value: stats?.users ?? 0, subValue: "Registered accounts", icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Partner Vendors", value: stats?.vendors?.total ?? 0, subValue: `${stats?.vendors?.active ?? 0} active kitchens`, icon: ChefHat, color: "text-accent", bg: "bg-accent/10" },
    { label: "Today's Orders", value: stats?.orders?.today ?? 0, subValue: "Live platform activity", icon: Package, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Platform Revenue", value: stats?.orders?.revenue ?? 0, subValue: "Total gross volume", icon: Wallet, color: "text-purple-500", bg: "bg-purple-500/10", prefix: "₹" },
  ];

  return (
    <div className="space-y-8">
      {/* Header Area */}
      <div className="flex flex-col gap-2">
        <div className="badge-premium w-fit mb-2">
          <span>The Command Suite</span>
        </div>
        <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-none">
          Platform <span className="text-primary">Intelligence</span>.
        </h2>
        <p className="text-muted-foreground font-medium text-base max-w-2xl">
          Real-time oversight and strategic management of the TiffinConnect ecosystem.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="premium-card p-6 relative overflow-hidden group/stat"
          >
             <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-[30px] -mr-12 -mt-12 group-hover/stat:scale-110 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center border border-primary/10 shadow-inner`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <Badge variant="outline" className="text-[9px] font-bold bg-background/50 border-border/40 opacity-40 uppercase tracking-widest px-2 py-0.5"> STAT </Badge>
                </div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1 opacity-60">{stat.label}</p>
                <div className="flex items-baseline gap-1">
                  <div className="text-2xl font-bold text-foreground tracking-tight leading-none">
                    <NumberTicker value={stat.value} prefix={stat.prefix} />
                  </div>
                </div>
                <div className="text-[9px] text-muted-foreground/40 font-bold uppercase tracking-widest mt-4 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary/40 inline-block" />
                  {stat.subValue}
                </div>
              </div>
          </motion.div>
        ))}
      </div>

      {/* Critial Alert Section */}
      {stats && stats.vendors?.pending > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group p-1"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/10 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="relative bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-xl shadow-amber-500/10">
                <AlertTriangle className="h-8 w-8 text-amber-600 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xl font-bold tracking-tight text-foreground mb-0.5">Pending Verifications</h4>
                <p className="text-muted-foreground font-medium text-sm">{stats.vendors.pending} kitchens are awaiting master auditor approval.</p>
              </div>
            </div>
            <Link to="/admin/vendors" className="group/btn">
              <div className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase tracking-widest text-[10px] rounded-xl flex items-center gap-4 shadow-xl shadow-amber-600/20 transition-all active:scale-95">
                Review Applications
                <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Workspace Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Live Stream Page */}
        <div className="lg:col-span-2 premium-card p-6 lg:p-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/40">
            <div className="flex flex-col gap-0.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Live Activity</p>
              <h3 className="text-xl lg:text-2xl font-bold tracking-tight text-foreground">Operational Stream</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">System Real-time</span>
            </div>
          </div>

          {recentOrders && recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                   className="p-4 rounded-xl border border-primary/10 bg-muted/5 group/row hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-background border border-border/40 flex items-center justify-center shadow-inner group-hover/row:rotate-3 transition-transform duration-500">
                        <span className="text-xl">🍱</span>
                      </div>
                      <div>
                        <p className="font-bold text-base text-foreground leading-tight mb-1">
                          {(order.vendors as any)?.business_name ?? "Independent Artisan"}
                        </p>
                        <div className="flex items-center gap-2.5 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">
                          <span className="text-primary/70">{order.mealName}</span>
                          <span className="opacity-20">•</span>
                          <span>{order.deliveryDate ? format(new Date(order.deliveryDate), "dd MMM, yyyy") : "—"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1.5">
                      <p className="text-lg font-bold text-foreground tracking-tighter">₹{Number(order.price).toLocaleString()}</p>
                      <div className={`px-3 py-0.5 rounded-full border text-[8px] font-bold uppercase tracking-widest ${statusColor(order.orderStatus)}`}>
                        {order.orderStatus?.replace("_", " ")}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-muted/10 rounded-2xl border border-dashed border-border/20">
              <Package className="w-10 h-10 text-muted-foreground/20 mb-4" />
              <p className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest opacity-40">Operational Stream Empty</p>
            </div>
          )}
        </div>

        {/* Intelligence Sidebar */}
        <div className="flex flex-col gap-8">
          <div className="premium-card p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center text-accent border border-accent/20">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold tracking-tight text-foreground">System Health</h3>
            </div>

            <div className="space-y-6">
              {[
                { label: "Infrastructure", value: "Operational", color: "text-green-500", progress: 100 },
                { label: "API Latency", value: "11ms", color: "text-foreground/80", progress: 98 },
                { label: "Data Integrity", value: "Verified", color: "text-green-500", progress: 100 },
                { label: "Traffic Vol.", value: "Optimal", color: "text-foreground/80", progress: 65 },
              ].map((item) => (
                <div key={item.label} className="group-health">
                  <div className="flex items-center justify-between mb-2.5">
                    <p className="text-[10px] text-muted-foreground/50 font-bold uppercase tracking-widest">{item.label}</p>
                    <p className={`text-[11px] font-bold ${item.color}`}>{item.value}</p>
                  </div>
                  <div className="h-1.5 w-full bg-muted/40 rounded-full overflow-hidden p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full rounded-full ${item.color === 'text-green-500' ? 'bg-green-500' : 'bg-primary'}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="premium-card p-6 lg:p-8 overflow-hidden bg-primary/5 border-primary/20 relative group/advice">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-16 translate-x-16 group-hover/advice:scale-110 transition-transform duration-700" />
            <div className="relative z-10 flex flex-col gap-4">
              <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-base font-bold tracking-tight">Master Advisory</h4>
              <p className="text-[11px] text-muted-foreground/60 font-medium leading-relaxed uppercase tracking-wider">
                Conduct platform audits and kitchen performance reviews to maintain network trust scores.
              </p>
              <button className="text-[10px] font-bold uppercase tracking-widest text-primary mt-2 flex items-center gap-2 group/audit">
                Audit Guidelines
                <ArrowRight className="w-3 h-3 group-hover/audit:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
