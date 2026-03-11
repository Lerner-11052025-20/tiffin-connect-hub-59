import React from "react";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { 
  Star, MessageSquare, Clock, Package, Quote, 
  User, ChevronRight, Smile, ThumbsUp, Calendar 
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import NumberTicker from "@/components/ui/number-ticker";
import { motion, AnimatePresence } from "framer-motion";

interface OrderData {
  mealName: string;
  deliveryDate?: string;
}

interface ReviewItem {
  id: string;
  userId?: {
    full_name: string;
  };
  rating: number;
  createdAt: string;
  reviewText: string;
  orderId?: OrderData;
}

interface ReviewsResponse {
  reviews: ReviewItem[];
  total: number;
  positiveFeedback: number;
  pages: number;
}

const VendorReviewsPage: React.FC = () => {
    const { user } = useAuth();

    const { data: vendor } = useQuery({
        queryKey: ["vendor-profile", user?.id],
        enabled: !!user,
        queryFn: () => api.get<any>("/vendors/me"),
    });

    const { data: reviewsData, isLoading } = useQuery<ReviewsResponse>({
        queryKey: ["vendor-reviews-private", vendor?.id],
        enabled: !!vendor,
        queryFn: () => api.get<ReviewsResponse>("/reviews/my-vendor"),
    });

    const reviews = reviewsData?.reviews || [];
    const total = reviewsData?.total || 0;

    if (isLoading) {
        return (
            <div className="space-y-12 animate-pulse">
                <div className="h-32 premium-card shadow-none bg-muted/20" />
                <div className="grid md:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-40 premium-card shadow-none bg-muted/20" />
                    ))}
                </div>
            </div>
        );
    }

    const stats = [
        { 
            label: "Average Rating", 
            value: String(vendor?.averageRating || "0.0"), 
            icon: Star, 
            color: "text-primary", 
            bg: "bg-primary/10", 
            suffix: "/ 5.0" 
        },
        { 
            label: "Total Reviews", 
            value: String(total), 
            icon: MessageSquare, 
            color: "text-amber-500", 
            bg: "bg-amber-500/10" 
        },
        { 
            label: "Positive Feedback", 
            value: `${reviewsData?.positiveFeedback || 0}%`, 
            icon: Smile, 
            color: "text-emerald-500", 
            bg: "bg-emerald-500/10" 
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 pb-24"
        >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <span className="badge-premium">Ratings & Reviews</span>
                        <div className="w-1 h-1 rounded-full bg-border" />
                        <span className="text-[10px] font-semibold text-muted-foreground/60">Feedback Logs</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-none">
                        Customer <span className="text-primary">Reviews</span>.
                    </h2>
                    <p className="text-muted-foreground font-medium text-base max-w-2xl">Track your performance and customer feedback to improve your service.</p>
                </div>

                <div className="flex items-center gap-2 premium-card px-6 py-4 rounded-xl shadow-none">
                    <ThumbsUp className="h-5 w-5 text-primary" />
                    <span className="text-xs font-bold text-foreground">Top Quality Rated Vendor</span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5, ease: "circOut" }}
                        className="premium-card p-6 relative overflow-hidden group/stat shadow-none"
                    >
                        <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} opacity-20 rounded-full blur-[30px] -mr-12 -mt-12 transition-transform duration-500 group-hover/stat:scale-110`} />
                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div className="flex items-center justify-between mb-8">
                                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center border border-white/10 shadow-inner`}>
                                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                </div>
                                <Badge variant="outline" className="text-[9px] font-bold bg-background/50 border-border/40 opacity-40 uppercase tracking-widest px-2 py-0.5"> STAT </Badge>
                            </div>
                            <div>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1 opacity-60">{stat.label}</p>
                                <div className="text-2xl font-bold text-foreground tracking-tight flex items-baseline gap-2">
                                    {stat.label === "Total Reviews" ? <NumberTicker value={Number(stat.value)} /> : stat.value}
                                    {stat.suffix && <span className="text-sm text-muted-foreground font-medium tracking-normal mb-1">{stat.suffix}</span>}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="space-y-8">
                <div className="flex items-center gap-3 px-4">
                    <span className="badge-premium">Feedback manifestation logs</span>
                    <div className="h-px w-full bg-border/20" />
                </div>

                <AnimatePresence mode="popLayout">
                    {reviews.length > 0 ? (
                        <div className="grid gap-8">
                            {reviews.map((review, index) => (
                                <motion.div
                                    key={review.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="premium-card p-6 lg:p-8 flex flex-col lg:flex-row gap-8 items-stretch shadow-none"
                                >
                                    <div className="flex-1 space-y-8 relative">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-5">
                                                <div className="w-16 h-16 rounded-xl bg-muted/20 border border-border/40 flex items-center justify-center shadow-inner">
                                                    <User className="h-7 w-7 text-muted-foreground/60" />
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-xl font-bold text-foreground tracking-tight leading-none">{review.userId?.full_name || "Customer"}</span>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-0.5">
                                                            {[1, 2, 3, 4, 5].map((s) => (
                                                                <Star key={s} className={`h-3 w-3 ${s <= review.rating ? 'fill-primary text-primary' : 'text-muted-foreground/10'}`} />
                                                            ))}
                                                        </div>
                                                        <span className="text-xs font-semibold text-primary">
                                                            {review.rating}.0 Rating
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right hidden sm:block">
                                                <div className="flex items-center gap-2 text-muted-foreground/40 font-bold text-[10px]">
                                                    <Clock className="h-3 w-3" />
                                                    {format(new Date(review.createdAt), "dd MMM yyyy")}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-muted/10 rounded-xl p-6 border border-border/30 relative shadow-inner transition-colors duration-300">
                                            <Quote className="absolute -top-3 left-6 h-6 w-6 text-primary/10" />
                                            <p className="text-muted-foreground font-medium text-base leading-relaxed italic relative z-10">
                                                "{review.reviewText}"
                                            </p>
                                        </div>
                                    </div>

                                    <div className="w-full lg:w-72 shrink-0 premium-card p-6 border-dashed flex flex-col justify-center gap-6 relative overflow-hidden shadow-none">
                                        <div className="absolute inset-0 bg-primary/2 opacity-0 transition-opacity duration-700" />

                                        <div className="flex items-center gap-5 relative z-10">
                                            <div className="w-14 h-14 rounded-xl bg-background border border-border/60 flex items-center justify-center shadow-inner">
                                                <Package className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-muted-foreground/50 font-bold uppercase tracking-widest mb-1 leading-none">Ordered Item</p>
                                                <p className="font-bold text-sm text-foreground tracking-tight line-clamp-1 truncate">{review.orderId?.mealName || "Meal"}</p>
                                            </div>
                                        </div>

                                        <div className="pt-8 border-t border-border/20 relative z-10">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground/40" />
                                                <p className="text-[10px] text-muted-foreground/50 font-bold uppercase tracking-widest leading-none">Delivery date</p>
                                            </div>
                                            <p className="text-sm font-bold text-foreground uppercase tracking-widest">
                                                {review.orderId?.deliveryDate ? format(new Date(review.orderId.deliveryDate), "dd MMMM yyyy") : "Previous Order"}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 relative z-10">
                                            <Badge variant="outline" className="text-[10px] font-bold bg-green-500/10 text-green-600 border-green-500/20 px-3 py-1 rounded-lg">Verified Purchase</Badge>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground/20" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="premium-card p-32 text-center border-dashed shadow-none"
                        >
                            <div className="w-24 h-24 bg-muted/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                                <MessageSquare className="h-10 w-10 text-muted-foreground/20" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground tracking-tight mb-4">No reviews yet</h3>
                            <p className="text-muted-foreground mt-3 font-medium text-base max-w-lg mx-auto leading-relaxed">Customer reviews will appear here once customers start sharing their feedback on your service.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default VendorReviewsPage;
