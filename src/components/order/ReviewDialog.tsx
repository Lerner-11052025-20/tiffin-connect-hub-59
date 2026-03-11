import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageSquareQuote, Check } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

interface ReviewDialogProps {
    order: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ReviewDialog({ order, open, onOpenChange }: ReviewDialogProps) {
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState("");
    const queryClient = useQueryClient();

    const submitReview = useMutation({
        mutationFn: (data: { orderId: string; rating: number; reviewText: string }) =>
            api.post("/reviews", data),
        onSuccess: () => {
            toast.success("Reception logged. Your data helps optimize our culinary nodes.");
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            onOpenChange(false);
            setReviewText("");
            setRating(5);
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Transmission error. Logic failure.");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reviewText.trim()) {
            toast.error("Telemetry required. Please provide qualitative data.");
            return;
        }
        submitReview.mutate({
            orderId: order.id,
            rating,
            reviewText,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl bg-card/95 backdrop-blur-3xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[60px] -mr-16 -mt-16 pointer-events-none" />

                <DialogHeader className="p-10 pb-0 bg-muted/30 relative overflow-hidden">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                            <Star className="h-6 w-6 text-primary animate-pulse" />
                        </div>
                        <div>
                            <DialogTitle className="font-heading font-black text-3xl text-foreground tracking-tighter">Culinary Feedback</DialogTitle>
                            <DialogDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">Quality Control Protocol</DialogDescription>
                        </div>
                    </div>
                    <p className="text-muted-foreground font-medium text-base leading-relaxed pb-8 border-b border-border/40">
                        Synthesize your experience for the <span className="text-foreground font-black">{order?.mealName}</span> service by <span className="text-primary font-black italic">{order?.vendors?.business_name}</span>.
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-10 space-y-8 relative z-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 text-center block">Rating Assignment</label>
                        <div className="flex justify-center gap-4">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <motion.button
                                    key={s}
                                    type="button"
                                    whileHover={{ scale: 1.2, rotate: 10 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setRating(s)}
                                    className="relative group focus:outline-none"
                                >
                                    <Star
                                        className={`h-12 w-12 transition-all duration-300 ${s <= rating ? "fill-primary text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.5)]" : "text-muted-foreground/20"
                                            }`}
                                    />
                                    {s <= rating && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute inset-0 bg-primary/5 rounded-full blur-xl -z-10"
                                        />
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 flex items-center gap-2">
                                <MessageSquareQuote className="h-3 w-3 text-primary" /> Qualitative Data
                            </label>
                            <span className="text-[9px] font-black text-primary/40 uppercase tracking-widest">{reviewText.length} Chars</span>
                        </div>
                        <Textarea
                            placeholder="Identify key success factors or operational failures..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            className="resize-none h-40 rounded-[2rem] bg-muted/20 border-2 border-border/40 focus:border-primary/50 transition-all p-6 font-medium text-lg shadow-inner placeholder:text-muted-foreground/20"
                        />
                    </div>

                    <DialogFooter className="sm:justify-end pt-4">
                        <Button
                            type="submit"
                            disabled={submitReview.isPending}
                            className="rounded-[1.5rem] h-16 px-10 font-black uppercase tracking-[0.2em] text-[10px] gap-3 shadow-2xl shadow-primary/20 w-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:scale-[1.02] active:scale-95 transition-all group/btn border-none"
                        >
                            {submitReview.isPending ? "Transmitting..." : (
                                <>
                                    Log Transmission <Check className="h-4 w-4 group-hover/btn:scale-125 transition-transform" />
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
