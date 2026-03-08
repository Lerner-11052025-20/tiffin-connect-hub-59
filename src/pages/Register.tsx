import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const roles = [
  { value: "user", label: "Customer", emoji: "🍽️", desc: "Order daily meals" },
  { value: "vendor", label: "Tiffin Provider", emoji: "👨‍🍳", desc: "Serve home meals" },
  { value: "admin", label: "Admin", emoji: "🛡️", desc: "Manage platform" },
];

export default function Register() {
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState("user");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName, phone, role },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created! Check your email to confirm.");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(158_64%_52%/0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,hsl(24_95%_64%/0.08),transparent_60%)]" />
        <div className="absolute inset-0 dot-pattern opacity-[0.03]" />

        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-24 left-20 glass-dark rounded-2xl p-5"
        >
          <span className="text-4xl">🫓</span>
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-24 right-24 glass-dark rounded-2xl p-5"
        >
          <span className="text-4xl">🥘</span>
        </motion.div>

        <div className="relative z-10 text-center px-12">
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-8xl block mb-8"
          >
            👨‍🍳
          </motion.span>
          <h2 className="font-heading text-4xl font-extrabold text-secondary-foreground">Join TiffinConnect</h2>
          <p className="text-secondary-foreground/50 mt-4 text-lg max-w-sm mx-auto">Start ordering or start serving delicious home meals.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 mesh-bg dot-pattern relative overflow-y-auto">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-10 text-sm group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to home
          </Link>

          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl gradient-hero flex items-center justify-center shadow-glow">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-lg text-foreground tracking-tight">Tiffin<span className="text-gradient">Connect</span></span>
          </div>

          <h1 className="font-heading text-3xl font-extrabold text-foreground">Create Account</h1>
          <p className="text-sm text-muted-foreground mt-2">Sign up to get started with TiffinConnect.</p>

          {/* Role selection */}
          <div className="flex gap-3 my-7">
            {roles.map((r) => (
              <motion.button
                key={r.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setRole(r.value)}
                className={`flex-1 rounded-2xl p-5 text-center transition-all duration-300 ${
                  role === r.value
                    ? "glass-card-strong border-primary/30 shadow-card-hover ring-2 ring-primary/20"
                    : "glass-subtle border-transparent hover:border-primary/10"
                }`}
              >
                <span className="text-3xl block">{r.emoji}</span>
                <span className="text-sm font-bold text-foreground mt-2 block">{r.label}</span>
                <span className="text-[11px] text-muted-foreground block mt-0.5">{r.desc}</span>
              </motion.button>
            ))}
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="fullname" className="text-foreground/80 text-sm font-medium">Full Name</Label>
              <Input id="fullname" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-2 h-12 rounded-xl bg-card border-border/60 focus:border-primary/50 shadow-soft" />
            </div>
            <div>
              <Label htmlFor="email" className="text-foreground/80 text-sm font-medium">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 h-12 rounded-xl bg-card border-border/60 focus:border-primary/50 shadow-soft" />
            </div>
            <div>
              <Label htmlFor="phone" className="text-foreground/80 text-sm font-medium">Phone (optional)</Label>
              <Input id="phone" type="tel" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-2 h-12 rounded-xl bg-card border-border/60 focus:border-primary/50 shadow-soft" />
            </div>
            <div>
              <Label htmlFor="password" className="text-foreground/80 text-sm font-medium">Password</Label>
              <div className="relative mt-2">
                <Input id="password" type={showPass ? "text" : "password"} placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 rounded-xl bg-card border-border/60 focus:border-primary/50 pr-12 shadow-soft" />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button variant="hero" className="w-full h-12 rounded-xl shadow-glow text-base font-semibold" size="lg" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </motion.div>
          </form>

          <p className="text-sm text-muted-foreground mt-6 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">Log In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
