import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarDays, MapPin, Plus } from "lucide-react";
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

const PLAN_MULTIPLIER: Record<string, { label: string; days: number }> = {
  weekly: { label: "Weekly (7 days)", days: 7 },
  biweekly: { label: "Bi-weekly (14 days)", days: 14 },
  monthly: { label: "Monthly (30 days)", days: 30 },
};

interface SubscribeDialogProps {
  menu: Menu | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SubscribeDialog({ menu, open, onOpenChange }: SubscribeDialogProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [planType, setPlanType] = useState("weekly");
  const [lunchTime, setLunchTime] = useState("12:30");
  const [dinnerTime, setDinnerTime] = useState("19:30");
  const [addressId, setAddressId] = useState("");
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

  const subscribe = useMutation({
    mutationFn: async () => {
      if (!menu || !user) throw new Error("Missing data");
      const plan = PLAN_MULTIPLIER[planType];
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + plan.days);
      const totalAmount = menu.price * plan.days;

      const { error } = await supabase.from("subscriptions").insert({
        user_id: user.id,
        vendor_id: menu.vendor_id,
        menu_id: menu.id,
        meal_type: menu.meal_type,
        plan_type: planType,
        amount: totalAmount,
        start_date: startDate.toISOString().split("T")[0],
        end_date: endDate.toISOString().split("T")[0],
        lunch_time: menu.meal_type !== "dinner" ? lunchTime : null,
        dinner_time: menu.meal_type !== "lunch" ? dinnerTime : null,
        delivery_address_id: addressId || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast.success("Subscribed successfully! 🎉");
      onOpenChange(false);
    },
    onError: () => toast.error("Failed to subscribe"),
  });

  if (!menu) return null;

  const plan = PLAN_MULTIPLIER[planType];
  const totalAmount = menu.price * plan.days;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" /> Subscribe to Meal Plan
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="glass-card rounded-xl p-4">
            <h4 className="font-heading font-semibold text-foreground">{menu.name}</h4>
            <p className="text-xs text-muted-foreground">{(menu.vendors as any)?.business_name}</p>
            <p className="text-sm text-muted-foreground mt-1">₹{Number(menu.price).toLocaleString()} / meal</p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Plan Duration</Label>
            <Select value={planType} onValueChange={setPlanType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(PLAN_MULTIPLIER).map(([key, val]) => (
                  <SelectItem key={key} value={key}>{val.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {menu.meal_type !== "dinner" && (
            <div className="space-y-1.5">
              <Label className="text-xs">Lunch Time</Label>
              <Input type="time" value={lunchTime} onChange={(e) => setLunchTime(e.target.value)} />
            </div>
          )}

          {menu.meal_type !== "lunch" && (
            <div className="space-y-1.5">
              <Label className="text-xs">Dinner Time</Label>
              <Input type="time" value={dinnerTime} onChange={(e) => setDinnerTime(e.target.value)} />
            </div>
          )}

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

          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground">Total for {plan.days} days</p>
            <p className="font-heading font-bold text-2xl text-primary">₹{totalAmount.toLocaleString()}</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => subscribe.mutate()} disabled={subscribe.isPending}>
            {subscribe.isPending ? "Subscribing..." : "Subscribe"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
