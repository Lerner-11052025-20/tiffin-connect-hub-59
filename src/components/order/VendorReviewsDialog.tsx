import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Star, MessageSquare, Clock, User, ThumbsUp, Quote } from "lucide-react";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VendorReviewsDialogProps {
    menu: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function VendorReviewsDialog({ menu, open, onOpenChange }: VendorReviewsDialogProps) {
    const [sort, setSort] = useState("recent");

    const { data, isLoading } = useQuery({
        queryKey: ["menu-reviews-public", menu?.id, sort],
        enabled: !!menu && open,
        queryFn: () => api.get<any>(`/reviews/menu/${menu.id}?sort=${sort}`),
    });

    const reviews = data?.reviews || [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] rounded-3xl p-8 overflow-hidden flex flex-col max-h-[85vh]">
                <DialogHeader className="mb-6">
                    <DialogTitle className="font-heading font-black text-3xl tracking-tight text-gradient">
                        {menu?.name}
                    </DialogTitle>
                    <div className="flex items-center gap-4 mt-4 bg-muted/30 p-4 rounded-2xl border border-border/50">
                        <div className="flex flex-col">
                            <span className="text-3xl font-black text-foreground leading-none">{menu?.averageRating || 0}</span>
                            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">Overall Rating</span>
                        </div>
                        <div className="flex flex-col flex-1">
                            <div className="flex items-center gap-0.5 mb-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                        key={s}
                                        className={`h-4 w-4 ${s <= (menu?.averageRating || 0) ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-muted-foreground font-bold italic">Based on {menu?.totalReviews || 0} customer reviews</span>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex items-center justify-between mb-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Latest Feedback</h4>
                    <Select value={sort} onValueChange={setSort}>
                        <SelectTrigger className="w-[140px] h-9 text-[10px] font-bold uppercase tracking-widest border-border/40 rounded-xl bg-muted/20">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border/40">
                            <SelectItem value="recent" className="text-[10px] font-bold uppercase tracking-widest">Recent</SelectItem>
                            <SelectItem value="highest" className="text-[10px] font-bold uppercase tracking-widest">Highest Rated</SelectItem>
                            <SelectItem value="lowest" className="text-[10px] font-bold uppercase tracking-widest">Lowest Rated</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-32 rounded-2xl bg-muted/20 animate-pulse" />
                            ))}
                        </div>
                    ) : reviews.length > 0 ? (
                        reviews.map((review: any) => (
                            <div key={review.id} className="p-6 rounded-2xl bg-muted/10 border border-border/30 hover:border-primary/20 transition-all duration-300">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-background border border-border/50 flex items-center justify-center shadow-inner">
                                            <User className="h-5 w-5 text-muted-foreground/40" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground leading-none mb-1">{review.userName}</p>
                                            <div className="flex items-center gap-0.5">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star
                                                        key={s}
                                                        className={`h-2.5 w-2.5 ${s <= review.rating ? 'fill-primary text-primary' : 'text-muted-foreground/20'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                                        {format(new Date(review.createdAt), "MMM d, yyyy")}
                                    </span>
                                </div>
                                <div className="relative">
                                    <Quote className="h-4 w-4 text-primary/10 absolute -top-1 -left-1" />
                                    <p className="text-xs text-muted-foreground leading-relaxed pl-4 line-clamp-3 italic">
                                        "{review.reviewText}"
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center bg-muted/5 rounded-3xl border border-dashed border-border/40">
                            <MessageSquare className="h-10 w-10 text-muted-foreground/10 mx-auto mb-4" />
                            <p className="text-xs font-bold text-muted-foreground/40 uppercase tracking-widest">No reviews yet</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
