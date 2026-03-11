import React, { useState } from "react";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Utensils, ShoppingCart, CalendarDays, Filter, Star, Search, Info, ChefHat, Sparkles, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import OrderDialog from "@/components/order/OrderDialog";
import SubscribeDialog from "@/components/order/SubscribeDialog";
import VendorReviewsDialog from "@/components/order/VendorReviewsDialog";
import { motion, AnimatePresence } from "framer-motion";

export default function BrowseMealsPage() {
  const [mealFilter, setMealFilter] = useState<string>("all");
  const [orderMenu, setOrderMenu] = useState<any>(null);
  const [subscribeMenu, setSubscribeMenu] = useState<any>(null);
  const [viewVendor, setViewVendor] = useState<any>(null);

  const { data: menus = [], isLoading } = useQuery({
    queryKey: ["menus", mealFilter],
    queryFn: () => api.get<any[]>(`/menus?meal_type=${mealFilter}`),
  });

  const renderItems = (items: any) => {
    if (Array.isArray(items)) {
      return items.map((it, i) => (
        <Badge key={i} variant="outline" className="text-[10px] bg-primary/5 text-primary border border-primary/10 font-bold uppercase tracking-widest rounded-full px-3 py-1">
          {String(it)}
        </Badge>
      ));
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="space-y-12 animate-pulse">
        <div className="h-32 bg-card rounded-[2.5rem]" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-[450px] bg-card rounded-[3rem]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12 pb-24"
    >
      {/* Search and Filter Header */}
      <div className="relative group p-10 lg:p-14 rounded-[3.5rem] bg-card border border-border/50 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none group-hover:scale-110 transition-transform duration-1000" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 relative z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary mb-2 shadow-sm">
              <ChefHat className="h-3.5 w-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Healthy & Fresh</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-none">
              Browse <span className="text-primary italic">Our Menu</span>
            </h2>
            <p className="text-muted-foreground font-medium text-lg lg:text-xl max-w-2xl">Discover homemade tiffins from the best kitchens in your area.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 bg-muted/20 p-2 rounded-3xl border border-border/40 backdrop-blur-md shadow-inner">
            <div className="flex items-center gap-3 px-6 border-r border-border/50 hidden sm:flex">
              <Filter className="h-5 w-5 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-foreground">Filter</span>
            </div>
            <Select value={mealFilter} onValueChange={setMealFilter}>
              <SelectTrigger className="w-full sm:w-[240px] bg-background/50 border-0 focus:ring-1 focus:ring-primary/20 shadow-none h-14 rounded-2xl font-bold text-[11px] uppercase tracking-widest text-foreground">
                <SelectValue placeholder="Meal Type" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl shadow-2xl border-border/40">
                <SelectItem value="all" className="rounded-xl font-bold uppercase tracking-widest text-[10px] focus:bg-primary/10 focus:text-primary">All Meals</SelectItem>
                <SelectItem value="lunch" className="rounded-xl font-bold uppercase tracking-widest text-[10px] focus:bg-primary/10 focus:text-primary">Lunch Only</SelectItem>
                <SelectItem value="dinner" className="rounded-xl font-bold uppercase tracking-widest text-[10px] focus:bg-primary/10 focus:text-primary">Dinner Only</SelectItem>
                <SelectItem value="both" className="rounded-xl font-bold uppercase tracking-widest text-[10px] focus:bg-primary/10 focus:text-primary">Lunch & Dinner</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {menus.length > 0 ? (
          <motion.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {menus.map((menu, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: "circOut" }}
                key={menu.id}
                className="group relative premium-card p-10 group hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] transition-all duration-700 flex flex-col overflow-hidden"
              >
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />

                <div className="absolute top-8 right-8">
                  <Badge className="bg-primary/5 text-primary border-primary/20 font-bold uppercase tracking-widest text-[10px] px-3 py-1.5 rounded-full">
                    {menu.meal_type} Service
                  </Badge>
                </div>

                <div className="space-y-6 mb-10 relative z-10">
                  <div className="space-y-4">
                    <h3 className="font-bold text-2xl lg:text-3xl text-foreground tracking-tight group-hover:text-primary transition-colors duration-500 leading-tight pr-12">
                      {menu.name}
                    </h3>

                    <div
                      className="flex items-center gap-4 group/vendor text-left"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-muted/40 flex items-center justify-center border border-border shadow-inner font-bold text-xs text-primary group-hover/vendor:scale-110 transition-all duration-500">
                        {(menu.vendors as any)?.business_name?.substring(0, 2)}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 leading-none mb-1">Provider</p>
                        <span className="text-sm font-bold text-foreground group-hover/vendor:text-primary transition-colors">{(menu.vendors as any)?.business_name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-muted/10 p-4 rounded-2xl border border-border/40 shadow-inner w-fit cursor-pointer hover:bg-muted/20 transition-all" onClick={() => setViewVendor(menu)}>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-3 w-3 ${s <= (menu.averageRating || 0) ? 'fill-primary text-primary' : 'text-muted-foreground/20'}`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-foreground">{menu.averageRating || "0.0"}</span>
                    <div className="w-1 h-1 rounded-full bg-border" />
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{menu.totalReviews || 0} Reviews</span>
                  </div>
                </div>

                {menu.description && (
                  <p className="text-sm text-muted-foreground/70 mb-8 line-clamp-3 leading-[1.8] font-medium italic pr-6 group-hover:text-foreground transition-colors duration-500">
                    "{menu.description}"
                  </p>
                )}

                <div className="flex flex-wrap gap-2.5 mb-10 relative z-10">
                  {renderItems(menu.items)}
                </div>

                <div className="mt-auto pt-10 border-t border-border/20 space-y-8 relative z-10">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight">₹{Number(menu.price).toLocaleString()}</span>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Per Day</span>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      className="flex-1 rounded-2xl h-14 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold tracking-widest uppercase text-[10px] hover:scale-[1.02] active:scale-95 transition-all shadow-xl group/btn border-none"
                      onClick={() => setOrderMenu(menu)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" /> Order Now
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 rounded-2xl h-14 border-border/60 bg-background font-bold tracking-widest uppercase text-[10px] hover:bg-primary/5 hover:text-primary transition-all group/btn"
                      onClick={() => setSubscribeMenu(menu)}
                    >
                      <CalendarDays className="h-4 w-4 mr-2" /> Subscribe
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-[4rem] p-32 text-center border border-dashed border-border/60 shadow-inner group hover:border-primary/20 transition-all duration-700"
          >
            <div className="w-32 h-32 bg-muted/10 rounded-[3rem] flex items-center justify-center mx-auto mb-10 group-hover:scale-110 transition-transform duration-500">
              <Sparkles className="h-12 w-12 text-muted-foreground/20" />
            </div>
            <h3 className="text-3xl font-bold text-foreground tracking-tight leading-none mb-6">No Meals Found</h3>
            <p className="text-muted-foreground mt-3 font-medium text-lg max-w-lg mx-auto leading-relaxed">We couldn't find any meals matching your current filters. Try resetting your search parameters.</p>
            <Button
              variant="outline"
              className="mt-12 h-14 px-12 rounded-2xl border-border/60 font-bold uppercase tracking-widest text-[11px] hover:bg-primary/10 hover:text-primary transition-all"
              onClick={() => setMealFilter("all")}
            >
              Reset Filters
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <OrderDialog menu={orderMenu} open={!!orderMenu} onOpenChange={(o) => {
        if (!o) {
          setOrderMenu(null);
        }
      }} />
      <SubscribeDialog menu={subscribeMenu} open={!!subscribeMenu} onOpenChange={(o) => {
        if (!o) {
          setSubscribeMenu(null);
        }
      }} />
      <VendorReviewsDialog
        menu={viewVendor}
        open={!!viewVendor}
        onOpenChange={(open) => !open && setViewVendor(null)}
      />
    </motion.div>
  );
}
