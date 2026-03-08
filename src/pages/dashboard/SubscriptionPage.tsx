import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Pause, Play, XCircle } from "lucide-react";

export default function SubscriptionPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ["subscriptions", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*, vendors(business_name), menus(name, meal_type)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("subscriptions")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["active-subscription"] });
      toast.success("Subscription updated!");
    },
    onError: () => toast.error("Failed to update subscription"),
  });

  const statusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700 border-green-200";
      case "paused": return "bg-yellow-100 text-yellow-700 border-yellow-200";
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
      <div>
        <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" /> My Subscriptions
        </h2>
        <p className="text-muted-foreground text-sm mt-1">Manage your meal subscriptions</p>
      </div>

      {subscriptions && subscriptions.length > 0 ? (
        <div className="space-y-4">
          {subscriptions.map((sub) => (
            <motion.div
              key={sub.id}
              whileHover={{ y: -2 }}
              className="glass-card rounded-2xl p-6 hover:shadow-card-hover transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-heading font-semibold text-foreground">
                      {(sub.vendors as any)?.business_name}
                    </h3>
                    <Badge variant="outline" className={`capitalize text-xs ${statusColor(sub.status)}`}>
                      {sub.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Plan</p>
                      <p className="font-medium text-foreground capitalize">{sub.plan_type}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Meals</p>
                      <p className="font-medium text-foreground capitalize">{sub.meal_type}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Amount</p>
                      <p className="font-medium text-foreground">₹{Number(sub.amount).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Start Date</p>
                      <p className="font-medium text-foreground">{format(new Date(sub.start_date), "dd MMM yyyy")}</p>
                    </div>
                    {sub.end_date && (
                      <div>
                        <p className="text-muted-foreground text-xs">End Date</p>
                        <p className="font-medium text-foreground">{format(new Date(sub.end_date), "dd MMM yyyy")}</p>
                      </div>
                    )}
                    {sub.lunch_time && (
                      <div>
                        <p className="text-muted-foreground text-xs">Lunch Time</p>
                        <p className="font-medium text-foreground">{sub.lunch_time}</p>
                      </div>
                    )}
                    {sub.dinner_time && (
                      <div>
                        <p className="text-muted-foreground text-xs">Dinner Time</p>
                        <p className="font-medium text-foreground">{sub.dinner_time}</p>
                      </div>
                    )}
                  </div>
                </div>

                {sub.status !== "cancelled" && (
                  <div className="flex gap-2 sm:flex-col">
                    {sub.status === "active" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateStatus.mutate({ id: sub.id, status: "paused" })}
                        className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                      >
                        <Pause className="h-3.5 w-3.5 mr-1" /> Pause
                      </Button>
                    )}
                    {sub.status === "paused" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateStatus.mutate({ id: sub.id, status: "active" })}
                        className="text-green-600 border-green-200 hover:bg-green-50"
                      >
                        <Play className="h-3.5 w-3.5 mr-1" /> Resume
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatus.mutate({ id: sub.id, status: "cancelled" })}
                      className="text-destructive border-destructive/20 hover:bg-destructive/5"
                    >
                      <XCircle className="h-3.5 w-3.5 mr-1" /> Cancel
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl p-16 text-center">
          <span className="text-6xl block mb-4">🍽️</span>
          <h3 className="font-heading font-semibold text-foreground text-lg">No subscriptions yet</h3>
          <p className="text-muted-foreground mt-2 text-sm">Browse meals and subscribe to a vendor to get started!</p>
        </motion.div>
      )}
    </motion.div>
  );
}
