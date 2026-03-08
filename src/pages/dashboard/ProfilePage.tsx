import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { User, MapPin, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Address form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: "Home", address_line: "", city: "", state: "", pincode: "" });

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user!.id).maybeSingle();
      if (data) {
        setEditName(data.full_name);
        setEditPhone(data.phone ?? "");
      }
      return data;
    },
  });

  const { data: addresses } = useQuery({
    queryKey: ["addresses", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("addresses").select("*").eq("user_id", user!.id).order("is_default", { ascending: false });
      return data ?? [];
    },
  });

  const updateProfile = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: editName, phone: editPhone || null })
        .eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated!");
      setIsEditing(false);
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const addAddress = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("addresses").insert({
        user_id: user!.id,
        ...newAddress,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address added!");
      setShowAddressForm(false);
      setNewAddress({ label: "Home", address_line: "", city: "", state: "", pincode: "" });
    },
    onError: () => toast.error("Failed to add address"),
  });

  const deleteAddress = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("addresses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address removed");
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
      {/* Profile Info */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-heading font-semibold text-foreground text-lg flex items-center gap-2 mb-5">
          <User className="h-5 w-5 text-primary" /> Profile
        </h2>
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Email</Label>
            <p className="text-sm font-medium text-foreground">{user?.email}</p>
          </div>
          {isEditing ? (
            <>
              <div>
                <Label htmlFor="name" className="text-xs text-muted-foreground">Full Name</Label>
                <Input id="name" value={editName} onChange={(e) => setEditName(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="phone" className="text-xs text-muted-foreground">Phone</Label>
                <Input id="phone" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="+91..." className="mt-1" />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => updateProfile.mutate()} disabled={updateProfile.isPending}>Save</Button>
                <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              </div>
            </>
          ) : (
            <>
              <div>
                <Label className="text-xs text-muted-foreground">Full Name</Label>
                <p className="text-sm font-medium text-foreground">{profile?.full_name || "—"}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Phone</Label>
                <p className="text-sm font-medium text-foreground">{profile?.phone || "—"}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>Edit Profile</Button>
            </>
          )}
        </div>
      </div>

      {/* Addresses */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading font-semibold text-foreground text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" /> Addresses
          </h2>
          <Button size="sm" variant="outline" onClick={() => setShowAddressForm(!showAddressForm)}>
            <Plus className="h-3.5 w-3.5 mr-1" /> Add
          </Button>
        </div>

        {showAddressForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="border border-border/30 rounded-xl p-4 mb-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Label</Label>
                <Input value={newAddress.label} onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })} placeholder="Home" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Pincode</Label>
                <Input value={newAddress.pincode} onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} placeholder="400001" className="mt-1" />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Address Line</Label>
              <Input value={newAddress.address_line} onChange={(e) => setNewAddress({ ...newAddress, address_line: e.target.value })} placeholder="Flat no, Building, Street" className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">City</Label>
                <Input value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} placeholder="Mumbai" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">State</Label>
                <Input value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} placeholder="Maharashtra" className="mt-1" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => addAddress.mutate()} disabled={!newAddress.address_line || addAddress.isPending}>Save Address</Button>
              <Button size="sm" variant="outline" onClick={() => setShowAddressForm(false)}>Cancel</Button>
            </div>
          </motion.div>
        )}

        {addresses && addresses.length > 0 ? (
          <div className="space-y-3">
            {addresses.map((addr) => (
              <div key={addr.id} className="flex items-start justify-between border border-border/30 rounded-xl p-4 glass-subtle">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground text-sm">{addr.label}</p>
                    {addr.is_default && <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">Default</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{addr.address_line}</p>
                  <p className="text-xs text-muted-foreground">{addr.city}, {addr.state} {addr.pincode}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteAddress.mutate(addr.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No addresses saved yet.</p>
        )}
      </div>
    </motion.div>
  );
}
