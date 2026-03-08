import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Clock, Filter } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders", user?.id, statusFilter],
    enabled: !!user,
    queryFn: async () => {
      let query = supabase
        .from("orders")
        .select("*, vendors(business_name)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });

  const statusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-700 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "preparing": return "bg-blue-100 text-blue-700 border-blue-200";
      case "out_for_delivery": return "bg-purple-100 text-purple-700 border-purple-200";
      case "cancelled": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" /> Order History
          </h2>
          <p className="text-muted-foreground text-sm mt-1">View all your past and current orders</p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] h-9 text-sm">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {orders && orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="glass-card rounded-2xl p-5 hover:shadow-card-hover transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-heading font-semibold text-foreground text-sm">
                      {(order.vendors as any)?.business_name}
                    </h3>
                    <Badge variant="outline" className={`capitalize text-xs ${statusColor(order.status)}`}>
                      {order.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="capitalize">{order.meal_type}</span> · {format(new Date(order.delivery_date), "dd MMM yyyy")}
                    {order.delivery_time && ` · ${order.delivery_time}`}
                  </p>
                  {order.notes && (
                    <p className="text-xs text-muted-foreground italic">Note: {order.notes}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-heading font-bold text-foreground">₹{Number(order.amount).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(order.created_at), "dd MMM, hh:mm a")}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl p-16 text-center">
          <span className="text-6xl block mb-4">📦</span>
          <h3 className="font-heading font-semibold text-foreground text-lg">No orders found</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            {statusFilter !== "all" ? "Try changing the filter." : "Your order history will appear here."}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
