import api from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChefHat, CheckCircle2, XCircle, Ban, Filter, Phone, MapPin, Navigation, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function VendorsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");

  const { data: vendors, isLoading } = useQuery({
    queryKey: ["admin-vendors", filter],
    queryFn: () => api.get<any[]>(`/admin/vendors?filter=${filter}`),
  });

  const updateVendor = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Record<string, any> }) =>
      api.put(`/admin/vendors/${id}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vendors"] });
      queryClient.invalidateQueries({ queryKey: ["admin-vendors-stats"] });
      toast.success("Vendor settings updated");
    },
    onError: () => toast.error("Failed to update vendor"),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Scanning Partner Network</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="badge-premium w-fit mb-1.5">
            <span>Supply Chain</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-none">
            Culinary <span className="text-primary">Partners</span>.
          </h2>
          <p className="text-muted-foreground font-medium text-base max-w-2xl">
            Audit master kitchens and manage artisan partnership status.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-card/40 backdrop-blur-md p-1.5 rounded-xl border border-border/40 shadow-lg">
          <div className="flex items-center gap-2 px-3 border-r border-border/40">
            <Filter className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Status</span>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[150px] border-0 focus:ring-0 shadow-none h-9 font-bold text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl luxury-blur border-border/40">
              <SelectItem value="all" className="text-[10px] font-bold uppercase tracking-widest py-2.5">All Partners</SelectItem>
              <SelectItem value="pending" className="text-[10px] font-bold uppercase tracking-widest py-2.5">Awaiting Audit</SelectItem>
              <SelectItem value="approved" className="text-[10px] font-bold uppercase tracking-widest py-2.5">Verified</SelectItem>
              <SelectItem value="inactive" className="text-[10px] font-bold uppercase tracking-widest py-2.5">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {vendors && vendors.length > 0 ? (
        <div className="grid gap-6">
          {vendors.map((v, idx) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="premium-card p-6 group/vendor overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                <div className="flex flex-col md:flex-row md:items-start gap-6 flex-1">
                  <div className="w-16 h-16 rounded-2xl bg-background border border-primary/10 shadow-inner flex items-center justify-center text-3xl shrink-0 group-hover/vendor:rotate-2 transition-transform duration-500">
                    👨‍🍳
                  </div>

                  <div className="space-y-4 flex-1">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-xl font-bold tracking-tight text-foreground">{v.business_name}</h3>
                        <div className="flex gap-1.5">
                          {v.is_approved ? (
                            <div className="px-2.5 py-0.5 rounded-full bg-green-500/5 text-green-600 border border-green-500/10 text-[8px] font-bold uppercase tracking-widest leading-none">
                              Master Verified
                            </div>
                          ) : (
                            <div className="px-2.5 py-0.5 rounded-full bg-amber-500/5 text-amber-600 border border-amber-500/10 text-[8px] font-bold uppercase tracking-widest animate-pulse leading-none">
                              Audit Required
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-[9px] text-muted-foreground/30 font-bold uppercase tracking-widest italic">Kitchen ID: TC-{v.id.slice(-6).toUpperCase()}</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { icon: Phone, label: v.phone || "No contact", color: "text-primary/60" },
                        { icon: MapPin, label: v.address || "Local Hub", color: "text-accent/60" },
                        { icon: Navigation, label: `${v.delivery_radius_km}KM`, color: "text-blue-500/60" },
                        { icon: Calendar, label: v.createdAt ? format(new Date(v.createdAt), "dd MMM yy") : "—", color: "text-purple-500/60" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">
                          <div className={`p-1.5 rounded-lg bg-muted/20 ${item.color} border border-border/20 shadow-inner`}>
                            <item.icon className="h-3 w-3" />
                          </div>
                          <span className="truncate">{item.label}</span>
                        </div>
                      ))}
                    </div>

                    {v.description && (
                      <div className="relative p-4 rounded-xl bg-muted/10 border border-border/40 overflow-hidden">
                        <p className="text-[10px] text-muted-foreground/80 leading-relaxed italic relative z-10 line-clamp-2">
                          "{v.description}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-row lg:flex-col gap-3 sm:min-w-[180px]">
                  {!v.is_approved ? (
                    <button
                      onClick={() => updateVendor.mutate({ id: v.id, updates: { is_approved: true } })}
                      className="flex-1 lg:flex-none h-11 bg-primary text-white rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/10 transition-all hover:translate-y-[-1px]"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-[9px] font-bold uppercase tracking-widest">Approve</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => updateVendor.mutate({ id: v.id, updates: { is_approved: false } })}
                      className="flex-1 lg:flex-none h-11 bg-amber-500/5 text-amber-600 border border-amber-500/10 rounded-xl flex items-center justify-center gap-2 hover:bg-amber-500/10 transition-all"
                    >
                      <XCircle className="h-4 w-4" />
                      <span className="text-[9px] font-bold uppercase tracking-widest">Revoke</span>
                    </button>
                  )}

                  <button
                    onClick={() => updateVendor.mutate({ id: v.id, updates: { is_active: !v.is_active } })}
                    className={`flex-1 lg:flex-none h-11 rounded-xl flex items-center justify-center gap-2 transition-all ${v.is_active
                      ? "bg-red-500/5 text-red-600 border border-red-500/10 hover:bg-red-500/10"
                      : "bg-green-500/5 text-green-600 border border-green-500/10 hover:bg-green-500/10"
                      }`}
                  >
                    <Ban className="h-4 w-4" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">
                      {v.is_active ? "Suspend" : "Restore"}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="premium-card py-24 text-center flex flex-col items-center border-dashed">
          <div className="w-20 h-20 rounded-full bg-muted/20 flex items-center justify-center text-5xl mb-6 grayscale opacity-30">👨‍🍳</div>
          <h3 className="text-2xl font-bold tracking-tight text-foreground">Operational Silence</h3>
          <p className="text-muted-foreground mt-3 font-medium text-sm max-w-sm">Refine your audit filters to locate specific kitchen partners.</p>
        </div>
      )}
    </div>
  );
}
