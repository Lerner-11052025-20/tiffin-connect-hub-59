import api from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, MessageSquare, Trash2, ShieldAlert, User, Store } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ReviewModerationPage() {
    const queryClient = useQueryClient();

    const { data: reviewsData, isLoading } = useQuery({
        queryKey: ["admin-reviews"],
        queryFn: () => api.get<any>("/reviews/admin"),
    });

    const reviews = reviewsData?.reviews || [];

    const deleteReview = useMutation({
        mutationFn: (id: string) => api.delete(`/reviews/${id}`),
        onSuccess: () => {
            toast.success("Review removed by moderator");
            queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
        },
        onError: () => toast.error("Failed to delete review"),
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Auditing Content Stream</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <div className="badge-premium w-fit mb-1.5">
                        <span>Trust & Safety</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-none">
                        Content <span className="text-primary">Moderation</span>.
                    </h2>
                    <p className="text-muted-foreground font-medium text-base max-w-2xl">
                        Audit and manage the platform's linguistic reputation and community feedback.
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-card/40 backdrop-blur-md px-5 py-2.5 rounded-xl border border-border/40 shadow-lg">
                    <ShieldAlert className="h-3.5 w-3.5 text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Sentinel Protocol Active</span>
                </div>
            </div>

            {/* Reviews List */}
            <div className="grid gap-6">
                {reviews.length > 0 ? (
                    reviews.map((review: any, idx: number) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="premium-card p-6 group/review overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
                            <div className="relative z-10 flex flex-col lg:flex-row gap-8 lg:items-center">
                                <div className="w-full lg:w-64 shrink-0 space-y-4 pt-1 lg:border-r border-border/20 lg:pr-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-muted/20 border border-border/40 flex items-center justify-center shadow-inner">
                                            <User className="h-4 w-4 text-muted-foreground/60" />
                                        </div>
                                        <div>
                                             <p className="text-[9px] text-muted-foreground/40 font-bold uppercase tracking-widest mb-0.5">Customer</p>
                                             <p className="font-bold text-sm tracking-tight truncate max-w-[140px]">{review.userId?.full_name || "Nexus Entity"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
                                            <Store className="h-4 w-4" />
                                        </div>
                                        <div>
                                             <p className="text-[9px] text-muted-foreground/40 font-bold uppercase tracking-widest mb-0.5">Partner</p>
                                             <p className="font-bold text-sm tracking-tight text-primary truncate max-w-[140px]">{review.vendorId?.business_name || "Independent Hub"}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star key={s} className={`h-2.5 w-2.5 ${s <= review.rating ? 'fill-primary text-primary' : 'text-muted-foreground/10'}`} />
                                                ))}
                                            </div>
                                             <div className="px-3 py-1 rounded-full bg-green-500/5 text-green-600 border border-green-500/10 text-[8px] font-bold tracking-widest uppercase">
                                                 Verified
                                             </div>
                                        </div>
                                         <span className="text-[10px] text-muted-foreground/30 font-bold uppercase tracking-widest">{format(new Date(review.createdAt), "dd MMM, yyyy")}</span>
                                    </div>
                                    <div className="bg-muted/10 rounded-2xl p-6 border border-border/40 relative overflow-hidden group/text">
                                        <div className="absolute top-0 right-0 p-3 opacity-[0.02] group-hover/text:opacity-[0.05] transition-opacity">
                                            <MessageSquare className="w-12 h-12" />
                                        </div>
                                        <p className="text-sm text-foreground/70 leading-relaxed font-medium relative z-10 italic">
                                            "{review.reviewText}"
                                        </p>
                                    </div>
                                </div>

                                <div className="shrink-0">
                                    <button
                                        className="h-11 px-6 bg-red-500/5 text-red-600 border border-red-500/10 rounded-xl flex items-center justify-center gap-2.5 hover:bg-red-500/10 transition-all disabled:opacity-50 group/sanitize"
                                        onClick={() => {
                                            if (confirm("Sanitize this content from the platform stream?")) {
                                                deleteReview.mutate(review.id);
                                            }
                                        }}
                                        disabled={deleteReview.isPending}
                                    >
                                        <Trash2 className="h-3.5 w-3.5 group-hover/sanitize:rotate-12 transition-transform" />
                                         <span className="text-[9px] font-bold uppercase tracking-widest">Sanitize</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="premium-card py-24 text-center flex flex-col items-center border-dashed">
                        <div className="w-20 h-20 rounded-full bg-muted/20 flex items-center justify-center text-4xl mb-6 grayscale opacity-30">🛡️</div>
                        <h3 className="text-2xl font-bold tracking-tight text-foreground">Content Stream Clean</h3>
                        <p className="text-muted-foreground mt-3 font-medium text-sm max-w-sm">No linguistic assets require moderation at this time. The community is maintaining protocol.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
