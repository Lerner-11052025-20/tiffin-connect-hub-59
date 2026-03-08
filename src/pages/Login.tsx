import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function Login() {
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,hsl(40_100%_67%/0.3),transparent_60%)]" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,hsl(0_0%_100%/0.03)_0px,hsl(0_0%_100%/0.03)_1px,transparent_1px,transparent_80px)]" />

        {/* Floating elements */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 glass rounded-2xl p-4 shadow-card"
        >
          <span className="text-3xl">🍛</span>
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-32 left-20 glass rounded-2xl p-4 shadow-card"
        >
          <span className="text-3xl">🥗</span>
        </motion.div>

        <div className="relative z-10 text-center px-12">
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-8xl block mb-6"
          >
            🍱
          </motion.span>
          <h2 className="font-heading text-3xl font-bold text-primary-foreground">Welcome Back!</h2>
          <p className="text-primary-foreground/80 mt-3 text-lg">
            Your home-style meals are waiting for you.
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

          <h1 className="font-heading text-3xl font-bold text-foreground">Log In</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Enter your credentials to access your account.
          </p>

          <form className="mt-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <Label htmlFor="email" className="text-foreground/80">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" className="mt-1.5 h-12 rounded-xl glass-subtle border-border/50 focus:border-primary/50" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground/80">Password</Label>
                <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
              </div>
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
                Log In
              </Button>
            </motion.div>
          </form>

          <p className="text-sm text-muted-foreground mt-8 text-center">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
