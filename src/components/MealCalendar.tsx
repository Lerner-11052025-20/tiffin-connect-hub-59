import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, startOfWeek, addDays, isSameDay, isToday, addWeeks, subWeeks } from "date-fns";
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, Clock, CalendarIcon, MoreHorizontal, Info, Edit3, Trash2, Utensils, Play } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface MealCalendarProps {
    subscriptionId: string;
}

export function MealCalendar({ subscriptionId }: MealCalendarProps) {
    const queryClient = useQueryClient();
    const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [view, setView] = useState<"week" | "month">("week");

    const { data: schedule = [], isLoading } = useQuery({
        queryKey: ["subscription-schedule", subscriptionId],
        enabled: !!subscriptionId,
        queryFn: () => api.get<any[]>(`/subscriptions/${subscriptionId}/schedule`),
    });

    const updateOrder = useMutation({
        mutationFn: ({ orderId, status, deliveryTime, notes }: { orderId: string; status?: string; deliveryTime?: string; notes?: string }) =>
            api.put(`/subscriptions/order/${orderId}`, { status, deliveryTime, notes }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subscription-schedule"] });
            toast.success("Meal updated successfully!");
            setEditingOrder(null);
        },
        onError: () => toast.error("Failed to update meal."),
    });

    const [editingOrder, setEditingOrder] = useState<any>(null);
    const [editForm, setEditForm] = useState({ deliveryTime: "", notes: "" });

    const startEditing = (order: any) => {
        setEditingOrder(order);
        setEditForm({
            deliveryTime: order.deliveryTime,
            notes: order.notes || "",
        });
    };

    const days = Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));

    const handleDayClick = (date: Date) => {
        setSelectedDate(date);
        setIsDialogOpen(true);
        setEditingOrder(null);
    };

    const getOrdersForDay = (date: Date) => {
        const formattedDate = format(date, "yyyy-MM-dd");
        return schedule.filter((o) => o.deliveryDate === formattedDate);
    };

    if (isLoading) {
        return <div className="space-y-4 mt-8">
            <div className="h-20 bg-card rounded-[2rem] animate-pulse border border-border/50" />
            <div className="grid grid-cols-7 gap-4">
                {[1, 2, 3, 4, 5, 6, 7].map(i => (
                    <div key={i} className="h-32 bg-card rounded-2xl animate-pulse border border-border/50" />
                ))}
            </div>
        </div>;
    }

    const selectedOrders = selectedDate ? getOrdersForDay(selectedDate) : [];

    return (
        <div className="relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="space-y-1">
                    <h3 className="font-heading font-black text-2xl text-foreground tracking-tight flex items-center gap-3">
                        <CalendarIcon className="h-6 w-6 text-primary" /> Delivery Schedule
                    </h3>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">Manage transitions & skip meals</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 bg-muted/30 p-2 rounded-[1.5rem] border border-border/40 backdrop-blur-sm">
                    <div className="flex p-1 bg-background/50 rounded-xl border border-border/40 shadow-sm">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`h-9 px-5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${view === "week" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-primary"}`}
                            onClick={() => setView("week")}
                        >
                            Week
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`h-9 px-5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${view === "month" ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-primary"}`}
                            onClick={() => setView("month")}
                        >
                            Month
                        </Button>
                    </div>

                    <div className="flex items-center gap-1.5 p-1">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                                if (view === "week") setCurrentWeekStart(subWeeks(currentWeekStart, 1));
                                else setCurrentWeekStart(new Date(currentWeekStart.getFullYear(), currentWeekStart.getMonth() - 1, 1));
                            }}
                            className="h-9 w-9 rounded-xl border-border/40 bg-background/80 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="px-4 min-w-[140px] text-center">
                            <span className="text-[11px] font-black uppercase tracking-widest text-foreground">
                                {view === "week"
                                    ? `${format(currentWeekStart, "MMM d")} - ${format(addDays(currentWeekStart, 6), "MMM d")}`
                                    : format(currentWeekStart, "MMMM yyyy")
                                }
                            </span>
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                                if (view === "week") setCurrentWeekStart(addWeeks(currentWeekStart, 1));
                                else setCurrentWeekStart(new Date(currentWeekStart.getFullYear(), currentWeekStart.getMonth() + 1, 1));
                            }}
                            className="h-9 w-9 rounded-xl border-border/40 bg-background/80 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={view + currentWeekStart.toISOString()}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    {view === "week" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                            {days.map((day) => {
                                const orders = getOrdersForDay(day);
                                const is_Today = isToday(day);

                                return (
                                    <div
                                        key={day.toISOString()}
                                        onClick={() => handleDayClick(day)}
                                        className={`group relative flex flex-col p-5 rounded-[2rem] border transition-all duration-500 cursor-pointer overflow-hidden min-h-[160px] ${is_Today ? "bg-primary/5 border-primary shadow-xl shadow-primary/5 ring-1 ring-primary/20" : "bg-card/50 border-border/50 hover:bg-card hover:border-primary/30 hover:shadow-2xl hover:-translate-y-1"
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-5 relative z-10">
                                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${is_Today ? "text-primary" : "text-muted-foreground"}`}>
                                                {format(day, "EEE")}
                                            </span>
                                            <span className={`text-2xl font-black font-heading tracking-tighter ${is_Today ? "text-primary" : "text-foreground group-hover:text-primary"} transition-colors`}>
                                                {format(day, "d")}
                                            </span>
                                        </div>

                                        <div className="flex-1 flex flex-col gap-2 relative z-10">
                                            {orders.length === 0 ? (
                                                <div className="mt-auto opacity-20 group-hover:opacity-40 transition-opacity">
                                                    <span className="text-[10px] font-black uppercase tracking-widest block text-center">Rest Day</span>
                                                </div>
                                            ) : (
                                                orders.map((order, idx) => {
                                                    const isLunch = parseInt(order.deliveryTime.split(":")[0]) < 16;
                                                    const isCancelled = order.orderStatus === 'cancelled';
                                                    const isDelivered = order.orderStatus === 'delivered';

                                                    return (
                                                        <div
                                                            key={idx}
                                                            className={`text-[9px] font-black uppercase tracking-widest px-3 py-2 flex justify-between items-center rounded-xl border transition-all duration-300 shadow-sm ${isCancelled ? "bg-destructive/5 text-destructive border-destructive/20 opacity-60" :
                                                                    isDelivered ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/20" :
                                                                        "bg-primary/5 text-primary border-primary/20 group-hover:bg-primary group-hover:text-white"
                                                                }`}
                                                        >
                                                            <span>{isLunch ? "Lunch" : "Dinner"}</span>
                                                            {isCancelled ? <XCircle className="h-3 w-3" /> : isDelivered ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                                        </div>
                                                    )
                                                })
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-card/30 backdrop-blur-sm rounded-[2.5rem] p-6 border border-border/40 shadow-inner">
                            <div className="grid grid-cols-7 gap-3 mb-4">
                                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                                    <div key={d} className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 py-2">{d}</div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-3">
                                {(() => {
                                    const date = new Date(currentWeekStart.getFullYear(), currentWeekStart.getMonth(), 1);
                                    const startDay = (date.getDay() + 6) % 7;
                                    const daysInMonth = new Date(currentWeekStart.getFullYear(), currentWeekStart.getMonth() + 1, 0).getDate();

                                    const cells = [];
                                    for (let i = 0; i < startDay; i++) cells.push(<div key={`empty-${i}`} className="h-20 lg:h-28 opacity-20" />);
                                    for (let i = 1; i <= daysInMonth; i++) {
                                        const dayDate = new Date(currentWeekStart.getFullYear(), currentWeekStart.getMonth(), i);
                                        const orders = getOrdersForDay(dayDate);
                                        const is_Today = isToday(dayDate);

                                        cells.push(
                                            <div
                                                key={i}
                                                onClick={() => handleDayClick(dayDate)}
                                                className={`h-20 lg:h-28 rounded-2xl border p-3 cursor-pointer transition-all duration-500 flex flex-col items-center justify-center relative overflow-hidden group ${is_Today ? "border-primary bg-primary/5 shadow-xl shadow-primary/5 ring-1 ring-primary/20" : "border-border/40 hover:border-primary/40 hover:bg-card bg-background/50"
                                                    }`}
                                            >
                                                <span className={`text-sm font-black ${is_Today ? "text-primary" : "text-foreground group-hover:text-primary"} transition-colors`}>{i}</span>
                                                <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                                                    {orders.map((o, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={`w-2 h-2 rounded-full shadow-sm transition-transform group-hover:scale-125 ${o.orderStatus === 'cancelled' ? 'bg-destructive/60' :
                                                                    o.orderStatus === 'delivered' ? 'bg-emerald-500/60' : 'bg-primary'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                {orders.length > 0 && <div className="absolute top-1 right-2 w-1.5 h-1.5 bg-primary/20 rounded-full animate-pulse" />}
                                            </div>
                                        );
                                    }
                                    return cells;
                                })()}
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            <Dialog open={isDialogOpen} onOpenChange={(val) => {
                setIsDialogOpen(val);
                if (!val) setEditingOrder(null);
            }}>
                <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-2xl border-border/40 rounded-[2.5rem] shadow-2xl p-0 overflow-hidden">
                    <DialogHeader className="p-8 pb-0">
                        <DialogTitle className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                                <CalendarIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground leading-none mb-1">Schedule Manager</p>
                                <h4 className="text-xl font-black tracking-tight leading-none">{selectedDate ? format(selectedDate, "EEEE, MMMM do") : "Order Details"}</h4>
                            </div>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="p-8 pt-6 space-y-6">
                        {selectedOrders.length === 0 ? (
                            <div className="p-10 text-center bg-muted/20 rounded-[2rem] border border-dashed border-border/60 py-16">
                                <div className="w-16 h-16 bg-muted/40 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Utensils className="h-8 w-8 text-muted-foreground/30" />
                                </div>
                                <h5 className="font-heading font-black text-xl text-foreground tracking-tight">Kitchen Closed</h5>
                                <p className="text-sm font-medium text-muted-foreground mt-2">No meals scheduled for this day.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {selectedOrders.map((order) => {
                                    const isLunch = parseInt(order.deliveryTime.split(":")[0]) < 16;
                                    const isSkipped = order.orderStatus === 'cancelled';
                                    const isEditingThis = editingOrder?.id === order.id;

                                    return (
                                        <div key={order.id} className={`group/card p-6 rounded-[2rem] border relative overflow-hidden transition-all duration-500 shadow-sm ${isSkipped ? "bg-muted/30 border-dashed border-border/60" : "bg-card border-border/40 hover:border-primary/30"}`}>
                                            <div className="flex justify-between items-start mb-4 relative z-10">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Badge className={`text-[9px] uppercase tracking-widest font-black px-3 py-1 rounded-full shadow-sm border ${isLunch ? "bg-amber-500 text-white border-amber-600" : "bg-indigo-500 text-white border-indigo-600"}`}>
                                                            {isLunch ? "Lunch Service" : "Dinner Service"}
                                                        </Badge>
                                                        {isSkipped && <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-destructive/30 text-destructive bg-destructive/5 rounded-full">Skipped</Badge>}
                                                    </div>
                                                    <h4 className={`font-heading font-black text-2xl tracking-tighter ${isSkipped ? "text-muted-foreground line-through opacity-50" : "text-foreground group-hover/card:text-primary"} transition-colors`}>
                                                        {order.mealName}
                                                    </h4>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mt-1 flex items-center gap-1.5">
                                                        <Info className="h-3 w-3" /> {(order.vendors as any)?.business_name}
                                                    </p>
                                                </div>

                                                <div className="flex flex-col items-end gap-2">
                                                    {isSkipped ? (
                                                        <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center order-border border-destructive/20 shadow-inner">
                                                            <XCircle className="h-5 w-5 text-destructive" />
                                                        </div>
                                                    ) : order.orderStatus === 'delivered' ? (
                                                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-inner">
                                                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                                                            <Clock className="h-5 w-5 text-primary" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {!isEditingThis ? (
                                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10">
                                                    <div className="flex flex-wrap items-center gap-3 mb-6">
                                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-[1rem] border border-border/40 shadow-inner">
                                                            <Clock className="h-3.5 w-3.5 text-primary" /> {order.deliveryTime}
                                                        </div>
                                                        {order.notes && (
                                                            <div className="text-[10px] font-medium text-muted-foreground/60 italic bg-muted/20 px-3 py-1.5 rounded-[1rem] border border-border/20 max-w-[180px] truncate">
                                                                "{order.notes}"
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex gap-2">
                                                        {isSkipped ? (
                                                            <Button
                                                                onClick={() => updateOrder.mutate({ orderId: order.id, status: "pending" })}
                                                                className="w-full h-11 rounded-xl bg-primary text-white font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all shadow-lg shadow-primary/20"
                                                            >
                                                                <Play className="h-3.5 w-3.5 mr-2" /> Resume This Meal
                                                            </Button>
                                                        ) : order.orderStatus === 'delivered' ? (
                                                            <div className="w-full p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/20 text-center">
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Successfully Delivered</span>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <Button
                                                                    onClick={() => startEditing(order)}
                                                                    variant="outline"
                                                                    className="flex-1 h-11 rounded-xl border-border/60 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-zinc-900 transition-all gap-2"
                                                                >
                                                                    <Edit3 className="h-3.5 w-3.5" /> Modify
                                                                </Button>
                                                                <Button
                                                                    onClick={() => updateOrder.mutate({ orderId: order.id, status: "cancelled" })}
                                                                    variant="outline"
                                                                    className="flex-1 h-11 rounded-xl border-destructive/30 text-destructive text-[10px] font-black uppercase tracking-widest hover:bg-destructive hover:text-white transition-all gap-2"
                                                                >
                                                                    <Trash2 className="h-3.5 w-3.5" /> Skip
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4 relative z-10 p-5 bg-background/50 rounded-2xl border border-primary/20 shadow-inner mt-2">
                                                    <div className="grid grid-cols-1 gap-5">
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Delivery Time</label>
                                                            <input
                                                                type="time"
                                                                value={editForm.deliveryTime}
                                                                onChange={(e) => setEditForm({ ...editForm, deliveryTime: e.target.value })}
                                                                className="w-full h-12 rounded-xl bg-background border-2 border-border/40 px-4 text-sm font-black focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Special Instructions</label>
                                                            <textarea
                                                                value={editForm.notes}
                                                                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                                                                placeholder="e.g. Please leave at the security desk"
                                                                className="w-full rounded-xl bg-background border-2 border-border/40 px-4 py-3 text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                                                rows={3}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-3 pt-2">
                                                        <Button
                                                            onClick={() => updateOrder.mutate({
                                                                orderId: order.id,
                                                                deliveryTime: editForm.deliveryTime,
                                                                notes: editForm.notes
                                                            })}
                                                            className="flex-1 h-12 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-black uppercase tracking-widest text-[10px] shadow-xl transition-all"
                                                            disabled={updateOrder.isPending}
                                                        >
                                                            {updateOrder.isPending ? "Updating..." : "Confirm Changes"}
                                                        </Button>
                                                        <Button
                                                            onClick={() => setEditingOrder(null)}
                                                            variant="outline"
                                                            className="h-12 w-12 rounded-xl border-border/60 hover:bg-muted"
                                                        >
                                                            <XCircle className="h-5 w-5" />
                                                        </Button>
                                                    </div>
                                                </motion.div>
                                            )}

                                            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-primary/2 dark:bg-primary/5 rounded-full blur-[40px] pointer-events-none" />
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    <DialogFooter className="p-8 pt-0 border-t border-border/20 bg-muted/10 space-y-4 sm:space-y-0">
                        <div className="flex items-start gap-3 w-full py-4">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Info className="h-4 w-4 text-primary" />
                            </div>
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest leading-relaxed text-left">
                                Important: Modifications must be finalized <span className="text-primary">12 hours prior</span> to the scheduled delivery window.
                            </p>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
