import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";

export default function BusinessProfilePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    business_name: "",
    description: "",
    phone: "",
    address: "",
    delivery_radius_km: "5",
    is_active: true,
  });

  const { data: vendor, isLoading } = useQuery({
    queryKey: ["vendor-profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("vendors").select("*").eq("user_id", user!.id).maybeSingle();
      return data;
    },
  });

  useEffect(() => {
    if (vendor) {
      setForm({
        business_name: vendor.business_name,
        description: vendor.description ?? "",
        phone: vendor.phone ?? "",
        address: vendor.address ?? "",
        delivery_radius_km: String(vendor.delivery_radius_km),
        is_active: vendor.is_active,
      });
    }
  }, [vendor]);

  const saveProfile = useMutation({
    mutationFn: async () => {
      const payload = {
        business_name: form.business_name,
        description: form.description || null,
        phone: form.phone || null,
        address: form.address || null,
        delivery_radius_km: Number(form.delivery_radius_km) || 5,
        is_active: form.is_active,
      };

      if (vendor) {
        const { error } = await supabase.from("vendors").update(payload).eq("id", vendor.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("vendors").insert({ ...payload, user_id: user!.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-profile"] });
      toast.success("Business profile saved!");
    },
    onError: () => toast.error("Failed to save profile"),
  });

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
      <div>
        <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
          <Store className="h-5 w-5 text-primary" /> Business Profile
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          {vendor ? (vendor.is_approved ? "✅ Your business is approved" : "⏳ Pending admin approval") : "Set up your business to start receiving orders"}
        </p>
      </div>

      <div className="glass-card rounded-2xl p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-muted-foreground">Business Name *</Label>
            <Input value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} placeholder="Maa Ki Rasoi" className="mt-1" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Phone</Label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" className="mt-1" />
          </div>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Description</Label>
          <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Tell customers about your food..." className="mt-1" rows={3} />
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Address</Label>
          <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Full kitchen address" className="mt-1" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-muted-foreground">Delivery Radius (km)</Label>
            <Input type="number" value={form.delivery_radius_km} onChange={(e) => setForm({ ...form, delivery_radius_km: e.target.value })} className="mt-1" />
          </div>
          <div className="flex items-end">
            <div className="flex items-center gap-2">
              <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
              <Label className="text-sm text-muted-foreground">Accepting Orders</Label>
            </div>
          </div>
        </div>

        <Button onClick={() => saveProfile.mutate()} disabled={!form.business_name || saveProfile.isPending}>
          {vendor ? "Update Profile" : "Create Business Profile"}
        </Button>
      </div>
    </motion.div>
  );
}
