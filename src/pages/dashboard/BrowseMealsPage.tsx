import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Utensils } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Json } from "@/integrations/supabase/types";

export default function BrowseMealsPage() {
  const [mealFilter, setMealFilter] = useState<string>("all");

  const { data: menus, isLoading } = useQuery({
    queryKey: ["menus", mealFilter],
    queryFn: async () => {
      let query = supabase
        .from("menus")
        .select("*, vendors(business_name)")
        .eq("is_available", true);

      if (mealFilter !== "all") {
        query = query.eq("meal_type", mealFilter);
      }

      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const renderItems = (items: Json) => {
    if (Array.isArray(items)) {
      return items.map((it, i) => (
        <span key={i} className="text-xs bg-muted/50 text-muted-foreground rounded-full px-2.5 py-1">
          {String(it)}
        </span>
      ));
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
            <Utensils className="h-5 w-5 text-primary" /> Browse Meals
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Explore available meals from vendors</p>
        </div>

        <Select value={mealFilter} onValueChange={setMealFilter}>
          <SelectTrigger className="w-[130px] h-9 text-sm">
            <SelectValue placeholder="Meal type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Meals</SelectItem>
            <SelectItem value="lunch">Lunch</SelectItem>
            <SelectItem value="dinner">Dinner</SelectItem>
            <SelectItem value="both">Both</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {menus && menus.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {menus.map((menu, i) => (
            <motion.div
              key={menu.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="glass-card rounded-2xl p-5 hover:shadow-card-hover transition-all duration-300 flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-heading font-semibold text-foreground">{menu.name}</h3>
                  <p className="text-xs text-muted-foreground">{(menu.vendors as any)?.business_name}</p>
                </div>
                <Badge variant="outline" className="capitalize text-xs">
                  {menu.meal_type}
                </Badge>
              </div>

              {menu.description && (
                <p className="text-sm text-muted-foreground mb-3">{menu.description}</p>
              )}

              <div className="flex flex-wrap gap-1.5 mb-4">
                {renderItems(menu.items)}
              </div>

              <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/30">
                <p className="font-heading font-bold text-foreground text-lg">₹{Number(menu.price).toLocaleString()}</p>
                <span className="text-xs text-muted-foreground">per meal</span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl p-16 text-center">
          <span className="text-6xl block mb-4">🍽️</span>
          <h3 className="font-heading font-semibold text-foreground text-lg">No meals available</h3>
          <p className="text-muted-foreground mt-2 text-sm">Check back soon for new meal offerings!</p>
        </motion.div>
      )}
    </motion.div>
  );
}
