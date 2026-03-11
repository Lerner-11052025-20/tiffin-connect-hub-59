import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Store, User, MapPin, Phone, Info, ShieldCheck, CheckCircle2, Clock, Globe, Zap, Settings, Camera, Save, ArrowRight, Activity, Trash2, Edit3, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    queryFn: () => api.get<any>("/vendors/me"),
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
    mutationFn: () => {
      const payload = {
        business_name: form.business_name,
        description: form.description || null,
        phone: form.phone || null,
        address: form.address || null,
        delivery_radius_km: Number(form.delivery_radius_km) || 5,
        is_active: form.is_active,
      };

      if (vendor) {
        return api.put("/vendors/me", payload);
      } else {
        return api.post("/vendors", payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-profile"] });
      toast.success("Profile updated successfully!");
    },
    onError: () => toast.error("Failed to update profile."),
  });

  if (isLoading) {
    return (
      <div className="space-y-12 animate-pulse">
        <div className="h-32 premium-card" />
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="h-96 premium-card" />
          </div>
          <div className="h-64 premium-card" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-24"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="badge-premium">Business Configuration</span>
            <div className="w-1 h-1 rounded-full bg-border" />
            <span className="text-[10px] font-semibold text-muted-foreground/60">Node Identity</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-none">
            Kitchen <span className="text-primary">Identity</span>.
          </h2>
          <p className="text-muted-foreground font-medium text-base max-w-2xl">Configure your shop name, contact details, and delivery information.</p>
        </div>

        {vendor && (
          <div className={`p-3 rounded-xl border flex items-center gap-4 bg-card/50 backdrop-blur-md shadow-sm border-border/40 ${vendor.is_approved ? "text-green-600" : "text-amber-600"}`}>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${vendor.is_approved ? "bg-green-500/10" : "bg-amber-500/10 shadow-inner"}`}>
              {vendor.is_approved ? <ShieldCheck className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
            </div>
            <div>
              <p className="text-[9px] font-bold opacity-60 leading-none mb-1 uppercase tracking-widest">Status</p>
              <p className="text-[11px] font-bold leading-none">{vendor.is_approved ? "Approved Vendor" : "Pending Approval"}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* General Information */}
          <section className="premium-card p-6 lg:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[80px] -mr-40 -mt-40 pointer-events-none" />

            <div className="flex items-center gap-3 mb-8 px-2">
              <span className="badge-premium">General Information</span>
              <div className="h-px w-full bg-border/20" />
            </div>

            <div className="grid md:grid-cols-2 gap-8 relative z-10">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">Business Name</Label>
                <div className="relative group/input">
                  <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30" />
                  <Input
                    value={form.business_name}
                    onChange={(e) => setForm({ ...form, business_name: e.target.value })}
                    placeholder="e.g. Grandma's Spices"
                    className="pl-11 h-12 rounded-xl bg-background border border-border/60 focus:border-primary/50 focus:ring-primary/10 transition-all font-bold text-sm"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">Contact Phone</Label>
                <div className="relative group/input">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30" />
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 00000 00000"
                    className="pl-11 h-12 rounded-xl bg-background border border-border/60 focus:border-primary/50 focus:ring-primary/10 transition-all font-bold text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 relative z-10 pt-8">
              <Label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">Description</Label>
              <div className="relative group/input">
                <Info className="absolute left-5 top-5 h-4 w-4 text-muted-foreground/30" />
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe your kitchen and specialties..."
                  className="pl-14 rounded-xl bg-background border border-border/60 focus:border-primary/50 focus:ring-primary/10 transition-all font-medium text-base p-6 min-h-[120px]"
                  rows={4}
                />
              </div>
            </div>
          </section>

          {/* Location & Radius */}
          <section className="premium-card p-6 lg:p-8 relative overflow-hidden" style={{"--card-border": "var(--accent)"} as any}>
            <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-[80px] -mr-40 -mt-40 pointer-events-none" />

            <div className="flex items-center gap-3 mb-8 px-2">
              <span className="badge-premium">Location & Coverage</span>
              <div className="h-px w-full bg-border/20" />
            </div>

            <div className="space-y-3 relative z-10">
              <Label className="text-[10px] font-bold text-accent uppercase tracking-widest ml-1">Full Address</Label>
              <div className="relative group/input">
                <MapPin className="absolute left-5 top-5 h-4 w-4 text-muted-foreground/30" />
                <Textarea
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Enter your complete business address..."
                  className="pl-14 rounded-xl bg-background border border-border/60 focus:border-accent/50 focus:ring-accent/10 transition-all font-medium text-base p-6 min-h-[100px]"
                  rows={3}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 relative z-10 pt-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold text-accent uppercase tracking-widest ml-1">Delivery Radius (KM)</Label>
                <div className="relative group/input">
                  <Activity className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30" />
                  <Input
                    type="number"
                    value={form.delivery_radius_km}
                    onChange={(e) => setForm({ ...form, delivery_radius_km: e.target.value })}
                    className="pl-14 h-12 rounded-xl bg-background border border-border/60 focus:border-accent/50 focus:ring-accent/10 transition-all font-bold text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between gap-6 bg-card/30 rounded-xl border border-border/40 p-5 shadow-sm">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-accent uppercase tracking-widest">Storefront</p>
                  <p className="text-xs font-bold text-foreground/80">{form.is_active ? "Open for orders" : "Offline"}</p>
                </div>
                <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
              </div>
            </div>
          </section>
        </div>

        {/* Action Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="premium-card p-8 sticky top-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[60px] -mr-32 -mt-32 pointer-events-none" />

            <h4 className="text-lg font-bold text-foreground mb-3 tracking-tight relative z-10">Verification & Persistence</h4>
            <p className="text-[11px] text-muted-foreground/70 mb-8 leading-relaxed font-medium relative z-10 italic">Ensure your business details are up to date for node transparency.</p>

            <div className="space-y-5 relative z-10">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => saveProfile.mutate()}
                  disabled={!form.business_name || saveProfile.isPending}
                  className="w-full h-12 rounded-xl bg-primary text-white font-bold text-[11px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 transition-all border-none"
                >
                  {saveProfile.isPending ? "Syncing..." : vendor ? "Apply Changes" : "Register Node"}
                  <Save className="ml-2 h-3.5 w-3.5" />
                </Button>
              </motion.div>

              {vendor && (
                <div className="p-6 bg-green-500/10 rounded-xl border border-green-500/20 flex flex-col items-center text-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center shadow-inner">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-bold text-green-600 text-[10px] uppercase tracking-widest mb-1.5 leading-none">Status: Online</h5>
                    <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest leading-relaxed">System identity is live and accessible.</p>
                  </div>
                </div>
              )}

              <div className="p-6 bg-muted/20 rounded-2xl border border-border/30 shadow-inner mt-2">
                <div className="flex items-center gap-3 mb-3">
                  <Globe className="h-3.5 w-3.5 text-muted-foreground/40" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Network Integrity</span>
                </div>
                <p className="text-[9px] text-muted-foreground/40 font-bold leading-relaxed uppercase tracking-wider">Changes to identity name may trigger automated security re-indexing.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
