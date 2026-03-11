import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { User, MapPin, Plus, Trash2, Mail, Phone, ShieldCheck, Bell, Camera, ChevronRight, Settings, CreditCard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    inApp: true,
    email: true,
    push: false
  });

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: "Home", address_line: "", city: "", state: "", pincode: "" });

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: () => api.get<any>("/profiles/me"),
  });

  useEffect(() => {
    if (profile) {
      setEditName(profile.full_name);
      setEditPhone(profile.phone ?? "");
      if (profile.notificationSettings) {
        setNotificationSettings(profile.notificationSettings);
      }
    }
  }, [profile]);

  const { data: addresses } = useQuery({
    queryKey: ["addresses", user?.id],
    enabled: !!user,
    queryFn: () => api.get<any[]>("/addresses"),
  });

  const updateProfile = useMutation({
    mutationFn: () => api.put("/profiles/me", {
      full_name: editName,
      phone: editPhone || null,
      notificationSettings
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated!");
      setIsEditing(false);
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const addAddress = useMutation({
    mutationFn: () => api.post("/addresses", newAddress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address added!");
      setShowAddressForm(false);
      setNewAddress({ label: "Home", address_line: "", city: "", state: "", pincode: "" });
    },
    onError: () => toast.error("Failed to add address"),
  });

  const deleteAddress = useMutation({
    mutationFn: (id: string) => api.delete(`/addresses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address removed");
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-10 animate-pulse">
        <div className="h-40 bg-card rounded-[3rem] border border-border/50" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="h-[400px] bg-card rounded-[2.5rem] border border-border/50" />
          <div className="lg:col-span-2 space-y-8">
            <div className="h-64 bg-card rounded-[2.5rem] border border-border/50" />
            <div className="h-64 bg-card rounded-[2.5rem] border border-border/50" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 pb-20 relative"
    >
      {/* Header Profile Section */}
      <div className="relative group p-6 lg:p-10 rounded-[2.5rem] bg-card border border-border/50 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-accent/5 rounded-full blur-[80px] -ml-24 -mb-24 pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 relative z-10">
          <div className="relative group/avatar">
            <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-[2rem] bg-gradient-to-br from-primary/20 via-primary/5 to-accent/20 flex items-center justify-center p-1 shadow-2xl ring-1 ring-white/10 ring-inset">
              <div className="w-full h-full rounded-[1.8rem] bg-background flex items-center justify-center overflow-hidden border-2 border-primary/20">
                <span className="text-4xl lg:text-5xl font-bold text-primary drop-shadow-sm">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <button className="absolute bottom-0.5 right-0.5 w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-xl border-2 border-card group-hover/avatar:scale-110 transition-transform">
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="text-center lg:text-left flex-1 space-y-3">
            <div>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 mb-2">
                <Badge className="bg-primary/10 text-primary border-primary/20 font-bold px-3 py-1 rounded-full text-[9px] uppercase tracking-widest leading-none">
                  Verified Member
                </Badge>
                <Badge className="bg-accent/10 text-accent border-accent/20 font-bold px-3 py-1 rounded-full text-[9px] uppercase tracking-widest leading-none">
                  Regular User
                </Badge>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-none mb-2">
                {profile?.full_name || "Guest User"}
              </h2>
              <p className="text-muted-foreground font-medium text-base flex items-center justify-center lg:justify-start gap-2">
                <Mail className="h-4 w-4 text-primary" /> {user?.email}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <Button variant="outline" className="h-11 rounded-xl px-6 border-border/60 font-bold uppercase text-[10px] tracking-widest bg-background/50 backdrop-blur-sm">
                Manage Billing
              </Button>
              <Button variant="outline" onClick={() => signOut()} className="h-11 rounded-xl px-6 border-red-500/20 text-red-600 hover:bg-red-500 hover:text-white transition-all font-bold uppercase text-[10px] tracking-widest bg-background/50 backdrop-blur-sm">
                <LogOut className="h-3.5 w-3.5 mr-2" /> Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Sidebar Info */}
        <div className="space-y-6">
          {/* Status Overview */}
          <div className="premium-card p-6 group overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-[40px] -mr-8 -mt-8" />
            <h4 className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground mb-8 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" /> Account Security
            </h4>
            <div className="space-y-6">
              {[
                { icon: ShieldCheck, label: "Status", status: "Active", color: "text-green-500", bg: "bg-green-500/10" },
                { icon: Mail, label: "Email", status: "Verified", color: "text-blue-500", bg: "bg-blue-500/10" },
                { icon: Phone, label: "Phone", status: profile?.phone ? "Linked" : "Not Linked", color: profile?.phone ? "text-primary" : "text-muted-foreground", bg: profile?.phone ? "bg-primary/10" : "bg-muted/10" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between group/item">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center border border-white/10 shadow-inner group-hover/item:scale-110 transition-transform`}>
                      <item.icon className={`h-4 w-4 ${item.color}`} />
                    </div>
                    <span className="text-[13px] font-bold uppercase tracking-widest text-foreground">{item.label}</span>
                  </div>
                  <Badge variant="outline" className={`${item.color} text-[8px] font-bold uppercase tracking-widest border-none`}>{item.status}</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div className="premium-card p-6 group overflow-hidden">
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-[40px] -mr-8 -mb-8" />
            <h4 className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground mb-8 flex items-center gap-2">
              <Bell className="h-4 w-4 text-accent" /> Notifications
            </h4>
            <div className="space-y-6">
              {[
                { id: 'inApp', icon: Bell, label: "App Alerts", sub: "Receive updates in-app", color: "text-primary", bg: "bg-primary/10", checked: notificationSettings.inApp },
                { id: 'email', icon: Mail, label: "Email Updates", sub: "Receive meal order emails", color: "text-accent", bg: "bg-accent/10", checked: notificationSettings.email },
                { id: 'push', icon: Bell, label: "Push Alerts", sub: "Mobile push notifications", color: "text-indigo-500", bg: "bg-indigo-500/10", checked: notificationSettings.push, disabled: true },
              ].map((item, i) => (
                <div key={i} className={`flex items-center justify-between ${item.disabled ? 'opacity-40 grayscale' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center border border-white/10 shadow-inner`}>
                      <item.icon className={`h-4 w-4 ${item.color}`} />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-foreground block">{item.label}</span>
                      <span className="text-[10px] text-muted-foreground font-medium">{item.sub}</span>
                    </div>
                  </div>
                  <Switch
                    disabled={item.disabled}
                    checked={item.checked}
                    onCheckedChange={(checked) => {
                      setNotificationSettings({ ...notificationSettings, [item.id]: checked });
                      updateProfile.mutate();
                    }}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Identity & Core Details */}
          <div className="premium-card p-6 lg:p-8">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-4">
                <div className="w-2 h-8 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                Profile Details
              </h3>
              {!isEditing && (
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="h-10 rounded-xl px-4 font-bold uppercase text-[10px] tracking-widest text-primary hover:bg-primary/10">
                  Edit Profile <ChevronRight className="h-3 w-3 ml-2" />
                </Button>
              )}
            </div>

            <div className="grid gap-8">
              {!isEditing ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid md:grid-cols-2 gap-6"
                >
                  <div className="p-6 rounded-3xl bg-muted/20 border border-border/40 group hover:border-primary/30 transition-all duration-500">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center border border-border shadow-soft">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Full Name</p>
                        <p className="text-xl font-bold text-foreground tracking-tight">{profile?.full_name || "Guest"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-muted/20 border border-border/40 group hover:border-accent/30 transition-all duration-500">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center border border-border shadow-soft">
                        <Phone className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Phone Number</p>
                        <p className="text-xl font-bold text-foreground tracking-tight">{profile?.phone || "Not Linked"}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8 p-8 border-2 border-primary/20 bg-primary/2 rounded-3xl"
                >
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Full Name</Label>
                      <Input id="name" value={editName} onChange={(e) => setEditName(e.target.value)} className="h-14 rounded-2xl border-2 border-border/60 bg-background/80 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold text-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Phone Number</Label>
                      <Input id="phone" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="+91..." className="h-14 rounded-2xl border-2 border-border/60 bg-background/80 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold text-lg" />
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Button onClick={() => updateProfile.mutate()} disabled={updateProfile.isPending} className="flex-1 h-14 rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)} className="h-14 px-8 rounded-2xl border-border/60 font-bold uppercase text-[11px] tracking-widest hover:bg-muted">
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              )}

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">User ID</Label>
                <div className="h-14 flex items-center px-6 rounded-2xl bg-muted/30 text-muted-foreground/40 font-mono text-[10px] border border-dashed border-border/60 overflow-hidden shadow-inner">
                  {user?.id}
                </div>
              </div>
            </div>
          </div>

          {/* Logistics & Delivery */}
          <div className="premium-card p-6 lg:p-8 group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-[40px] -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 relative z-10">
              <h3 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-3">
                <div className="w-1.5 h-6 bg-accent rounded-full shadow-lg" />
                My Addresses
              </h3>
              <Button onClick={() => setShowAddressForm(!showAddressForm)} className="h-10 px-5 rounded-xl bg-background border border-accent/20 text-accent hover:bg-accent hover:text-white transition-all font-bold uppercase text-[9px] tracking-widest shadow-lg shadow-accent/5">
                <Plus className="h-3.5 w-3.5 mr-2" /> Add Address
              </Button>
            </div>

            <AnimatePresence>
              {showAddressForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mb-10"
                >
                  <div className="border-2 border-accent/20 bg-accent/2 rounded-3xl p-8 space-y-6 relative">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest ml-2 text-muted-foreground">Label</Label>
                        <Input placeholder="Home, Work, etc." value={newAddress.label} onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })} className="h-12 rounded-xl bg-background border-border/60 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest ml-2 text-muted-foreground">Pincode</Label>
                        <Input placeholder="6-digit code" value={newAddress.pincode} onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} className="h-12 rounded-xl bg-background border-border/60 font-bold" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest ml-2 text-muted-foreground">Address Line</Label>
                      <Input placeholder="House #, Building, Street" value={newAddress.address_line} onChange={(e) => setNewAddress({ ...newAddress, address_line: e.target.value })} className="h-12 rounded-xl bg-background border-border/60 font-bold" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest ml-2 text-muted-foreground">City</Label>
                        <Input value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} className="h-12 rounded-xl bg-background border-border/60 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest ml-2 text-muted-foreground">State</Label>
                        <Input value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} className="h-12 rounded-xl bg-background border-border/60 font-bold" />
                      </div>
                    </div>
                    <div className="flex gap-4 pt-2">
                      <Button onClick={() => addAddress.mutate()} disabled={!newAddress.address_line || addAddress.isPending} className="flex-1 h-12 rounded-xl bg-accent text-white font-bold uppercase text-[11px] tracking-widest shadow-xl shadow-accent/20">Add Address</Button>
                      <Button variant="outline" onClick={() => setShowAddressForm(false)} className="h-12 px-6 rounded-xl border-border/60 font-bold uppercase text-[11px] tracking-widest">Cancel</Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid md:grid-cols-2 gap-6 relative z-10">
              {addresses && addresses.length > 0 ? (
                addresses.map((addr) => (
                  <motion.div
                    layout
                    key={addr.id}
                    className="group/addr flex flex-col justify-between border border-border/60 rounded-3xl p-7 bg-muted/10 hover:border-accent/40 hover:bg-card hover:shadow-2xl transition-all duration-500 relative"
                  >
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center border border-border group-hover/addr:scale-110 transition-transform">
                            <MapPin className="h-5 w-5 text-accent" />
                          </div>
                          <div>
                            <p className="text-lg font-bold text-foreground tracking-tight group-hover/addr:text-accent transition-colors">
                              {addr.label}
                            </p>
                            {addr.is_default && <Badge variant="outline" className="mt-1 text-[8px] font-bold tracking-widest bg-accent/10 text-accent border-accent/20 px-2 rounded-full">Default Address</Badge>}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteAddress.mutate(addr.id)}
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="space-y-1 pl-1">
                        <p className="text-sm font-bold text-muted-foreground leading-relaxed">
                          {addr.address_line}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                          {addr.city}, {addr.state} • {addr.pincode}
                        </p>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full h-11 rounded-xl border-border/40 hover:border-accent/20 font-bold uppercase text-[10px] tracking-widest bg-background/30 backdrop-blur-sm group-hover/addr:bg-accent group-hover/addr:text-white transition-all">
                      Set as Default
                    </Button>
                  </motion.div>
                ))
              ) : (
                <div className="md:col-span-2 text-center py-20 bg-muted/10 rounded-[3rem] border border-dashed border-border/60 group-hover:border-accent/20 transition-colors">
                  <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MapPin className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                  <h4 className="text-2xl font-bold text-foreground tracking-tight">No Addresses Found</h4>
                  <p className="text-sm text-muted-foreground font-medium mt-2">Please add an address to receive your meals.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
