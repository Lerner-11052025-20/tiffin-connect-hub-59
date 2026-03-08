import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ShoppingCart, MapPin, Plus } from "lucide-react";
import type { Json } from "@/integrations/supabase/types";

interface Menu {
  id: string;
  name: string;
  price: number;
  meal_type: string;
  items: Json;
  vendor_id: string;
  vendors: { business_name: string } | null;
}

interface OrderDialogProps {
  menu: Menu | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function OrderDialog({ menu, open, onOpenChange }: OrderDialogProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [deliveryDate, setDeliveryDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [deliveryTime, setDeliveryTime] = useState("12:30");
  const [addressId, setAddressId] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ address_line: "", city: "", state: "", pincode: "" });

  const { data: addresses } = useQuery({
    queryKey: ["addresses", user?.id],
    enabled: !!user && open,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user!.id)
        .order("is_default", { ascending: false });
      if (error) throw error;
      if (data?.length && !addressId) setAddressId(data[0].id);
      return data ?? [];
    },
  });

  const addAddress = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from("addresses")
        .insert({ ...newAddress, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setAddressId(data.id);
      setShowNewAddress(false);
      setNewAddress({ address_line: "", city: "", state: "", pincode: "" });
      toast.success("Address added!");
    },
    onError: () => toast.error("Failed to add address"),
  });

  const placeOrder = useMutation({
    mutationFn: async () => {
      if (!menu || !user) throw new Error("Missing data");
      const { error } = await supabase.from("orders").insert({
        user_id: user.id,
        vendor_id: menu.vendor_id,
        menu_id: menu.id,
        meal_type: menu.meal_type,
        items: menu.items,
        amount: menu.price,
        delivery_date: deliveryDate,
        delivery_time: deliveryTime,
        delivery_address_id: addressId || null,
        notes: notes || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order placed successfully! 🎉");
      onOpenChange(false);
    },
    onError: () => toast.error("Failed to place order"),
  });

  if (!menu) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" /> Order Meal
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="glass-card rounded-xl p-4">
            <h4 className="font-heading font-semibold text-foreground">{menu.name}</h4>
            <p className="text-xs text-muted-foreground">{(menu.vendors as any)?.business_name}</p>
            <p className="font-bold text-primary mt-1">₹{Number(menu.price).toLocaleString()}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Delivery Date</Label>
              <Input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} min={new Date().toISOString().split("T")[0]} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Time</Label>
              <Input type="time" value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs flex items-center gap-1"><MapPin className="h-3 w-3" /> Delivery Address</Label>
            {addresses && addresses.length > 0 ? (
              <Select value={addressId} onValueChange={setAddressId}>
                <SelectTrigger><SelectValue placeholder="Select address" /></SelectTrigger>
                <SelectContent>
                  {addresses.map((a) => (
                    <SelectItem key={a.id} value={a.id}>{a.label} – {a.address_line}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : !showNewAddress ? (
              <Button variant="outline" size="sm" className="w-full" onClick={() => setShowNewAddress(true)}>
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Address
              </Button>
            ) : null}

            {showNewAddress && (
              <div className="space-y-2 p-3 border border-border rounded-lg">
                <Input placeholder="Address line" value={newAddress.address_line} onChange={(e) => setNewAddress({ ...newAddress, address_line: e.target.value })} />
                <div className="grid grid-cols-3 gap-2">
                  <Input placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
                  <Input placeholder="State" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
                  <Input placeholder="Pincode" value={newAddress.pincode} onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => addAddress.mutate()} disabled={!newAddress.address_line}>Save</Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowNewAddress(false)}>Cancel</Button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Notes (optional)</Label>
            <Textarea rows={2} placeholder="Any special instructions..." value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => placeOrder.mutate()} disabled={placeOrder.isPending}>
            {placeOrder.isPending ? "Placing..." : "Place Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
