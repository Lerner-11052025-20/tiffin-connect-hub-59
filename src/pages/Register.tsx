import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

const roles = [
  { value: "user", label: "Customer", emoji: "🍽️", desc: "Order daily meals" },
  { value: "vendor", label: "Tiffin Provider", emoji: "👨‍🍳", desc: "Serve home meals" },
];

export default function Register() {
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState("user");

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(18_100%_60%/0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,hsl(40_100%_67%/0.1),transparent_60%)]" />

        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-24 left-20 glass-dark rounded-2xl p-4"
        >
          <span className="text-3xl">🫓</span>
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-24 right-24 glass-dark rounded-2xl p-4"
        >
          <span className="text-3xl">🥘</span>
        </motion.div>

        <div className="relative z-10 text-center px-12">
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-8xl block mb-6"
          >
            👨‍🍳
          </motion.span>
          <h2 className="font-heading text-3xl font-bold text-secondary-foreground">Join TiffinConnect</h2>
          <p className="text-secondary-foreground/60 mt-3 text-lg">
            Start ordering or start serving delicious home meals.
          </p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8 mesh-bg relative">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-10 text-sm">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="flex items-center gap-2 mb-8">
            <span className="text-2xl">🍱</span>
            <span className="font-heading font-bold text-xl text-foreground">
              TIFFIN<span className="text-gradient">CONNECT</span>
            </span>
          </div>

          <h1 className="font-heading text-3xl font-bold text-foreground">Create Account</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Sign up to get started with TiffinConnect.
          </p>

          {/* Role selector */}
          <div className="flex gap-3 mt-8">
            {roles.map((r) => (
              <motion.button
                key={r.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setRole(r.value)}
                className={`flex-1 rounded-2xl p-5 text-center transition-all duration-300 ${
                  role === r.value
                    ? "glass-card border-primary/30 shadow-card-hover ring-1 ring-primary/20"
                    : "glass-subtle border-transparent hover:border-primary/10"
                }`}
              >
                <span className="text-3xl block">{r.emoji}</span>
                <span className="text-sm font-semibold text-foreground mt-2 block">{r.label}</span>
                <span className="text-[11px] text-muted-foreground block mt-0.5">{r.desc}</span>
              </motion.button>
            ))}
          </div>

          <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fname" className="text-foreground/80">First Name</Label>
                <Input id="fname" placeholder="John" className="mt-1.5 h-12 rounded-xl glass-subtle border-border/50 focus:border-primary/50" />
              </div>
              <div>
                <Label htmlFor="lname" className="text-foreground/80">Last Name</Label>
                <Input id="lname" placeholder="Doe" className="mt-1.5 h-12 rounded-xl glass-subtle border-border/50 focus:border-primary/50" />
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="text-foreground/80">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" className="mt-1.5 h-12 rounded-xl glass-subtle border-border/50 focus:border-primary/50" />
            </div>
            <div>
              <Label htmlFor="phone" className="text-foreground/80">Phone</Label>
              <Input id="phone" type="tel" placeholder="+91 98765 43210" className="mt-1.5 h-12 rounded-xl glass-subtle border-border/50 focus:border-primary/50" />
            </div>
            <div>
              <Label htmlFor="password" className="text-foreground/80">Password</Label>
              <div className="relative mt-1.5">
                <Input id="password" type={showPass ? "text" : "password"} placeholder="••••••••" className="h-12 rounded-xl glass-subtle border-border/50 focus:border-primary/50 pr-12" />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button variant="hero" className="w-full h-12 rounded-xl shadow-glow text-base" size="lg">
                Create Account
              </Button>
            </motion.div>
          </form>

          <p className="text-sm text-muted-foreground mt-6 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Log In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
