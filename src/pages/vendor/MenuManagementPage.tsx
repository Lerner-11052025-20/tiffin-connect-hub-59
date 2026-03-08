import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { UtensilsCrossed, Plus, Edit2, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface MenuForm {
  id?: string;
  name: string;
  description: string;
  meal_type: string;
  price: string;
  items: string[];
  is_available: boolean;
}

const emptyForm: MenuForm = { name: "", description: "", meal_type: "lunch", price: "", items: [], is_available: true };

export default function MenuManagementPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<MenuForm>(emptyForm);
  const [newItem, setNewItem] = useState("");

  const { data: vendor } = useQuery({
    queryKey: ["vendor-profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("vendors").select("*").eq("user_id", user!.id).maybeSingle();
      return data;
    },
  });

  const { data: menus, isLoading } = useQuery({
    queryKey: ["vendor-menus", vendor?.id],
    enabled: !!vendor,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("menus")
        .select("*")
        .eq("vendor_id", vendor!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (f: MenuForm) => {
      const payload = {
        name: f.name,
        description: f.description || null,
        meal_type: f.meal_type,
        price: Number(f.price),
        items: f.items,
        is_available: f.is_available,
        vendor_id: vendor!.id,
      };
      if (f.id) {
        const { error } = await supabase.from("menus").update(payload).eq("id", f.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("menus").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-menus"] });
      toast.success(form.id ? "Menu updated!" : "Menu created!");
      setShowForm(false);
      setForm(emptyForm);
    },
    onError: () => toast.error("Failed to save menu"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("menus").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-menus"] });
      toast.success("Menu deleted");
    },
  });

  const toggleAvailability = useMutation({
    mutationFn: async ({ id, is_available }: { id: string; is_available: boolean }) => {
      const { error } = await supabase.from("menus").update({ is_available }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vendor-menus"] }),
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
    });
    setShowForm(true);
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
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-primary" /> Menu Management
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Create and manage your meal menus</p>
        </div>
        <Button onClick={() => { setForm(emptyForm); setShowForm(!showForm); }} size="sm">
          <Plus className="h-4 w-4 mr-1" /> New Menu
        </Button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-semibold text-foreground">{form.id ? "Edit Menu" : "New Menu"}</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></Button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Veg Thali" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Price (₹)</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="120" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Meal Type</Label>
                <Select value={form.meal_type} onValueChange={(v) => setForm({ ...form, meal_type: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end gap-3">
                <div className="flex items-center gap-2">
                  <Switch checked={form.is_available} onCheckedChange={(v) => setForm({ ...form, is_available: v })} />
                  <Label className="text-sm text-muted-foreground">Available</Label>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="A wholesome thali with..." className="mt-1" rows={2} />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Menu Items</Label>
              <div className="flex gap-2 mt-1">
                <Input value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder="e.g. 4 Roti" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem())} />
                <Button variant="outline" size="sm" onClick={addItem}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.items.map((it, i) => (
                  <Badge key={i} variant="secondary" className="gap-1 pr-1">
                    {it}
                    <button onClick={() => removeItem(i)} className="ml-1 hover:text-destructive"><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
              </div>
            </div>

            <Button onClick={() => saveMutation.mutate(form)} disabled={!form.name || !form.price || saveMutation.isPending}>
              {form.id ? "Update Menu" : "Create Menu"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu List */}
      {menus && menus.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {menus.map((menu) => (
            <motion.div key={menu.id} whileHover={{ y: -2 }} className="glass-card rounded-2xl p-5 hover:shadow-card-hover transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-heading font-semibold text-foreground">{menu.name}</h3>
                  <p className="text-xs text-muted-foreground capitalize">{menu.meal_type}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Switch
                    checked={menu.is_available}
                    onCheckedChange={(v) => toggleAvailability.mutate({ id: menu.id, is_available: v })}
                  />
                </div>
              </div>

              {menu.description && <p className="text-sm text-muted-foreground mb-3">{menu.description}</p>}

              <div className="flex flex-wrap gap-1.5 mb-4">
                {Array.isArray(menu.items) && menu.items.map((it, i) => (
                  <span key={i} className="text-xs bg-muted/50 text-muted-foreground rounded-full px-2.5 py-1">{String(it)}</span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/30">
                <p className="font-heading font-bold text-foreground text-lg">₹{Number(menu.price).toLocaleString()}</p>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => editMenu(menu)}>
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteMutation.mutate(menu.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-16 text-center">
          <span className="text-6xl block mb-4">🍽️</span>
          <h3 className="font-heading font-semibold text-foreground text-lg">No menus yet</h3>
          <p className="text-muted-foreground mt-2 text-sm">Create your first menu to start receiving orders!</p>
        </div>
      )}
    </motion.div>
  );
}
