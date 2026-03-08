import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Logged in successfully!");
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();
        const role = roleData?.role || "user";
        const map: Record<string, string> = { user: "/dashboard", vendor: "/vendor", admin: "/admin" };
        navigate(map[role] || "/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,hsl(40_100%_67%/0.3),transparent_60%)]" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,hsl(0_0%_100%/0.03)_0px,hsl(0_0%_100%/0.03)_1px,transparent_1px,transparent_80px)]" />
        <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-20 right-20 glass rounded-2xl p-4 shadow-card">
          <span className="text-3xl">🍛</span>
        </motion.div>
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute bottom-32 left-20 glass rounded-2xl p-4 shadow-card">
          <span className="text-3xl">🥗</span>
        </motion.div>
        <div className="relative z-10 text-center px-12">
          <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-8xl block mb-6">🍱</motion.span>
          <h2 className="font-heading text-3xl font-bold text-primary-foreground">Welcome Back!</h2>
          <p className="text-primary-foreground/80 mt-3 text-lg">Your home-style meals are waiting for you.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 mesh-bg relative">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-10 text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          <div className="flex items-center gap-2 mb-8">
            <span className="text-2xl">🍱</span>
            <span className="font-heading font-bold text-xl text-foreground">TIFFIN<span className="text-gradient">CONNECT</span></span>
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Log In</h1>
          <p className="text-sm text-muted-foreground mt-2">Enter your credentials to access your account.</p>

          <form onSubmit={handleLogin} className="space-y-5 mt-8">
            <div>
              <Label htmlFor="email" className="text-foreground/80">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 h-12 rounded-xl glass-subtle border-border/50 focus:border-primary/50" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground/80">Password</Label>
                <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
              </div>
              <div className="relative mt-1.5">
                <Input id="password" type={showPass ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 rounded-xl glass-subtle border-border/50 focus:border-primary/50 pr-12" />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button variant="hero" className="w-full h-12 rounded-xl shadow-glow text-base" size="lg" disabled={loading}>
                {loading ? "Signing in..." : "Log In"}
              </Button>
            </motion.div>
          </form>

          <p className="text-sm text-muted-foreground mt-8 text-center">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">Sign Up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
