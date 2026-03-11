import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Pause, Play, XCircle, Star, ShieldCheck, Wallet, Clock, Utensils, Zap, Info, ChevronRight, Hash } from "lucide-react";
import { MealCalendar } from "@/components/MealCalendar";
import { motion, AnimatePresence } from "framer-motion";

export default function SubscriptionPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ["subscriptions", user?.id],
    enabled: !!user,
    queryFn: () => api.get<any[]>("/subscriptions"),
  });

  const togglePause = useMutation({
    mutationFn: (id: string) => api.post(`/subscriptions/${id}/pause`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["active-subscription"] });
      toast.success("Subscription status updated successfully!");
    },
    onError: () => toast.error("Failed to update subscription status"),
  });

  const cancelSub = useMutation({
    mutationFn: (id: string) => api.put(`/subscriptions/${id}`, { status: 'cancelled' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast.success("Subscription cancelled successfully");
    },
    onError: () => toast.error("Cancellation failed"),
  });

  const statusStyle = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "paused": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "cancelled": return "bg-red-500/10 text-red-600 border-red-500/20";
      default: return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-12 animate-pulse">
        <div className="h-32 w-full bg-card rounded-[2.5rem]" />
        <div className="space-y-10">
          {[1, 2].map((i) => (
            <div key={i} className="h-[600px] w-full bg-card rounded-[3.5rem]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 pb-24"
    >
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary mb-2 shadow-sm">
            <ShieldCheck className="h-3 w-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Secure Payments</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-none">
            Active <span className="italic text-primary">Subscriptions</span>
          </h2>
          <p className="text-muted-foreground font-medium text-base lg:text-lg max-w-2xl">Manage your active meal plans and schedules.</p>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/dashboard/meals">
            <Button className="h-14 px-10 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold uppercase tracking-widest text-[11px] hover:scale-105 active:scale-95 transition-all shadow-xl group">
              <Zap className="h-4 w-4 mr-2 group-hover:animate-pulse" /> Add New Subscription
            </Button>
          </Link>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {subscriptions && subscriptions.length > 0 ? (
          <motion.div
            layout
            className="grid gap-12"
          >
            {subscriptions.map((sub, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "circOut" }}
                key={sub.id}
                className="group premium-card p-8 lg:p-10 group transition-all duration-700 overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none group-hover:scale-110 transition-transform duration-1000" />

                <div className="flex flex-col gap-14 relative z-10">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-10">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                      <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 ring-4 ring-primary/5">
                        <span className="text-4xl drop-shadow-2xl">🍱</span>
                      </div>
                      <div className="text-center md:text-left space-y-3">
                        <div>
                          <h3 className="font-bold text-2xl lg:text-3xl text-foreground tracking-tight group-hover:text-primary transition-colors leading-none mb-2.5">
                            {(sub.vendors as any)?.business_name}
                          </h3>
                          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <Badge className={`capitalize text-[10px] font-bold tracking-widest px-5 py-1.5 rounded-full border shadow-sm ${statusStyle(sub.status)}`}>
                              {sub.status}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest bg-muted/30 px-4 py-1.5 rounded-xl border border-border/40 flex items-center gap-2">
                              <Hash className="h-3 w-3" /> {sub.id.substring(0, 12)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {sub.status !== "cancelled" && (
                      <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2 pt-4 lg:pt-0">
                        {sub.status === "active" && (
                          <Button
                            variant="outline"
                            onClick={() => togglePause.mutate(sub.id)}
                            disabled={togglePause.isPending}
                            className="rounded-xl px-6 h-12 text-[10px] font-bold uppercase tracking-widest border-amber-500/30 text-amber-600 hover:bg-amber-500 hover:text-white transition-all gap-2 bg-background/50 backdrop-blur-md"
                          >
                            <Pause className="h-3.5 w-3.5" /> Pause
                          </Button>
                        )}
                        {sub.status === "paused" && (
                          <Button
                            onClick={() => togglePause.mutate(sub.id)}
                            disabled={togglePause.isPending}
                            className="rounded-xl px-6 h-12 text-[10px] font-bold uppercase tracking-widest bg-emerald-500 text-white hover:bg-emerald-600 transition-all gap-2 shadow-xl shadow-emerald-500/20"
                          >
                            <Play className="h-3.5 w-3.5" /> Resume
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          onClick={() => cancelSub.mutate(sub.id)}
                          disabled={cancelSub.isPending}
                          className="rounded-xl px-6 h-12 text-[10px] font-bold uppercase tracking-widest border-destructive/20 text-destructive hover:bg-red-500 hover:text-white transition-all gap-2 bg-background/50 backdrop-blur-md"
                        >
                          <XCircle className="h-3.5 w-3.5" /> Cancel
                        </Button>
                      </div>
                    )}
                  </div>

                   <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {[
                      { label: "Plan", value: sub.plan_type, capitalize: true, icon: ShieldCheck, color: "text-blue-500", bg: "bg-blue-500/10" },
                      { label: "Meal Type", value: sub.meal_type, capitalize: true, icon: Utensils, color: "text-orange-500", bg: "bg-orange-500/10" },
                      { label: "Total", value: `₹${Number(sub.amount).toLocaleString()}`, icon: Wallet, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                      { label: "Start Date", value: format(new Date(sub.start_date), "dd MMM yy"), icon: CalendarDays, color: "text-primary", bg: "bg-primary/10" },
                      { label: "Expiry", value: sub.end_date ? format(new Date(sub.end_date), "dd MMM yy") : "Continuous", icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
                      { label: "Lunch", value: sub.lunch_time || "N/A", icon: Clock, color: "text-indigo-500", bg: "bg-indigo-500/10" },
                      { label: "Dinner", value: sub.dinner_time || "N/A", icon: Clock, color: "text-indigo-500", bg: "bg-indigo-500/10" },
                    ].map((item, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-muted/20 border border-border/40 group/item hover:bg-card hover:border-primary/20 hover:shadow-xl transition-all duration-500 flex flex-col justify-between h-[120px] shadow-inner">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center border border-white/5 shadow-inner`}>
                            <item.icon className={`h-3.5 w-3.5 ${item.color}`} />
                          </div>
                        </div>
                        <div>
                          <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mb-1 opacity-60">{item.label}</p>
                          <p className={`font-bold text-foreground text-[13px] tracking-tight ${item.capitalize ? 'capitalize' : ''} group-hover/item:translate-x-1 transition-transform`}>
                            {item.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {sub.status !== "cancelled" && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.8 }}
                      className="mt-6 p-1 bg-background/30 rounded-2xl border border-border/40 shadow-inner"
                    >
                      <div className="p-6 lg:p-8">
                        <div className="flex items-center justify-between mb-8">
                          <h4 className="font-bold text-xl text-foreground flex items-center gap-4">
                            <div className="w-1.5 h-6 bg-primary rounded-full shadow-lg" />
                            Meal Schedule
                          </h4>
                          <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">
                            <Info className="h-4 w-4 text-primary" /> 12h lock
                          </div>
                        </div>
                        <MealCalendar subscriptionId={sub.id} />
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-[2.5rem] p-16 text-center border border-dashed border-border/60 shadow-inner group hover:border-primary/20 transition-all duration-700"
          >
            <div className="w-24 h-24 bg-muted/10 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
              <CalendarDays className="h-10 w-10 text-muted-foreground/20" />
            </div>
            <h3 className="text-2xl font-bold text-foreground tracking-tight">No Active Subscriptions</h3>
            <p className="text-muted-foreground mt-3 font-medium text-base max-w-md mx-auto">
              You haven't subscribed to any meal plans yet. Find a kitchen to start your subscription.
            </p>
            <div className="pt-8">
              <Link to="/dashboard/meals">
                <Button size="lg" className="h-12 px-10 rounded-xl bg-primary text-white font-bold uppercase tracking-widest text-[11px] shadow-2xl shadow-primary/20 hover:scale-105 transition-all">
                  Browse Kitchens <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
