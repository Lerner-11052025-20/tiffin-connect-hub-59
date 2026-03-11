import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingBag, Calendar, Clock, MapPin, Receipt, ArrowRight, Printer, Star } from "lucide-react";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function PaymentSuccess() {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [orderData, setOrderData] = useState<any>(null);

    useEffect(() => {
        const sessionId = new URLSearchParams(window.location.search).get("session_id");
        if (sessionId) {
            handleConfirmation(sessionId);
        } else {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (countdown === null) return;
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(prev => prev! - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            navigate("/dashboard/track");
        }
    }, [countdown]);

    async function handleConfirmation(sessionId: string) {
        try {
            const confirmRes = await api.get<{ success: boolean; type: string; id: string }>(`/payments/confirm-session?session_id=${sessionId}`);

            if (confirmRes.success) {
                // Fetch record details
                const resourcePath = confirmRes.type === 'subscription' ? `/subscriptions/${confirmRes.id}` : `/orders/${confirmRes.id}`;
                const detailRes = await api.get(resourcePath) as any;
                setOrderData({ ...detailRes, type: confirmRes.type });

                // Start countdown for redirection
                toast.success(`Payment verified! Redirecting to track order in 3s...`, {
                    duration: 3000,
                });
                setCountdown(3);
            }
        } catch (err) {
            console.error("Confirmation failed:", err);
            toast.error("We couldn't verify your payment details, but the transaction was recorded.");
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
                <div className="w-full max-w-lg space-y-4">
                    <Skeleton className="h-12 w-3/4 mx-auto rounded-xl" />
                    <Skeleton className="h-64 w-full rounded-3xl" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-12 px-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
            <div className="max-w-xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">

                {/* Header Success Section */}
                <div className="text-center space-y-4">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
                        <div className="relative w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(var(--primary-rgb),0.3)]">
                            <CheckCircle2 className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <div>
                        <h1 className="font-heading font-black text-4xl text-foreground tracking-tight">Order Confirmed!</h1>
                        <p className="text-muted-foreground font-medium mt-2">Your delicious meal is now being processed.</p>
                        {countdown !== null && (
                            <div className="mt-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4">
                                <p className="text-primary font-black text-xl flex items-center gap-3 bg-primary/10 px-6 py-3 rounded-2xl border border-primary/20">
                                    Redirecting in <span className="scale-125 inline-block min-w-[1.2ch] text-center">{countdown}</span>...
                                </p>
                                <div className="w-48 h-1 bg-muted mt-4 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-1000 ease-linear"
                                        style={{ width: `${(countdown / 3) * 100}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Receipt Card */}
                {orderData ? (
                    <div className="bg-card border border-border/50 shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden">
                        <div className="bg-primary/5 p-6 border-b border-border/30 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Receipt className="h-4 w-4 text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Order Receipt</span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">#{orderData.id.slice(-8)}</span>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Main Item */}
                            <div className="flex justify-between items-center">
                                <div className="space-y-1">
                                    <h2 className="font-heading font-black text-2xl text-foreground">{orderData.mealName || orderData.plan_type + ' Plan'}</h2>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-xs text-muted-foreground font-bold">From</span>
                                        <span className="text-xs text-primary font-black uppercase tracking-wider">{orderData.vendors?.business_name || 'Home Chef'}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-heading font-black text-foreground">₹{Number(orderData.price || orderData.amount).toLocaleString()}</p>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Paid via Stripe</p>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-6 bg-muted/20 rounded-3xl p-6 border border-border/40">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                        <div className="space-y-0.5">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Delivery Date</p>
                                            <p className="text-sm font-bold text-foreground">{orderData.deliveryDate || orderData.start_date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                        <div className="space-y-0.5">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Time Slot</p>
                                            <p className="text-sm font-bold text-foreground">{orderData.deliveryTime || (orderData.meal_type === 'both' ? 'Lunch & Dinner' : (orderData.lunch_time || '12:30'))}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                        <div className="space-y-0.5">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Deliver to</p>
                                            <p className="text-sm font-bold text-foreground line-clamp-2">{orderData.deliveryAddress || 'Registered Address'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status Stepper (Static Visualization) */}
                            <div className="relative pt-4">
                                <div className="flex justify-between items-center w-full relative z-10">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white"><CheckCircle2 className="h-4 w-4" /></div>
                                        <span className="text-[9px] font-black uppercase tracking-wider">Paid</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 opacity-50">
                                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-black text-[10px]">2</div>
                                        <span className="text-[9px] font-black uppercase tracking-wider">Preparing</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 opacity-30">
                                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-black text-[10px]">3</div>
                                        <span className="text-[9px] font-black uppercase tracking-wider">On Way</span>
                                    </div>
                                </div>
                                <div className="absolute top-[21px] left-0 w-full h-0.5 bg-muted -z-0">
                                    <div className="w-1/4 h-full bg-primary/30"></div>
                                </div>
                            </div>
                        </div>

                        {/* Footer CTA in card */}
                        <div className="bg-muted/10 p-6 flex items-center justify-center gap-2">
                            <Star className="h-3 w-3 text-primary" />
                            <span className="text-[10px] font-bold text-muted-foreground">Order status updates will be sent via notifications</span>
                        </div>
                    </div>
                ) : (
                    <div className="bg-card p-12 rounded-[2.5rem] border border-dashed border-border text-center space-y-4">
                        <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto opacity-20" />
                        <h3 className="font-heading font-black text-xl">Verification Pending</h3>
                        <p className="text-sm text-muted-foreground px-10">We've received your payment but are still populating your order history. You can find it in your dashboard shortly.</p>
                    </div>
                )}

                {/* Primary Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <Button
                        variant="outline"
                        onClick={() => navigate("/dashboard")}
                        className="h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] border-border/60 hover:bg-muted transition-all"
                    >
                        Return to Dashboard
                    </Button>
                    <Button
                        onClick={() => navigate("/dashboard/history")}
                        className="h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-primary/20 group translate-y-0 hover:-translate-y-1 transition-all"
                    >
                        Track My Orders <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>

                <div className="flex justify-center pt-4">
                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 hover:text-primary transition-colors">
                        <Printer className="h-3 w-3" /> Save/Print Confirmation
                    </button>
                </div>
            </div>
        </div>
    );
}
