import api from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Package, Filter, Clock, MapPin, Store, UserCog } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";

const statusOptions = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"];

export default function OrdersPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders", filter],
    queryFn: () => api.get<any[]>(`/admin/orders?status=${filter}`),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.put(`/admin/orders/${id}/status`, { status }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["admin-orders", filter] });
      const previousOrders = queryClient.getQueryData(["admin-orders", filter]);

      queryClient.setQueryData(["admin-orders", filter], (old: any[] | undefined) => {
        if (!old) return [];
        return old.map(order =>
          order.id === id ? { ...order, orderStatus: status } : order
        );
      });
      return { previousOrders };
    },
    onError: (err, variables, context: any) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(["admin-orders", filter], context.previousOrders);
      }
      toast.error("Failed to update status");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onSuccess: () => {
      toast.success("Order status overridden by admin");
    },
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Streaming Transactions</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="badge-premium w-fit mb-1.5">
            <span>Marketplace Oversight</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-none">
            Platform <span className="text-primary">Transactions</span>.
          </h2>
          <p className="text-muted-foreground font-medium text-base max-w-2xl">
            Surgical oversight and orchestration of the global dining stream.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-card/40 backdrop-blur-md p-1.5 rounded-xl border border-border/40 shadow-lg">
          <div className="flex items-center gap-2 px-3 border-r border-border/40">
            <Filter className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Flow</span>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[160px] border-0 focus:ring-0 shadow-none h-9 font-bold text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl luxury-blur border-border/40">
              <SelectItem value="all" className="text-[10px] font-bold uppercase tracking-widest py-2.5">Full History</SelectItem>
              {statusOptions.map((s) => (
                <SelectItem key={s} value={s} className="text-[10px] font-bold uppercase tracking-widest py-2.5">
                  {s.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders Grid */}
      {orders && orders.length > 0 ? (
        <div className="grid gap-4">
          {orders.map((order, idx) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="premium-card p-5 group/order overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-6 flex-1">
                  <div className="w-16 h-16 rounded-2xl bg-background border border-primary/10 shadow-inner flex items-center justify-center text-3xl group-hover/order:rotate-3 transition-transform duration-500 shrink-0">
                    <span className="text-2xl">🍱</span>
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold tracking-tight text-foreground truncate max-w-[240px]">
                        {(order.vendors as any)?.business_name ?? "Independent Artisan"}
                      </h3>
                      <div className={`px-2.5 py-0.5 rounded-full border text-[8px] font-bold uppercase tracking-widest leading-none ${statusColor(order.orderStatus)}`}>
                        {order.orderStatus?.replace(/_/g, " ")}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-[9px] text-muted-foreground/50 font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><Store className="h-3 w-3" /> {order.id.slice(-6).toUpperCase()}</span>
                      <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {order.deliveryDate ? format(new Date(order.deliveryDate), "dd MMM") : "—"}</span>
                      <span className="flex items-center gap-1.5 text-primary/60"><Package className="h-3 w-3" /> {order.mealName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[9px] text-muted-foreground/40 font-bold uppercase tracking-widest mb-0.5">Revenue yield</p>
                    <p className="text-xl font-bold text-foreground tracking-tighter">₹{Number(order.price).toLocaleString()}</p>
                  </div>

                  <div className="h-10 w-px bg-border/40" />

                  <div className="flex items-center gap-3 bg-muted/10 border border-border/40 p-2 rounded-xl transition-all hover:bg-muted/20">
                    <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center shadow-inner">
                      <UserCog className="h-4 w-4 text-muted-foreground/60" />
                    </div>
                    <div className="flex items-center min-w-[120px]">
                      <Select
                        value={order.orderStatus}
                        onValueChange={(v) => updateStatus.mutate({ id: order.id, status: v })}
                      >
                        <SelectTrigger className="h-8 rounded-lg font-bold border-0 focus:ring-0 shadow-none text-[10px] uppercase tracking-widest px-2 bg-transparent hover:text-primary transition-colors">
                          <SelectValue placeholder="Override..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl luxury-blur border-border/40 min-w-[140px]">
                          {statusOptions.map((s) => (
                            <SelectItem key={s} value={s} className="text-[10px] font-bold uppercase tracking-widest py-2.5">
                              {s.replace(/_/g, " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="premium-card py-24 text-center flex flex-col items-center border-dashed">
          <div className="w-20 h-20 rounded-full bg-muted/20 flex items-center justify-center text-5xl mb-6 grayscale opacity-30">📦</div>
          <h3 className="text-2xl font-bold tracking-tight text-foreground">Operational Silence</h3>
          <p className="text-muted-foreground mt-3 font-medium text-sm max-w-sm">The platform transaction history will be displayed here in real-time as kitchens fulfill demand.</p>
        </div>
      )}
    </div>
  );
}
