import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Users, Shield, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { format } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const { data: usersWithRoles, isLoading } = useQuery({
    queryKey: ["admin-users", roleFilter],
    queryFn: async () => {
      const { data: roles } = await supabase.from("user_roles").select("user_id, role");
      const roleMap = new Map<string, AppRole>();
      roles?.forEach((r) => roleMap.set(r.user_id, r.role));

      let query = supabase.from("profiles").select("*").order("created_at", { ascending: false });
      const { data: profiles, error } = await query;
      if (error) throw error;

      const combined = (profiles ?? []).map((p) => ({
        ...p,
        role: roleMap.get(p.user_id) ?? "user" as AppRole,
      }));

      if (roleFilter !== "all") {
        return combined.filter((u) => u.role === roleFilter);
      }
      return combined;
    },
  });

  const updateRole = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: AppRole }) => {
      // Upsert: delete old then insert new
      await supabase.from("user_roles").delete().eq("user_id", userId);
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: newRole });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User role updated");
    },
    onError: () => toast.error("Failed to update role"),
  });

  const roleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-700 border-red-200";
      case "vendor": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-green-100 text-green-700 border-green-200";
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
            <Users className="h-5 w-5 text-primary" /> User Management
          </h2>
          <p className="text-muted-foreground text-sm mt-1">{usersWithRoles?.length ?? 0} users found</p>
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[130px] h-9 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="user">Users</SelectItem>
            <SelectItem value="vendor">Vendors</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {usersWithRoles && usersWithRoles.length > 0 ? (
        <div className="space-y-3">
          {usersWithRoles.map((u, i) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass-card rounded-2xl p-5 hover:shadow-card-hover transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-3">
                    <p className="font-heading font-semibold text-foreground text-sm">{u.full_name || "Unnamed"}</p>
                    <Badge variant="outline" className={`capitalize text-xs ${roleColor(u.role)}`}>{u.role}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{u.phone || "No phone"} · Joined {format(new Date(u.created_at), "dd MMM yyyy")}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                  <Select
                    value={u.role}
                    onValueChange={(v) => updateRole.mutate({ userId: u.user_id, newRole: v as AppRole })}
                  >
                    <SelectTrigger className="w-[110px] h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="vendor">Vendor</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-16 text-center">
          <span className="text-6xl block mb-4">👥</span>
          <h3 className="font-heading font-semibold text-foreground text-lg">No users found</h3>
        </div>
      )}
    </motion.div>
  );
}
