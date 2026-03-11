import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, startOfWeek, addDays, parseISO } from "date-fns";
import { Calendar, ChevronLeft, ChevronRight, Plus, Search, Trash2, Save, Sparkles, Check, Utensils, Moon, Sun, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function WeeklyPlanner() {
    const queryClient = useQueryClient();
    const [weekStart, setWeekStart] = useState(() => startOfWeek(addDays(new Date(), 7), { weekStartsOn: 1 }));
    const formattedWeekStart = format(weekStart, "yyyy-MM-dd");

    const [isMenuPickerOpen, setIsMenuPickerOpen] = useState(false);
    const [pickerTarget, setPickerTarget] = useState<{ day: string; type: 'lunch' | 'dinner' } | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const { data: plan, isLoading: isPlanLoading } = useQuery({
        queryKey: ["weekly-plan", formattedWeekStart],
        queryFn: () => api.get<any>(`/planner/${formattedWeekStart}`),
    });

    const { data: menus = [] } = useQuery({
        queryKey: ["menus", "all"],
        queryFn: () => api.get<any[]>("/menus"),
    });

    const [selections, setSelections] = useState<any[]>([]);

    useEffect(() => {
        if (plan?.selections) {
            setSelections(plan.selections);
        } else {
            setSelections(DAYS.map(day => ({ day, lunch: null, dinner: null })));
        }
    }, [plan]);

    const savePlan = useMutation({
        mutationFn: (data: any) => api.post("/planner", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["weekly-plan"] });
            toast.success("Planned! Your meals have been saved.");
        },
        onError: () => toast.error("Failed to save. Please check your internet."),
    });

    const handleSelectMenu = (menu: any) => {
        if (!pickerTarget) return;

        const newSelections = selections.map(s => {
            if (s.day === pickerTarget.day) {
                return {
                    ...s,
                    [pickerTarget.type]: {
                        vendorId: menu.vendor_id,
                        menuId: menu.id,
                        mealName: menu.name,
                        price: menu.price
                    }
                };
            }
            return s;
        });

        setSelections(newSelections);
        setIsMenuPickerOpen(false);
        setPickerTarget(null);
    };

    const handleRemoveMeal = (day: string, type: 'lunch' | 'dinner') => {
        setSelections(selections.map(s => {
            if (s.day === day) return { ...s, [type]: null };
            return s;
        }));
    };

    const filteredMenus = menus.filter((m: any) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.vendors?.business_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getSelection = (day: string) => selections.find(s => s.day === day);

    if (isPlanLoading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="h-24 bg-card rounded-3xl" />
                <div className="grid grid-cols-7 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7].map(i => <div key={i} className="h-64 bg-card rounded-[2rem]" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            <div className="bg-card/50 backdrop-blur-2xl rounded-[2rem] p-6 lg:p-8 border border-border/50 shadow-2xl relative overflow-hidden transition-all duration-700">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32" />

                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-12 px-2">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3 tracking-tight">
                            Planner Control
                        </h2>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-2">
                            <Sparkles className="h-3 w-3 text-primary animate-pulse" /> Confirm your weekly meal choices
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 bg-muted/20 p-2 rounded-2xl border border-border/40 backdrop-blur-sm shadow-inner group">
                        <div className="flex items-center gap-2 p-1 bg-background/50 rounded-xl border border-border/40 shadow-sm transition-all group-hover:border-primary/20">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-lg hover:bg-primary hover:text-white transition-all shadow-none"
                                onClick={() => setWeekStart(addDays(weekStart, -7))}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-[10px] font-bold uppercase tracking-widest px-4 min-w-[200px] text-center flex items-center gap-2 justify-center text-foreground">
                                <Calendar className="h-3.5 w-3.5 text-primary" />
                                {format(weekStart, "MMM dd")} — {format(addDays(weekStart, 6), "MMM dd")}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-lg hover:bg-primary hover:text-white transition-all shadow-none"
                                onClick={() => setWeekStart(addDays(weekStart, 7))}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>

                        <Button
                            onClick={() => savePlan.mutate({ weekStartDate: formattedWeekStart, selections })}
                            className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:scale-105 active:scale-95 font-bold uppercase tracking-widest text-[10px] h-12 px-8 rounded-xl shadow-xl transition-all flex items-center gap-2 border-none group/save"
                            disabled={savePlan.isPending}
                        >
                            {savePlan.isPending ? "Saving..." : (
                                <>
                                    <Save className="h-3.5 w-3.5 group-hover/save:scale-125 transition-transform" />
                                    Save Plan
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6">
                    {DAYS.map((day, dayIdx) => {
                        const sel = getSelection(day);
                        const dayDate = addDays(weekStart, dayIdx);

                        return (
                            <motion.div
                                key={day}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: dayIdx * 0.05 }}
                                className="flex flex-col gap-6 group/day"
                            >
                                <div className="bg-muted/10 rounded-2xl p-4 text-center border-2 border-border/40 transition-all duration-500 group-hover/day:border-primary/20 group-hover/day:bg-background shadow-inner">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 block mb-1 group-hover/day:text-primary transition-colors">{day.slice(0, 3)}</span>
                                    <span className="text-2xl font-bold text-foreground tracking-tight">{format(dayDate, "dd")}</span>
                                </div>

                                <div className="space-y-6">
                                    {/* Slot Interface */}
                                    {[
                                        { type: 'lunch', label: 'Lunch', icon: Sun, color: 'primary', bg: 'bg-primary/5', border: 'border-primary/20', hover: 'hover:border-primary', accent: 'text-primary' },
                                        { type: 'dinner', label: 'Dinner', icon: Moon, color: 'accent', bg: 'bg-accent/5', border: 'border-accent/20', hover: 'hover:border-accent', accent: 'text-accent' }
                                    ].map((slot) => {
                                        const meal = (sel as any)?.[slot.type];
                                        const Icon = slot.icon;

                                        return (
                                            <div key={slot.type} className="space-y-3">
                                                <div className="flex items-center justify-between px-3">
                                                    <div className="flex items-center gap-2">
                                                        <Icon className={`h-3 w-3 ${slot.accent}`} />
                                                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{slot.label}</label>
                                                    </div>
                                                </div>

                                                {meal ? (
                                                    <motion.div
                                                        layoutId={`${day}-${slot.type}`}
                                                        className={`group relative ${slot.bg} rounded-2xl p-4 border-2 ${slot.border} shadow-xl hover:shadow-2xl transition-all duration-500 h-[150px] flex flex-col justify-between overflow-hidden cursor-default`}
                                                    >
                                                        <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 dark:bg-white/5 rounded-full blur-2xl -mr-8 -mt-8" />
                                                        <div className="relative z-10">
                                                            <div className="flex justify-between items-start mb-3">
                                                                <Badge variant="outline" className={`text-[8px] font-bold uppercase tracking-widest ${slot.border} ${slot.accent} bg-white/50 dark:bg-black/20`}>
                                                                    Selected
                                                                </Badge>
                                                                <button
                                                                    className="w-8 h-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg border border-destructive/20"
                                                                    onClick={() => handleRemoveMeal(day, slot.type as any)}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                            <h4 className="text-[13px] font-bold text-foreground line-clamp-2 leading-tight tracking-tight mb-2 group-hover:text-primary transition-colors">
                                                                {meal.mealName}
                                                            </h4>
                                                            <div className="flex items-center gap-1.5 opacity-60">
                                                                <Utensils className="h-3 w-3" />
                                                                <span className="text-[9px] font-bold uppercase tracking-widest truncate">Healthy Meal</span>
                                                            </div>
                                                        </div>

                                                        <div className="pt-3 border-t border-white/10 flex items-center justify-between relative z-10">
                                                            <span className="text-sm font-bold text-foreground">₹{meal.price}</span>
                                                            <div className="h-6 w-6 rounded-lg bg-green-500/20 flex items-center justify-center border border-green-500/20">
                                                                <Check className="h-3.5 w-3.5 text-green-500" />
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        className={`w-full h-[170px] rounded-3xl border-2 border-dashed border-border/30 hover:${slot.border} transition-all flex flex-col items-center justify-center gap-4 group p-6 overflow-hidden relative shadow-none hover:bg-muted/5`}
                                                        onClick={() => {
                                                            setPickerTarget({ day, type: slot.type as any });
                                                            setIsMenuPickerOpen(true);
                                                        }}
                                                    >
                                                        <div className={`w-14 h-14 rounded-full bg-muted/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 group-hover:shadow-[0_0_20px_rgba(var(--primary),0.2)]`}>
                                                            <Plus className="h-6 w-6 text-muted-foreground group-hover:text-foreground" />
                                                        </div>
                                                        <div className="text-center">
                                                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block group-hover:text-foreground transition-colors">Add Meal</span>
                                                            <span className="text-[8px] font-medium text-muted-foreground/50">Empty Slot</span>
                                                        </div>
                                                    </Button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="mt-20 p-10 bg-zinc-900 dark:bg-muted/20 rounded-[3rem] border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48 group-hover:scale-110 transition-transform duration-1000" />
                    <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                        <div className="flex items-center gap-8">
                            <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center shadow-2xl border border-white/10">
                                <Sparkles className="h-10 w-10 text-primary animate-pulse" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-white tracking-tight">Daily Updates</h4>
                                <p className="text-sm text-zinc-400 font-medium max-w-md mt-1">We notify our kitchens of your choices to ensure your food is prepared fresh.</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="w-12 h-12 rounded-full bg-zinc-800 border-2 border-zinc-900 shadow-2xl relative transition-transform hover:z-10 hover:scale-110" />
                                ))}
                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white border-2 border-zinc-900 shadow-2xl hover:scale-110 transition-transform cursor-pointer">+81k</div>
                            </div>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Users planning their week</p>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={isMenuPickerOpen} onOpenChange={setIsMenuPickerOpen}>
                <DialogContent className="sm:max-w-[800px] p-0 rounded-[3rem] overflow-hidden border-none gap-0 bg-card/95 backdrop-blur-3xl shadow-2xl">
                    <DialogHeader className="p-10 lg:p-14 bg-muted/30 border-b border-border/50 relative">
                        <div className="absolute top-4 right-4 group">
                            <button
                                onClick={() => setIsMenuPickerOpen(false)}
                                className="w-10 h-10 rounded-full bg-background/50 border border-border/40 flex items-center justify-center hover:bg-destructive hover:text-white transition-all shadow-xl"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div className="space-y-3">
                                <Badge className="bg-primary/10 text-primary border-primary/20 font-bold px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest leading-none">
                                    Choose Your Meal
                                </Badge>
                                <DialogTitle className="text-3xl lg:text-4xl font-bold flex flex-col tracking-tight leading-none">
                                    Choose <span className="text-primary italic">{pickerTarget?.type}</span>
                                    <span className="text-lg opacity-60 mt-1">For {pickerTarget?.day} Meal</span>
                                </DialogTitle>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <Badge variant="outline" className="h-10 px-6 border-primary/20 bg-background/50 text-primary font-bold uppercase tracking-widest text-[11px] rounded-2xl shadow-inner">
                                    {filteredMenus.length} Available Meals
                                </Badge>
                            </div>
                        </div>
                        <div className="mt-12 relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-[50%] h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-all duration-300" />
                            <input
                                placeholder="Search for meals or kitchens..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-16 pr-6 h-18 bg-background border-2 border-transparent focus:border-primary/20 rounded-2xl text-lg shadow-2xl transition-all duration-500 placeholder:text-muted-foreground/30 font-bold"
                            />
                        </div>
                    </DialogHeader>

                    <ScrollArea className="h-[600px]">
                        <div className="p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <AnimatePresence mode="popLayout">
                                {filteredMenus.map((menu: any, idx) => (
                                    <motion.div
                                        key={menu.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="group relative flex flex-col bg-muted/20 border border-border/50 rounded-3xl p-8 hover:bg-card hover:border-primary/40 hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden border-2"
                                        onClick={() => handleSelectMenu(menu)}
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />

                                        <div className="flex justify-between items-start mb-6 relative z-10">
                                            <div className="space-y-1">
                                                <h4 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight leading-tight">{menu.name}</h4>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                                                        {menu.vendors?.business_name}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-foreground tracking-tight">₹{menu.price}</p>
                                                <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/60">Fixed Price</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mt-auto relative z-10">
                                            {menu.items?.slice(0, 4).map((item: string, idx: number) => (
                                                <Badge key={idx} variant="outline" className="text-[9px] font-bold uppercase tracking-widest bg-muted/60 px-3 py-1 rounded-full border border-border/40 text-muted-foreground">
                                                    {item}
                                                </Badge>
                                            ))}
                                            {menu.items?.length > 4 && (
                                                <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full">
                                                    +{menu.items.length - 4} More
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Interaction layer */}
                                        <div className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 duration-500">
                                            <div className="h-12 px-6 rounded-2xl bg-primary text-white font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-xl shadow-primary/20">
                                                Choose This Meal <ChevronRight className="h-3 w-3" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    );
}
