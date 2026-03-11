import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Clock, Filter, Search, RotateCcw, Star, Calendar, ChevronRight, PackageCheck, Info } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ReviewDialog from "@/components/order/ReviewDialog";
import OrderDialog from "@/components/order/OrderDialog";
import { motion, AnimatePresence } from "framer-motion";

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [reviewOrder, setReviewOrder] = useState<any>(null);

  const [reorderMenu, setReorderMenu] = useState<any>(null);
  const [isReorderOpen, setIsReorderOpen] = useState(false);

  const handleReorder = async (mealId: string) => {
    try {
      const data = await api.get<any>(`/menus/${mealId}`);
      if (!data || !data.is_available) {
        toast.error(
          "This meal is currently unavailable. Please browse the vendor's updated menu for similar items."
        );
        return;
      }
      setReorderMenu(data);
      setIsReorderOpen(true);
    } catch (err) {
      toast.error("Failed to load meal details. It may have been removed.");
    }
  };

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders", user?.id, statusFilter],
    enabled: !!user,
    queryFn: () => api.get<any[]>(`/orders?status=${statusFilter}`),
  });

  const statusStyle = (status: string) => {
    switch (status) {
      case "delivered": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "pending": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "confirmed": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "preparing": return "bg-indigo-500/10 text-indigo-600 border-indigo-500/20";
      case "out_for_delivery": return "bg-violet-500/10 text-violet-600 border-violet-500/20";
      case "cancelled": return "bg-red-500/10 text-red-600 border-red-500/20";
      default: return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-20 w-full animate-pulse bg-card rounded-3xl" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 w-full animate-pulse bg-card rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-2">
            <Clock className="h-3 w-3" />
            <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Order History</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground tracking-tight leading-none">
            Your <span className="italic text-primary">Activity Log</span>
          </h2>
          <p className="text-muted-foreground font-medium text-sm lg:text-base">View all your previous orders and dining experiences.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 bg-card/50 backdrop-blur-md p-2 rounded-xl lg:rounded-2xl border border-border/50 shadow-sm self-center lg:self-end">
          <div className="flex items-center gap-3 px-4 border-r border-border/50 hidden sm:flex">
            <Filter className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-foreground">Status</span>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[170px] bg-background/50 border-0 focus:ring-1 focus:ring-primary/20 shadow-none h-11 rounded-lg font-bold text-sm capitalize">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-2xl border-border/40">
              <SelectItem value="all" className="rounded-lg font-medium focus:bg-primary/10 focus:text-primary">All Activity</SelectItem>
              <SelectItem value="pending" className="rounded-lg font-medium focus:bg-primary/10 focus:text-primary">Pending Payment</SelectItem>
              <SelectItem value="confirmed" className="rounded-lg font-medium focus:bg-primary/10 focus:text-primary">Confirmed Orders</SelectItem>
              <SelectItem value="preparing" className="rounded-lg font-medium focus:bg-primary/10 focus:text-primary">In Preparation</SelectItem>
              <SelectItem value="out_for_delivery" className="rounded-lg font-medium focus:bg-primary/10 focus:text-primary">En Route</SelectItem>
              <SelectItem value="delivered" className="rounded-lg font-medium focus:bg-primary/10 focus:text-primary">Delivered</SelectItem>
              <SelectItem value="cancelled" className="rounded-lg font-medium focus:bg-primary/10 focus:text-primary">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {orders && orders.length > 0 ? (
          <motion.div
            layout
            className="grid gap-6"
          >
            {orders.map((order, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                key={order.id}
                className="group relative premium-card p-5 lg:p-6 group hover:shadow-xl transition-all duration-500 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none transition-transform duration-500 group-hover:scale-150" />

                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 relative z-10">
                  <div className="flex items-start md:items-center gap-5">
                    <div className="w-14 h-14 shrink-0 rounded-xl bg-muted/40 flex items-center justify-center border border-border/60 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                      <span className="text-2xl">🍱</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-bold text-xl text-foreground tracking-tight group-hover:text-primary transition-colors">
                          {(order.vendors as any)?.business_name}
                        </h3>
                        <Badge className={`capitalize text-[9px] font-bold tracking-widest px-2.5 py-0.5 rounded-full border shadow-sm transition-all duration-300 ${statusStyle(order.orderStatus)}`}>
                          {order.orderStatus?.replace("_", " ")}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-muted-foreground">
                        <span className="capitalize text-foreground font-bold px-2 py-0.5 rounded-lg bg-primary/5 border border-primary/10">{order.mealName}</span>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-primary/60" />
                          <span>{order.deliveryDate ? format(new Date(order.deliveryDate), "dd MMM yyyy") : "—"}</span>
                        </div>
                        {order.deliveryTime && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-primary/60" />
                            <span>{order.deliveryTime}</span>
                          </div>
                        )}
                      </div>

                      {order.notes && (
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60 italic bg-muted/20 w-fit px-3 py-1 rounded-full border border-border/30">
                          <Info className="h-3 w-3" />
                          <span>Note: {order.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row xl:flex-col items-start sm:items-center xl:items-end justify-between xl:justify-center gap-6 border-t xl:border-t-0 xl:border-l border-border/40 pt-6 xl:pt-0 xl:pl-10 h-full">
                    <div className="text-left xl:text-right">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Amount Paid</p>
                      <p className="text-2xl font-bold text-foreground tracking-tight">₹{Number(order.price).toLocaleString()}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl h-10 px-5 text-[11px] font-bold uppercase tracking-widest border-border/60 bg-transparent hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-zinc-900 transition-all gap-2 group/btn"
                        onClick={() => handleReorder(order.mealId)}
                      >
                        <RotateCcw className="h-3.5 w-3.5" /> Reorder Meal
                      </Button>
                      {order.orderStatus === "delivered" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl h-10 px-5 text-[11px] font-bold uppercase tracking-widest border-primary/30 text-primary bg-primary/5 hover:bg-primary hover:text-white transition-all gap-2 group/btn"
                          onClick={() => setReviewOrder(order)}
                        >
                          <Star className="h-3.5 w-3.5" /> Rate Meal
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-3xl p-16 text-center border border-dashed border-border/50 shadow-sm"
          >
            <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-in fade-in zoom-in duration-500">
              <PackageCheck className="h-8 w-8 text-muted-foreground/30" />
            </div>
            <h3 className="text-2xl font-bold text-foreground tracking-tight">No Orders Found</h3>
            <p className="text-muted-foreground mt-2 font-medium text-base max-w-sm mx-auto">
              {statusFilter !== "all"
                ? `No orders matching status "${statusFilter?.replace("_", " ")}" were found.`
                : "You haven't placed any orders yet. Let's find you some delicious tiffins!"}
            </p>
            <Button
              className="mt-8 h-12 px-8 rounded-xl bg-primary text-white font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-all"
              onClick={() => statusFilter !== "all" ? setStatusFilter("all") : window.location.href = "/dashboard/meals"}
            >
              {statusFilter !== "all" ? "Show All Orders" : "Explore Meals"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <ReviewDialog
        order={reviewOrder}
        open={!!reviewOrder}
        onOpenChange={(open) => !open && setReviewOrder(null)}
      />

      <OrderDialog
        menu={reorderMenu}
        open={isReorderOpen}
        onOpenChange={(open) => {
          setIsReorderOpen(open);
          if (!open) setTimeout(() => setReorderMenu(null), 300);
        }}
      />
    </div>
  );
}
