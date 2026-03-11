import api from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Users, Shield, Filter, UserCog, Calendar, Phone, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const { data: usersWithRoles, isLoading } = useQuery({
    queryKey: ["admin-users", roleFilter],
    queryFn: () => api.get<any[]>(`/admin/users?role=${roleFilter}`),
  });

  const updateRole = useMutation({
    mutationFn: ({ userId, newRole }: { userId: string; newRole: string }) =>
      api.put(`/admin/users/${userId}/role`, { role: newRole }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User role updated successfully");
    },
    onError: () => toast.error("Failed to update user role"),
  });

  const roleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-500/10 text-red-600 border-red-500/20";
      case "vendor": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default: return "bg-green-500/10 text-green-600 border-green-500/20";
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Synchronizing Data</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="badge-premium w-fit mb-1.5">
            <span>Access Control</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-none">
            User <span className="text-primary">Management</span>.
          </h2>
          <p className="text-muted-foreground font-medium text-base max-w-2xl">
            Audit master accounts and manage platform-wide access levels.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-card/40 backdrop-blur-md p-1.5 rounded-xl border border-border/40 shadow-lg">
          <div className="flex items-center gap-2 px-3 border-r border-border/40">
            <Filter className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Filter</span>
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[150px] border-0 focus:ring-0 shadow-none h-9 font-bold text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl luxury-blur border-border/40">
              <SelectItem value="all" className="text-[10px] font-bold uppercase tracking-widest py-2.5">Global View</SelectItem>
              <SelectItem value="user" className="text-[10px] font-bold uppercase tracking-widest py-2.5">Customers</SelectItem>
              <SelectItem value="vendor" className="text-[10px] font-bold uppercase tracking-widest py-2.5">Partners</SelectItem>
              <SelectItem value="admin" className="text-[10px] font-bold uppercase tracking-widest py-2.5">Admins</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Container */}
      {usersWithRoles && usersWithRoles.length > 0 ? (
        <div className="grid gap-4">
          {usersWithRoles.map((u, idx) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="premium-card p-5 group/user overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-background border border-primary/10 shadow-inner flex items-center justify-center text-xl font-bold text-primary transition-all group-hover/user:scale-105 duration-500">
                    {u.full_name?.charAt(0) || "U"}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold tracking-tight text-foreground capitalize leading-none">{u.full_name || "Anonymous Artisan"}</h3>
                       <div className={`px-2.5 py-0.5 rounded-full border text-[8px] font-bold uppercase tracking-widest leading-none ${roleColor(u.role)}`}>
                        {u.role}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-[9px] text-muted-foreground/50 font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> {u.phone || "No Contact"}</span>
                      <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {u.createdAt ? format(new Date(u.createdAt), "dd MMM yy") : "—"}</span>
                      <span className="flex items-center gap-1.5 text-foreground/20 italic">ID: {u.id.slice(-6)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-muted/10 border border-border/40 p-2 rounded-xl transition-all hover:bg-muted/20">
                  <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center shadow-inner">
                    <UserCog className="h-4 w-4 text-muted-foreground/60" />
                  </div>
                  <div className="flex items-center min-w-[120px]">
                    <Select
                      value={u.role}
                      onValueChange={(v) => updateRole.mutate({ userId: u.id, newRole: v })}
                    >
                      <SelectTrigger className="h-8 rounded-lg font-bold border-0 focus:ring-0 shadow-none text-[10px] uppercase tracking-widest px-2 bg-transparent hover:text-primary transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl luxury-blur border-border/40 min-w-[140px]">
                        <SelectItem value="user" className="text-[10px] font-bold py-2.5 uppercase tracking-widest">Customer Base</SelectItem>
                        <SelectItem value="vendor" className="text-[10px] font-bold py-2.5 uppercase tracking-widest">Master Partner</SelectItem>
                        <SelectItem value="admin" className="text-[10px] font-bold py-2.5 uppercase tracking-widest">System Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="premium-card py-24 text-center flex flex-col items-center border-dashed">
          <div className="w-20 h-20 rounded-full bg-muted/20 flex items-center justify-center text-4xl mb-6 grayscale opacity-30">👥</div>
          <h3 className="text-2xl font-bold tracking-tight text-foreground">Operational Silence</h3>
          <p className="text-muted-foreground mt-3 font-medium text-sm max-w-sm">Refine your filtration parameters to locate specific platform members.</p>
        </div>
      )}
    </div>
  );
}
