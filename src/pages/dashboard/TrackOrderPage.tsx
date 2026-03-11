import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Truck, CheckCircle2, Clock, ChefHat, Package, MapPin, ChevronRight, Info, Phone, ShieldCheck, Star } from "lucide-react";
import { format } from "date-fns";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const steps = [
  { key: "pending", label: "Order Placed", sub: "Waiting for confirmation", icon: Clock },
  { key: "preparing", label: "Cooking", sub: "Chef is preparing your meal", icon: ChefHat },
  { key: "out_for_delivery", label: "On the Way", sub: "Rider is en route", icon: Truck },
  { key: "delivered", label: "Delivered", sub: "Enjoy your meal!", icon: CheckCircle2 },
];

function OrderTracker({ status }: { status: string }) {
  const currentIdx = steps.findIndex((s) => s.key === status);

  return (
    <div className="relative w-full py-12">
      {/* Background Line */}
      <div className="absolute top-[50%] left-0 w-full h-1 bg-muted/40 rounded-full -translate-y-[50%]" />

      {/* Active Line Progress */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }}
        transition={{ duration: 1, ease: "circOut" }}
        className="absolute top-[50%] left-0 h-1 bg-primary rounded-full -translate-y-[50%] shadow-[0_0_15px_rgba(var(--primary),0.5)]"
      />

      <div className="flex justify-between items-center relative z-10">
        {steps.map((step, i) => {
          const isCompleted = i < currentIdx;
          const isActive = i === currentIdx;
          const isFuture = i > currentIdx;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex flex-col items-center group">
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.2 : 1,
                  backgroundColor: isCompleted ? "rgb(var(--primary))" : isActive ? "white" : "rgb(var(--card))",
                  borderColor: isCompleted || isActive ? "rgb(var(--primary))" : "rgba(var(--border), 0.5)",
                }}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 shadow-xl ${isActive ? "ring-4 ring-primary/10" : ""
                  }`}
              >
                <Icon className={`w-6 h-6 transition-colors duration-500 ${isCompleted ? "text-white" : isActive ? "text-primary" : "text-muted-foreground/40"}`} />
              </motion.div>

              <div className="absolute top-16 flex flex-col items-center text-center w-32">
                <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-500 ${isActive ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground/30"}`}>
                  {step.label}
                </span>
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[8px] font-medium text-muted-foreground mt-1 whitespace-nowrap"
                    >
                      {step.sub}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  const { user } = useAuth();
  const { id } = useParams();

  const { data: activeOrders = [], isLoading } = useQuery({
    queryKey: ["active-orders-today", user?.id, id],
    enabled: !!user,
    queryFn: async () => {
      if (id) {
        const allActive = await api.get<any[]>("/orders/active");
        const exists = allActive.find(o => o.id === id);
        if (exists) return allActive;

        try {
          const specific = await api.get<any>(`/orders/${id}`);
          return [specific, ...allActive.filter(o => o.id !== id)];
        } catch (e) {
          return allActive;
        }
      }
      return api.get<any[]>("/orders/active");
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-10 animate-pulse">
        <div className="h-40 bg-card rounded-[3rem]" />
        <div className="h-[400px] bg-card rounded-[3rem]" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-20"
    >
      <div className="premium-card p-6 lg:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 text-center md:text-left">
            <Badge className="bg-primary/10 text-primary border-primary/20 font-bold px-3 py-1 rounded-full text-[9px] uppercase tracking-widest leading-none">
              Live Tracking
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-none">
              Track <span className="text-primary italic">Order</span>
            </h2>
            <p className="text-muted-foreground font-medium text-base">Track your delicious meals coming to your doorstep.</p>
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <div className="text-right">
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Active Orders</p>
              <p className="font-bold text-2xl text-foreground">{activeOrders.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Truck className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {activeOrders.length > 0 ? (
        <div className="grid gap-10">
          {activeOrders.map((order, idx) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="premium-card group relative p-6 lg:p-8 hover:border-primary/20 transition-all duration-500"
            >
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/2 dark:bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none group-hover:scale-110 transition-transform duration-700" />

              <div className="grid lg:grid-cols-5 gap-12 relative z-10">
                {/* Order Details Column */}
                <div className="lg:col-span-2 space-y-10">
                  <div className="flex items-start gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-background flex items-center justify-center border-2 border-primary/10 shadow-lg group-hover:rotate-3 transition-transform duration-500">
                      <span className="text-3xl text-primary drop-shadow-sm">🍱</span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                        {(order.vendors as any)?.business_name}
                      </h3>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <Badge className="bg-primary/5 text-primary border-primary/10 font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-widest">
                          {order.mealName}
                        </Badge>
                        <Badge variant="outline" className="border-border/60 text-muted-foreground font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-widest">
                          Lunch Service
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-muted/20 border border-border/40 shadow-inner">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Delivery Date</p>
                      <p className="text-base font-bold text-foreground truncate">
                        {order.deliveryDate ? format(new Date(order.deliveryDate), "dd MMM") : "TBD"}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/20 border border-border/40 shadow-inner">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Order Total</p>
                      <p className="text-base font-bold text-foreground truncate">₹{Number(order.price).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground bg-muted/10 p-4 rounded-2xl border border-border/20">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="truncate">Delivery to: {user?.full_name || "Primary Address"}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 h-12 rounded-2xl border-border/60 font-bold uppercase text-[11px] tracking-widest hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-zinc-900 transition-all">
                        <Phone className="h-3.5 w-3.5 mr-2" /> Support
                      </Button>
                      <Button className="flex-1 h-12 rounded-2xl bg-primary text-white font-bold uppercase text-[11px] tracking-widest shadow-lg shadow-primary/20">
                        Help Center
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Tracking Column */}
                <div className="lg:col-span-3 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-border/30 pt-10 lg:pt-0 lg:pl-12 h-full min-h-[300px]">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
                        <ShieldCheck className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Order Status</p>
                        <p className="font-bold text-foreground">On Time</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500 text-white font-bold text-[10px] px-4 py-1.5 rounded-full uppercase tracking-widest">
                      TRACKING
                    </Badge>
                  </div>

                  <OrderTracker status={order.orderStatus} />

                  <div className="mt-20 p-6 rounded-3xl bg-muted/10 border border-dashed border-border/60 text-center">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 leading-relaxed max-w-xs mx-auto">
                      Status updates automatically every <span className="text-primary">60 seconds</span>.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-[2.5rem] p-16 text-center border border-dashed border-border/60 shadow-inner group transition-all duration-700"
        >
          <div className="w-24 h-24 bg-muted/10 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
            <Truck className="h-10 w-10 text-muted-foreground/20" />
          </div>
          <h3 className="text-3xl font-bold text-foreground tracking-tight">No Active Orders</h3>
          <p className="text-muted-foreground mt-3 font-medium text-base max-w-md mx-auto">
            You don't have any active orders right now. Explore our menu to place a new order.
          </p>
          <div className="pt-8">
            <Link to="/dashboard/meals">
              <Button className="h-12 px-10 rounded-xl bg-primary text-white font-bold uppercase tracking-widest text-[11px] shadow-2xl shadow-primary/20 hover:scale-105 transition-all">
                Browse Meals
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
