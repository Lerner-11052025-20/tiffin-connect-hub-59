import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UtensilsCrossed, Plus, Edit2, Trash2, X, Check, ChefHat, Target, Layers, ShoppingBag, ArrowUpRight, Sparkles, Filter, Info, Package, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface MenuForm {
  id?: string;
  name: string;
  description: string;
  meal_type: string;
  price: string;
  items: string[];
  is_available: boolean;
  diet_type: string;
}

const emptyForm: MenuForm = { name: "", description: "", meal_type: "lunch", price: "", items: [], is_available: true, diet_type: "veg" };

export default function MenuManagementPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<MenuForm>(emptyForm);
  const [newItem, setNewItem] = useState("");

  const { data: vendor, isLoading: isVendorLoading, isError: isVendorError } = useQuery({
    queryKey: ["vendor-profile", user?.id],
    enabled: !!user,
    queryFn: () => api.get<any>("/vendors/me"),
    retry: false,
  });

  const { data: menus, isLoading: isMenusLoading } = useQuery({
    queryKey: ["vendor-menus", vendor?.id],
    enabled: !!vendor,
    queryFn: () => api.get<any[]>("/menus/mine"),
  });

  const isLoading = isVendorLoading || isMenusLoading;

  const saveMutation = useMutation<any, any, MenuForm>({
    mutationFn: (f: MenuForm) => {
      const payload = {
        name: f.name,
        description: f.description || null,
        meal_type: f.meal_type,
        price: Number(f.price),
        items: f.items,
        is_available: f.is_available,
        diet_type: f.diet_type,
      };
      if (f.id) {
        return api.put(`/menus/${f.id}`, payload);
      } else {
        return api.post("/menus", payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-menus"] });
      toast.success(form.id ? "Protocol updated!" : "Protocol published!");
      setShowForm(false);
      setForm(emptyForm);
    },
    onError: (err: any) => toast.error(err.message || "Failed to finalize protocol"),
  });

  const deleteMutation = useMutation<any, any, string>({
    mutationFn: (id: string) => api.delete(`/menus/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-menus"] });
      toast.success("Protocol terminated");
    },
  });

  const toggleAvailability = useMutation<any, any, { id: string; is_available: boolean }>({
    mutationFn: ({ id, is_available }: { id: string; is_available: boolean }) =>
      api.put(`/menus/${id}`, { is_available }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-menus"] });
      toast.success("Node availability shifted");
    },
  });

  const editMenu = (menu: any) => {
    setForm({
      id: menu.id,
      name: menu.name,
      description: menu.description ?? "",
      meal_type: menu.meal_type,
      price: String(menu.price),
      items: Array.isArray(menu.items) ? menu.items.map(String) : [],
      is_available: menu.is_available,
      diet_type: menu.diet_type ?? "veg",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addItem = () => {
    if (newItem.trim()) {
      setForm({ ...form, items: [...form.items, newItem.trim()] });
      setNewItem("");
    }
  };

  const removeItem = (idx: number) => {
    setForm({ ...form, items: form.items.filter((_, i) => i !== idx) });
  };

  if (isLoading) {
    return (
      <div className="space-y-12 animate-pulse">
        <div className="h-32 premium-card" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 premium-card" />
          ))}
        </div>
      </div>
    );
  }

  if (!vendor || isVendorError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-card p-24 text-center border-dashed"
      >
        <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
          <ChefHat className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-foreground tracking-tight">Profile Incomplete</h3>
        <p className="text-muted-foreground mt-4 font-medium text-base max-w-sm mx-auto leading-relaxed">Please complete your business profile to manage your menu items.</p>
        <Link to="/vendor/profile" className="block mt-10">
          <Button className="rounded-xl font-bold text-sm px-10 h-14 bg-primary text-white hover:opacity-90 transition-all shadow-lg shadow-primary/20">Setup Profile</Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-24"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="badge-premium">Menu Management</span>
            <div className="w-1 h-1 rounded-full bg-border" />
            <span className="text-[10px] font-semibold text-muted-foreground/60">Manage your food items</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-none">
            Kitchen <span className="text-primary">Menu</span>.
          </h2>
          <p className="text-muted-foreground font-medium text-base max-w-2xl">Create and manage your meal plans and food offerings.</p>
        </div>

        {!showForm && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => { setForm(emptyForm); setShowForm(true); }}
              className="gap-2 font-bold text-sm h-12 rounded-xl px-8 bg-foreground text-background hover:opacity-90 transition-all shadow-lg border-none"
            >
              <Plus className="h-4 w-4" /> Add New Item
            </Button>
          </motion.div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="premium-card p-6 lg:p-8 relative overflow-hidden mb-8"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[80px] -mr-40 -mt-40 pointer-events-none transition-transform duration-1000" />

            <div className="flex items-center justify-between mb-10 relative z-10">
              <div className="space-y-1">
                <h2 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight flex items-center gap-3">
                   <div className="w-1.5 h-6 bg-primary rounded-full shadow-lg" />
                  {form.id ? "Edit Menu Item" : "Create New Item"}
                </h2>
                <p className="text-[10px] text-muted-foreground/50 font-bold uppercase tracking-widest pl-4">Define your meal details</p>
              </div>
              <Button variant="ghost" size="icon" className="rounded-xl h-12 w-12 bg-muted/20 hover:bg-destructive hover:text-white transition-all border-none" onClick={() => setShowForm(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid lg:grid-cols-12 gap-12 relative z-10">
              <div className="lg:col-span-8 space-y-10">
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-xs font-bold text-primary ml-1">Item Name</Label>
                    <Input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Special Veg Thali"
                      className="h-12 rounded-xl bg-background border border-border/60 focus:border-primary/50 focus:ring-primary/10 transition-all font-semibold text-sm"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-bold text-primary ml-1">Price (₹)</Label>
                    <Input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="120"
                      className="h-12 rounded-xl bg-background border border-border/60 focus:border-primary/50 focus:ring-primary/10 transition-all font-semibold text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-bold text-primary ml-1">Description</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe what's included in this meal..."
                    className="rounded-xl bg-background border border-border/60 focus:border-primary/50 focus:ring-primary/10 transition-all font-medium text-base p-6 min-h-[120px]"
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-xs font-bold text-primary ml-1">Menu Items (e.g. Dal, Paneer, 4 Roti)</Label>
                  <div className="flex gap-4">
                    <Input
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                      placeholder="Add an item..."
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem())}
                      className="h-12 rounded-xl bg-background border border-border/60 focus:border-primary/50 focus:ring-primary/10 transition-all font-semibold text-sm"
                    />
                    <Button variant="outline" className="h-12 rounded-xl font-bold text-xs px-6 border-primary/20 bg-primary/5 hover:bg-primary hover:text-white transition-all underline-none" onClick={addItem}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-4 p-8 bg-muted/10 rounded-[2.5rem] border border-border/40 min-h-[100px] shadow-inner">
                    <AnimatePresence>
                      {form.items.length > 0 ? form.items.map((it, i) => (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          key={i}
                        >
                          <Badge className="bg-background text-foreground border-border/60 font-semibold text-xs py-2 px-4 rounded-xl flex items-center gap-2 shadow-sm hover:border-primary/20 transition-all">
                            <span>{it}</span>
                            <button onClick={() => removeItem(i)} className="text-muted-foreground/40 hover:text-destructive transition-colors"><X className="h-3.5 w-3.5" /></button>
                          </Badge>
                        </motion.div>
                      )) : (
                        <div className="flex flex-col items-center justify-center w-full space-y-2 opacity-30">
                          <Info className="h-5 w-5" />
                          <p className="text-[9px] font-black uppercase tracking-widest">No Sub-Units Integrated</p>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-8">
                <div className="bg-muted/10 p-10 rounded-[2.5rem] border border-border/40 space-y-10 shadow-inner">
                  <div className="space-y-4">
                    <Label className="text-xs font-bold text-primary ml-1">Meal Time</Label>
                    <Select value={form.meal_type} onValueChange={(v) => setForm({ ...form, meal_type: v })}>
                      <SelectTrigger className="h-12 rounded-xl bg-background border border-border/60 font-semibold text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl shadow-2xl border-border/40 p-2">
                        <SelectItem value="lunch" className="rounded-lg py-2 font-semibold text-xs focus:bg-primary/10">Lunch</SelectItem>
                        <SelectItem value="dinner" className="rounded-lg py-2 font-semibold text-xs focus:bg-primary/10">Dinner</SelectItem>
                        <SelectItem value="both" className="rounded-lg py-2 font-semibold text-xs focus:bg-primary/10">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-xs font-bold text-primary ml-1">Diet Type</Label>
                    <Select value={form.diet_type} onValueChange={(v) => setForm({ ...form, diet_type: v })}>
                      <SelectTrigger className="h-12 rounded-xl bg-background border border-border/60 shadow-sm font-semibold text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl shadow-2xl border-border/40 p-2">
                        <SelectItem value="veg" className="rounded-lg py-2 font-semibold text-xs focus:bg-primary/10">Veg</SelectItem>
                        <SelectItem value="non-veg" className="rounded-lg py-2 font-semibold text-xs focus:bg-primary/10">Non-Veg</SelectItem>
                        <SelectItem value="vegan" className="rounded-lg py-2 font-semibold text-xs focus:bg-primary/10">Vegan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between p-6 bg-background rounded-2xl border border-border/60 shadow-sm">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-primary">Available</p>
                      <p className="text-xs font-medium text-muted-foreground">{form.is_available ? "Shown to customers" : "Hidden from menu"}</p>
                    </div>
                    <Switch checked={form.is_available} onCheckedChange={(v) => setForm({ ...form, is_available: v })} />
                  </div>
                </div>

                 <div className="pt-4">
                  <Button
                    onClick={() => saveMutation.mutate(form)}
                    disabled={!form.name || !form.price || saveMutation.isPending}
                    className="w-full h-12 rounded-xl bg-primary text-white font-bold text-[11px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                  >
                    {saveMutation.isPending ? "Saving..." : form.id ? "Update Item" : "Create Item"}
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu Grid */}
      <AnimatePresence mode="popLayout">
        {menus && menus.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {menus.map((menu, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.5, ease: "circOut" }}
                key={menu.id}
                className="premium-card p-6 flex flex-col overflow-hidden group/menu"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] -mr-16 -mt-16 transition-transform duration-1000" />

                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground tracking-tight">{menu.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-semibold text-[10px] px-3 py-1 rounded-full capitalize">
                        {menu.meal_type}
                      </Badge>
                      <Badge variant="outline" className={`capitalize text-[10px] font-semibold px-3 py-1 rounded-full border ${menu.diet_type === 'veg' ? 'bg-green-500/10 text-green-600 border-green-500/20' : menu.diet_type === 'non-veg' ? 'bg-red-500/10 text-red-600 border-red-500/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                        {menu.diet_type}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <Switch
                      checked={menu.is_available}
                      onCheckedChange={(v) => toggleAvailability.mutate({ id: menu.id, is_available: v })}
                    />
                    <span className="text-[10px] font-semibold text-muted-foreground/60">{menu.is_available ? "Available" : "Unavailable"}</span>
                  </div>
                </div>

                {menu.description && (
                  <p className="text-sm text-muted-foreground/70 mb-8 line-clamp-3 italic leading-relaxed font-medium">
                    "{menu.description}"
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mb-10 relative z-10">
                  {Array.isArray(menu.items) && menu.items.map((it, i) => (
                    <span key={i} className="text-xs bg-muted/40 text-muted-foreground/60 font-semibold rounded-xl px-4 py-1.5 border border-border/30">{String(it)}</span>
                  ))}
                </div>

                <div className="mt-auto pt-6 border-t border-border/20 flex items-center justify-between relative z-10">
                  <div className="flex items-baseline gap-1">
                    <span className="font-bold text-2xl text-foreground tracking-tighter">₹{Number(menu.price).toLocaleString()}</span>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-40">/meal</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg bg-background border border-border/60 hover:bg-primary hover:text-white transition-all shadow-sm" onClick={() => editMenu(menu)}>
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg bg-background border border-border/60 text-destructive hover:bg-destructive hover:text-white transition-all shadow-sm" onClick={() => deleteMutation.mutate(menu.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="premium-card p-32 text-center border-dashed"
          >
            <div className="w-24 h-24 bg-muted/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Package className="h-10 w-10 text-muted-foreground/20" />
            </div>
            <h3 className="text-2xl font-bold text-foreground tracking-tight mb-4">No menu items added</h3>
            <p className="text-muted-foreground mt-3 font-medium text-base max-w-lg mx-auto leading-relaxed">Start by adding your first menu item to begin receiving orders from customers.</p>
            <div className="mt-10 inline-block">
              <Button
                className="h-14 px-10 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                onClick={() => { setForm(emptyForm); setShowForm(true); }}
              >
                Add Your First Item
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
