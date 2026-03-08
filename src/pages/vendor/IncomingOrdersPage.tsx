import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "sonner";
import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const statusOptions = ["pending", "preparing", "out_for_delivery", "delivered", "cancelled"];

export default function IncomingOrdersPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");

  const { data: vendor } = useQuery({
    queryKey: ["vendor-profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("vendors").select("*").eq("user_id", user!.id).maybeSingle();
      return data;
    },
  });

  const { data: orders, isLoading } = useQuery({
    queryKey: ["vendor-orders", vendor?.id, filter],
    enabled: !!vendor,
    queryFn: async () => {
      let query = supabase
        .from("orders")
        .select("*")
        .eq("vendor_id", vendor!.id)
        .order("created_at", { ascending: false });
      if (filter !== "all") query = query.eq("status", filter);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-orders"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-today-orders"] });
      toast.success("Order status updated");
    },
    onError: () => toast.error("Failed to update order"),
  });

  const nextStatus = (current: string) => {
    const flow = ["pending", "preparing", "out_for_delivery", "delivered"];
    const idx = flow.indexOf(current);
    return idx >= 0 && idx < flow.length - 1 ? flow[idx + 1] : null;
  };

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
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" /> Incoming Orders
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Manage and track customer orders</p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[150px] h-9 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            {statusOptions.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {orders && orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map((order, i) => {
            const next = nextStatus(order.status);
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="glass-card rounded-2xl p-5 hover:shadow-card-hover transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-3">
                      <p className="font-heading font-semibold text-foreground text-sm capitalize">{order.meal_type}</p>
                      <Badge variant="outline" className={`capitalize text-xs ${statusColor(order.status)}`}>
                        {order.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(order.delivery_date), "dd MMM yyyy")}
                      {order.delivery_time && ` · ${order.delivery_time}`}
                      {` · ₹${Number(order.amount).toLocaleString()}`}
                    </p>
                    {order.notes && <p className="text-xs text-muted-foreground italic">Note: {order.notes}</p>}
                  </div>
                  <div className="flex gap-2">
                    {next && (
                      <Button
                        size="sm"
                        onClick={() => updateStatus.mutate({ id: order.id, status: next })}
                        disabled={updateStatus.isPending}
                      >
                        Mark as {next.replace("_", " ")}
                      </Button>
                    )}
                    {order.status !== "cancelled" && order.status !== "delivered" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus.mutate({ id: order.id, status: "cancelled" })}
                        className="text-destructive border-destructive/20 hover:bg-destructive/5"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-16 text-center">
          <span className="text-6xl block mb-4">📦</span>
          <h3 className="font-heading font-semibold text-foreground text-lg">No orders found</h3>
          <p className="text-muted-foreground mt-2 text-sm">{filter !== "all" ? "Try changing the filter." : "Orders will appear here when customers place them."}</p>
        </div>
      )}
    </motion.div>
  );
}
