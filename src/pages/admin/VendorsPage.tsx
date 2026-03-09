import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ChefHat, CheckCircle2, XCircle, Ban } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { format } from "date-fns";

export default function VendorsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");

  const { data: vendors, isLoading } = useQuery({
    queryKey: ["admin-vendors", filter],
    queryFn: async () => {
      let query = supabase.from("vendors").select("*").order("created_at", { ascending: false });
      if (filter === "pending") query = query.eq("is_approved", false);
      else if (filter === "approved") query = query.eq("is_approved", true);
      else if (filter === "inactive") query = query.eq("is_active", false);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });

  const updateVendor = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, any> }) => {
      const { error } = await supabase.from("vendors").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vendors"] });
      queryClient.invalidateQueries({ queryKey: ["admin-vendors-stats"] });
      toast.success("Vendor updated");
    },
    onError: () => toast.error("Failed to update vendor"),
  });

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-primary" /> Vendor Management
          </h2>
          <p className="text-muted-foreground text-sm mt-1">{vendors?.length ?? 0} vendors</p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[130px] h-9 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {vendors && vendors.length > 0 ? (
        <div className="space-y-3">
          {vendors.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass-card rounded-2xl p-5 hover:shadow-card-hover transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-heading font-semibold text-foreground">{v.business_name}</h3>
                    {v.is_approved ? (
                      <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800">Approved</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800">Pending</Badge>
                    )}
                    {!v.is_active && (
                      <Badge variant="outline" className="text-xs bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800">Inactive</Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                    {v.phone && <p className="text-muted-foreground text-xs">📞 {v.phone}</p>}
                    {v.address && <p className="text-muted-foreground text-xs">📍 {v.address}</p>}
                    <p className="text-muted-foreground text-xs">🚚 {v.delivery_radius_km} km</p>
                    <p className="text-muted-foreground text-xs">📅 {format(new Date(v.created_at), "dd MMM yyyy")}</p>
                  </div>
                  {v.description && <p className="text-xs text-muted-foreground">{v.description}</p>}
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  {!v.is_approved && (
                    <Button
                      size="sm"
                      onClick={() => updateVendor.mutate({ id: v.id, updates: { is_approved: true } })}
                      className="gap-1"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                    </Button>
                  )}
                  {v.is_approved && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateVendor.mutate({ id: v.id, updates: { is_approved: false } })}
                      className="text-yellow-600 border-yellow-200 hover:bg-yellow-50 gap-1"
                    >
                      <XCircle className="h-3.5 w-3.5" /> Revoke
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateVendor.mutate({ id: v.id, updates: { is_active: !v.is_active } })}
                    className={v.is_active ? "text-destructive border-destructive/20 hover:bg-destructive/5 gap-1" : "text-green-600 border-green-200 hover:bg-green-50 gap-1"}
                  >
                    <Ban className="h-3.5 w-3.5" /> {v.is_active ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-16 text-center">
          <span className="text-6xl block mb-4">👨‍🍳</span>
          <h3 className="font-heading font-semibold text-foreground text-lg">No vendors found</h3>
        </div>
      )}
    </motion.div>
  );
}
