import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import { Package, Filter, Clock, MapPin, CheckCircle2, XCircle, Users, Activity, Terminal, ArrowDownRight, ArrowUpRight, Search, Info, ChefHat, Wallet, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const statusOptions = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"];

export default function IncomingOrdersPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");

  const { data: vendor } = useQuery({
    queryKey: ["vendor-profile", user?.id],
    enabled: !!user,
    queryFn: () => api.get<any>("/vendors/me"),
  });

  const { data: orders, isLoading } = useQuery({
    queryKey: ["vendor-orders-today", vendor?.id, filter],
    enabled: !!vendor,
    queryFn: () => api.get<any[]>(`/orders/vendor?status=${filter}`),
  });

  const { data: subscriptions, isLoading: subsLoading } = useQuery({
    queryKey: ["vendor-subscriptions", vendor?.id],
    enabled: !!vendor,
    queryFn: () => api.get<any[]>("/subscriptions/vendor"),
  });

  const deliverTiffin = useMutation({
    mutationFn: (subId: string) => api.put(`/subscriptions/${subId}/deliver`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-orders-today"] });
      toast.success("Delivery protocol finalized!");
    },
    onError: (err: any) => {
      const msg = err.message || "Failed to initiate delivery. System disruption detected.";
      toast.error(msg);
    }
  });

  const isAlreadySentToday = (subId: string) => {
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');

    return orders.some(o =>
      o.subscriptionId === subId &&
      o.deliveryDate === todayStr &&
      o.orderStatus === 'delivered'
    );
  };

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.put(`/orders/${id}/status`, { status }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["vendor-orders-today", vendor?.id, filter] });
      const previousOrders = queryClient.getQueryData(["vendor-orders-today", vendor?.id, filter]);
      queryClient.setQueryData(["vendor-orders-today", vendor?.id, filter], (old: any[] | undefined) => {
        if (!old) return [];
        if (filter !== "all" && status !== filter) {
          return old.filter(order => order.id !== id);
        }
        return old.map(order =>
          order.id === id ? { ...order, orderStatus: status } : order
        );
      });
      return { previousOrders };
    },
    onError: (err, variables, context: any) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(["vendor-orders-today", vendor?.id, filter], context.previousOrders);
      }
      toast.error("Status synchronization failed");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-orders-today"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-orders"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-today-orders"] });
    },
    onSuccess: () => {
      toast.success("Operational status updated");
    },
  });

  const nextStatus = (current: string) => {
    const flow = ["pending", "preparing", "out_for_delivery", "delivered"];
    const idx = flow.indexOf(current);
    return idx >= 0 && idx < flow.length - 1 ? flow[idx + 1] : null;
  };

  const statusStyle = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "pending": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "confirmed": return "bg-primary/10 text-primary border-primary/20";
      case "preparing": return "bg-primary/10 text-primary border-primary/20";
      case "out_for_delivery": return "bg-primary/10 text-primary border-primary/20";
      case "cancelled": return "bg-red-500/10 text-red-600 border-red-500/20";
      default: return "bg-muted/10 text-muted-foreground border-border/20";
    }
  };

  if (isLoading || subsLoading) {
    return (
      <div className="space-y-12 animate-pulse">
        <div className="h-32 bg-card rounded-[2.5rem]" />
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-card rounded-[2rem]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-24"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-2">
              <Package className="h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80 leading-none">Order Management</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <span className="text-[10px] font-semibold text-muted-foreground/60">Live Stream</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-none">
            Incoming <span className="text-primary">Orders</span>.
          </h2>
          <p className="text-muted-foreground font-medium text-base max-w-2xl">Manage your daily delivery tasks and active customer subscriptions.</p>
        </div>

        <div className="flex items-center gap-4 bg-card/50 backdrop-blur-md p-2 rounded-xl border border-border/40 shadow-sm self-center lg:self-end">
          <div className="flex items-center gap-3 px-4 border-r border-border/40 hidden sm:flex">
            <Filter className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">Filter</span>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-[180px] bg-background/50 border-0 focus:ring-1 focus:ring-primary/20 shadow-none h-11 rounded-lg font-bold text-[11px] uppercase tracking-widest text-foreground">
              <SelectValue placeholder="All Orders" />
          </SelectTrigger>
          <SelectContent className="rounded-xl shadow-2xl border-border/40 p-1.5">
            <SelectItem value="all" className="rounded-lg py-2 font-bold text-[10px] uppercase tracking-widest focus:bg-primary/10">All Status</SelectItem>
            {statusOptions.map((s) => (
              <SelectItem key={s} value={s} className="rounded-lg py-2 font-bold text-[10px] uppercase tracking-widest focus:bg-primary/10 capitalize">{s.replace(/_/g, " ")}</SelectItem>
            ))}
          </SelectContent>
          </Select>
        </div>
      </div>

      {/* Recurring Subscriptions Section */}
      <AnimatePresence mode="popLayout">
        {subscriptions && subscriptions.length > 0 && (
          <motion.div
            layout
            className="space-y-8"
          >
            <div className="flex items-center gap-4 px-4">
              <span className="badge-premium">Active Subscriptions</span>
              <div className="h-px w-full bg-border/20" />
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {subscriptions.map((sub, i) => {
                const progress = (sub.delivered_count / sub.total_plan_days) * 100;
                return (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={sub.id}
                    className="premium-card p-6 lg:p-8 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[60px] -mr-32 -mt-32 pointer-events-none" />

                    <div className="flex items-start justify-between gap-6 mb-8 relative z-10">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-xl bg-muted/20 border border-border/40 flex items-center justify-center shrink-0 shadow-inner">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-lg font-bold text-foreground tracking-tight leading-none">{sub.profiles?.full_name || sub.user_id?.full_name || "Customer Node"}</h4>
                          <div className="flex items-center gap-2.5">
                            <Badge className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border-none text-primary bg-primary/10">
                              {sub.plan_type}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground font-medium opacity-60">
                              {sub.meal_type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1 leading-none text-primary">Days Left</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-bold text-foreground leading-none tracking-tight">{sub.remaining_days}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8 relative z-10">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                          <span>Delivery Progress</span>
                          <span className="text-primary font-bold">{sub.delivered_count} / {sub.total_plan_days} Days</span>
                        </div>

                        <div className="relative w-full h-4 bg-zinc-800/80 rounded-full overflow-hidden border border-white/5 p-1">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_15px_rgba(74,222,128,0.4)]"
                            transition={{ duration: 1, ease: "circOut" }}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 pt-4">
                        <div className="bg-muted/20 border border-border/40 px-6 py-3 rounded-xl flex items-center gap-4">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs font-medium text-muted-foreground">
                            {format(new Date(sub.start_date), "dd MMM yy")} — {format(new Date(sub.end_date), "dd MMM yy")}
                          </span>
                        </div>

                        <Button
                          size="lg"
                          disabled={deliverTiffin.isPending || sub.delivered_count >= sub.total_plan_days || sub.status === 'paused' || isAlreadySentToday(sub.id)}
                          onClick={() => deliverTiffin.mutate(sub.id)}
                          className={`h-12 px-8 rounded-xl font-bold text-xs gap-2 transition-all border-none ${sub.status === 'paused' || isAlreadySentToday(sub.id)
                            ? "bg-amber-500/10 text-amber-500 opacity-60 cursor-not-allowed"
                            : "bg-primary text-white hover:opacity-90 shadow-lg shadow-primary/20"
                            }`}
                        >
                          {sub.status === 'paused' ? <ArrowDownRight className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
                          {sub.status === 'paused' ? "Paused" : (isAlreadySentToday(sub.id) ? "Marked Delivered" : "Mark as Delivered Today")}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Single Orders Section */}
      <div className="space-y-8 pt-8">
        <div className="flex items-center gap-4 px-4">
          <span className="badge-premium">Daily Orders</span>
          <div className="h-px w-full bg-border/20" />
        </div>

        <AnimatePresence mode="popLayout">
          {orders && orders.length > 0 ? (
            <motion.div
              layout
              className="grid gap-6"
            >
              {orders.map((order, index) => {
                const next = nextStatus(order.orderStatus);
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={order.id}
                    className="premium-card p-8 relative overflow-hidden"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                      <div className="flex flex-col md:flex-row md:items-center gap-8 flex-1">
                        <div className="w-20 h-20 rounded-[1.75rem] bg-muted/20 border-2 border-border/40 flex items-center justify-center shadow-inner shrink-0 group-hover:rotate-3 transition-transform duration-500">
                          <Package className="h-8 w-8 text-primary shadow-primary/20" />
                        </div>

                        <div className="space-y-4 flex-1">
                          <div className="flex flex-wrap items-center gap-4">
                            <h3 className="text-xl font-bold text-foreground capitalize tracking-tight">{order.mealName}</h3>
                            <Badge variant="outline" className={`capitalize text-xs font-semibold px-4 py-1.5 rounded-full border shadow-sm leading-none ${statusStyle(order.orderStatus)}`}>
                              {order.orderStatus?.replace(/_/g, " ")}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap items-center gap-y-3 gap-x-8">
                            <div className="flex items-center gap-2.5 text-xs text-muted-foreground font-semibold leading-none">
                              <Clock className="h-4 w-4 text-primary" />
                              <span className="text-foreground">{order.deliveryTime || "TBD"}</span>
                              <span className="opacity-40">·</span>
                              <span className={order.deliveryDate === new Date().toISOString().split('T')[0] ? "text-primary italic" : ""}>
                                {order.deliveryDate === new Date().toISOString().split('T')[0] ? "Today" : format(new Date(order.deliveryDate), "dd MMM")}
                              </span>
                            </div>
                            <div className="flex items-center gap-2.5 text-xs text-muted-foreground font-semibold leading-none">
                              <MapPin className="h-4 w-4 text-primary" />
                              <span className="text-foreground truncate max-w-[200px]">{order.deliveryAddress || "Address needed"}</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-xs text-primary font-bold bg-primary/5 px-4 py-2 rounded-xl border border-primary/20 leading-none">
                              <Wallet className="h-4 w-4" /> ₹{Number(order.price).toLocaleString()}
                            </div>
                          </div>

                          {order.notes && (
                            <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-4 mt-2 max-w-2xl">
                              <div className="flex items-center gap-3 mb-2">
                                <Info className="h-3 w-3 text-amber-500" />
                                <span className="text-xs font-semibold text-amber-500 opacity-60">Order Notes</span>
                              </div>
                              <p className="text-sm text-amber-600 font-medium italic leading-relaxed">
                                "{order.notes}"
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end justify-center gap-4 shrink-0 lg:border-l border-border/40 lg:pl-10 h-full">
                        {next && (
                          <Button
                            onClick={() => updateStatus.mutate({ id: order.id, status: next })}
                            disabled={updateStatus.isPending}
                            className="rounded-xl h-12 min-w-[200px] font-bold text-xs gap-2 shadow-lg transition-all bg-foreground text-background hover:opacity-90 border-none px-6"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Next: {next.replace(/_/g, " ")}
                          </Button>
                        )}

                        {order.orderStatus !== "cancelled" && order.orderStatus !== "delivered" && (
                          <Button
                            variant="ghost"
                            onClick={() => updateStatus.mutate({ id: order.id, status: "cancelled" })}
                            className="rounded-xl h-12 px-6 font-bold text-xs gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive border border-destructive/20 transition-all"
                          >
                            <XCircle className="h-4 w-4" />
                            Cancel Order
                          </Button>
                        )}

                        {order.orderStatus === "delivered" && (
                          <div className="flex items-center gap-3 bg-green-500/10 text-green-600 px-6 py-3 rounded-xl border border-green-500/20">
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="text-xs font-bold">Delivered</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="premium-card p-24 text-center border-dashed"
            >
              <div className="w-20 h-20 bg-muted/10 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                <History className="h-10 w-10 text-muted-foreground/20" />
              </div>
              <h3 className="text-2xl font-bold text-foreground tracking-tight mb-4">No Orders Found</h3>
              <p className="text-muted-foreground mt-2 font-medium text-base max-w-lg mx-auto leading-relaxed">
                {filter !== "all" ? `No tasks found for status "${filter?.replace(/_/g, " ")}".` : "Orders will appear here as customers place them."}
              </p>
              {filter !== "all" && (
                <Button variant="outline" className="mt-8 h-12 px-10 rounded-xl border-border/60 hover:bg-primary/5 font-bold text-xs transition-all" onClick={() => setFilter("all")}>Clear Filter</Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
