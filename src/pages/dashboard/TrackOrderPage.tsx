import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Truck, CheckCircle2, Clock, ChefHat, Package } from "lucide-react";
import { format } from "date-fns";

const steps = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "preparing", label: "Preparing", icon: ChefHat },
  { key: "out_for_delivery", label: "Out for Delivery", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

function OrderTracker({ status }: { status: string }) {
  const currentIdx = steps.findIndex((s) => s.key === status);

  return (
    <div className="flex items-center gap-1 w-full">
      {steps.map((step, i) => {
        const active = i <= currentIdx;
        const Icon = step.icon;
        return (
          <div key={step.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className={`text-[10px] mt-1 text-center ${active ? "text-foreground font-medium" : "text-muted-foreground"}`}>{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 flex-1 mx-1 rounded-full transition-colors ${i < currentIdx ? "bg-primary" : "bg-muted"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function TrackOrderPage() {
  const { user } = useAuth();

  const { data: activeOrders, isLoading } = useQuery({
    queryKey: ["active-orders", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, vendors(business_name)")
        .eq("user_id", user!.id)
        .in("status", ["pending", "preparing", "out_for_delivery"])
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" /> Track Orders
        </h2>
        <p className="text-muted-foreground text-sm mt-1">Track your active deliveries in real-time</p>
      </div>

      {activeOrders && activeOrders.length > 0 ? (
        <div className="space-y-4">
          {activeOrders.map((order) => (
            <motion.div key={order.id} whileHover={{ y: -2 }} className="glass-card rounded-2xl p-6 hover:shadow-card-hover transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-heading font-semibold text-foreground">{(order.vendors as any)?.business_name}</h3>
                  <p className="text-xs text-muted-foreground capitalize">{order.meal_type} · {format(new Date(order.delivery_date), "dd MMM yyyy")}</p>
                </div>
                <p className="font-heading font-bold text-foreground">₹{Number(order.amount).toLocaleString()}</p>
              </div>
              <OrderTracker status={order.status} />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl p-16 text-center">
          <span className="text-6xl block mb-4">🚚</span>
          <h3 className="font-heading font-semibold text-foreground text-lg">No active orders</h3>
          <p className="text-muted-foreground mt-2 text-sm">Your active deliveries will appear here.</p>
        </motion.div>
      )}
    </motion.div>
  );
}
