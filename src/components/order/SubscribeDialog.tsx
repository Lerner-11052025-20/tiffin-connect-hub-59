import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { stripePromise } from "@/lib/stripe";
import api from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarDays, MapPin, Plus, Lock, CreditCard, Clock, ArrowRight } from "lucide-react";

interface Menu {
  id: string;
  name: string;
  price: number;
  meal_type: string;
  items: any[];
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
  const navigate = useNavigate();

  const [planType, setPlanType] = useState<keyof typeof PLAN_MULTIPLIER>("weekly");
  const [lunchTime, setLunchTime] = useState("12:30");
  const [dinnerTime, setDinnerTime] = useState("19:30");
  const [addressId, setAddressId] = useState("");
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ address_line: "", city: "", state: "", pincode: "" });
  const [isPaying, setIsPaying] = useState(false);

  const [step, setStep] = useState<"details" | "summary">("details");

  useEffect(() => {
    if (menu) {
      setStep("details");
    }
  }, [menu, open]);

  const { data: addresses } = useQuery({
    queryKey: ["addresses", user?.id],
    enabled: !!user && open,
    queryFn: () => api.get<any[]>("/addresses"),
  });

  useEffect(() => {
    if (addresses?.length && !addressId) {
      setAddressId(addresses[0].id);
    }
  }, [addresses, addressId]);

  async function handleAddAddress() {
    try {
      const data = await api.post<any>("/addresses", newAddress);
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setAddressId(data.id);
      setShowNewAddress(false);
      setNewAddress({ address_line: "", city: "", state: "", pincode: "" });
      toast.success("Address added!");
    } catch {
      toast.error("Failed to add address");
    }
  }

  const selectedAddress = addresses?.find((a) => a.id === addressId);

  async function handlePayNow() {
    if (!menu || !user || !selectedAddress) return;

    const plan = PLAN_MULTIPLIER[planType];
    const mealsPerDay = menu.meal_type === "both" ? 2 : 1;
    const totalAmount = menu.price * plan.days * mealsPerDay;
    const fullAddressString = `${selectedAddress.address_line}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`;

    const startDate = new Date();

    setIsPaying(true);
    try {
      // Step 1 — Create Stripe checkout session on backend
      const { sessionUrl, sessionId } = await api.post<{ sessionUrl: string; sessionId: string }>("/payments/create-checkout-session", {
        type: "subscription",
        userId: user.id,
        vendorId: menu.vendor_id,
        vendorName: menu.vendors?.business_name || 'Home Chef',
        mealId: menu.id,
        planName: `${planType.toUpperCase()} Plan - ${menu.name}`,
        amount: totalAmount,
        currency: "inr",
        deliveryDate: startDate.toISOString().split("T")[0],
        deliveryAddress: fullAddressString,
        notes: "Subscription",
        plan_type: planType,
        meal_type: menu.meal_type,
        lunch_time: menu.meal_type !== "dinner" ? lunchTime : null,
        dinner_time: menu.meal_type !== "lunch" ? dinnerTime : null,
        delivery_address_id: addressId || null,
      });

      // Step 2 — Use Stripe SDK to redirect
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Unable to connect to payment gateway. Please try again.");
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        throw error;
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      toast.error(err.message || "Unable to connect to payment gateway. Please try again.");
      setIsPaying(false);
    }
  }

  if (!menu) return null;

  const plan = PLAN_MULTIPLIER[planType];
  const mealsPerDay = menu.meal_type === "both" ? 2 : 1;
  const totalAmount = menu.price * plan.days * mealsPerDay;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex -space-x-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${step === 'details' ? 'bg-primary text-white' : 'bg-primary/20 text-primary'}`}>1</div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${step === 'summary' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>2</div>
            </div>
            {step === 'details' ? 'Plan Details' : 'Subscription Summary'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {step === "details" ? (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-muted/30 border border-border/50 rounded-2xl p-5 group hover:bg-muted/40 transition-colors">
                <h4 className="font-heading font-black text-foreground text-lg">{menu.name}</h4>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{menu.vendors?.business_name}</p>
                <p className="font-heading font-black text-xl text-primary mt-3">₹{Number(menu.price).toLocaleString()} <span className="text-[10px] font-bold text-muted-foreground uppercase">/ meal</span></p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Subscription Duration</Label>
                <Select value={planType} onValueChange={(v) => setPlanType(v as keyof typeof PLAN_MULTIPLIER)}>
                  <SelectTrigger className="h-11 rounded-xl font-bold"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {Object.entries(PLAN_MULTIPLIER).map(([key, val]) => (
                      <SelectItem key={key} value={key}>{val.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {menu.meal_type !== "dinner" && (
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 flex items-center gap-1.5"><Clock className="h-3 w-3" /> Lunch Slot</Label>
                    <Input type="time" value={lunchTime} onChange={(e) => setLunchTime(e.target.value)} className="rounded-xl border-border/60 focus:border-primary/50 transition-all font-bold" />
                  </div>
                )}

                {menu.meal_type !== "lunch" && (
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 flex items-center gap-1.5"><Clock className="h-3 w-3" /> Dinner Slot</Label>
                    <Input type="time" value={dinnerTime} onChange={(e) => setDinnerTime(e.target.value)} className="rounded-xl border-border/60 focus:border-primary/50 transition-all font-bold" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-primary" /> Delivery Destination
                </Label>
                {addresses && addresses.length > 0 ? (
                  <Select value={addressId} onValueChange={setAddressId}>
                    <SelectTrigger className="h-11 rounded-xl font-bold"><SelectValue placeholder="Select address" /></SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {addresses.map((a) => (
                        <SelectItem key={a.id} value={a.id}>{a.label} – {a.address_line}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : !showNewAddress ? (
                  <Button variant="outline" className="w-full rounded-xl border-dashed border-primary/20 hover:border-primary/50 hover:bg-primary/5" onClick={() => setShowNewAddress(true)}>
                    <Plus className="h-4 w-4 mr-2" /> Add Delivery Address
                  </Button>
                ) : null}

                {showNewAddress && (
                  <div className="space-y-2 p-4 bg-muted/20 border border-primary/10 rounded-2xl animate-in zoom-in-95 duration-200">
                    <Input placeholder="House/Flat No, Apartment..." value={newAddress.address_line} onChange={(e) => setNewAddress({ ...newAddress, address_line: e.target.value })} className="rounded-xl h-10 border-border/50" />
                    <div className="grid grid-cols-3 gap-2">
                      <Input placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} className="rounded-xl h-10 border-border/50" />
                      <Input placeholder="State" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} className="rounded-xl h-10 border-border/50" />
                      <Input placeholder="Pincode" value={newAddress.pincode} onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} className="rounded-xl h-10 border-border/50" />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" onClick={handleAddAddress} disabled={!newAddress.address_line} className="rounded-lg font-black h-9 px-4">Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setShowNewAddress(false)} className="rounded-lg font-black h-9 px-4">Cancel</Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/5 rounded-[2.5rem] blur opacity-25"></div>
                <div className="relative bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm">
                  <div className="bg-primary/5 p-4 border-b border-border/30 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">{plan.label} Subscription</span>
                    <CalendarDays className="h-4 w-4 text-primary opacity-40" />
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Meal Selection</p>
                      <h5 className="font-heading font-black text-foreground text-lg">{menu.name}</h5>
                    </div>

                    <div className="pt-4 border-t border-dashed border-border/60 space-y-3">
                      <div className="flex justify-between text-xs font-bold text-muted-foreground">
                        <span>Meals per Day</span>
                        <span className="text-foreground">{mealsPerDay} ({menu.meal_type})</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-muted-foreground">
                        <span>Total Meals</span>
                        <span className="text-foreground">{plan.days * mealsPerDay}</span>
                      </div>
                    </div>

                    <div className="pt-6 border-t-2 border-primary/20 flex justify-between items-center">
                      <span className="text-sm font-black uppercase tracking-widest text-foreground">Total Payable</span>
                      <span className="text-3xl font-heading font-black text-primary">₹{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 border border-border/30 rounded-2xl p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg"><MapPin className="h-4 w-4 text-primary" /></div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Delivering To</p>
                    <p className="text-sm font-black text-foreground line-clamp-1">{selectedAddress?.label || 'Selected Address'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg"><Clock className="h-4 w-4 text-primary" /></div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Preferred Timings</p>
                    <p className="text-sm font-black text-foreground">
                      {menu.meal_type !== 'dinner' && `Lunch: ${lunchTime}`}
                      {menu.meal_type === 'both' && ' · '}
                      {menu.meal_type !== 'lunch' && `Dinner: ${dinnerTime}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-black uppercase tracking-[0.1em] bg-primary/5 rounded-xl px-4 py-3 border border-primary/10">
                <Lock className="h-3 w-3 text-primary" />
                <span>Secure Autopay & Cancellation policy applies</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-3 mt-6">
          {step === "details" ? (
            <>
              <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-black uppercase tracking-widest text-[11px] h-12 order-2 sm:order-1">Cancel</Button>
              <Button
                onClick={() => {
                  if (!addressId) {
                    toast.error("Please select a delivery address");
                    return;
                  }
                  setStep("summary");
                }}
                className="flex-1 rounded-xl font-black uppercase tracking-widest text-[11px] h-12 shadow-lg shadow-primary/20 order-1 sm:order-2"
              >
                Confirm Plan <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setStep("details")} disabled={isPaying} className="rounded-xl font-black uppercase tracking-widest text-[11px] h-12 order-2 sm:order-1">Modify</Button>
              <Button
                onClick={handlePayNow}
                disabled={isPaying}
                className="flex-1 rounded-xl font-black uppercase tracking-widest text-[11px] h-12 shadow-lg shadow-primary/25 order-1 sm:order-2 bg-gradient-to-r from-primary to-primary/90"
              >
                {isPaying ? "Connecting Gateway..." : `Confirm & Pay ₹${totalAmount.toLocaleString()}`}
                {!isPaying && <CreditCard className="h-4 w-4 ml-2" />}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
