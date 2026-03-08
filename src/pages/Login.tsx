import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,hsl(40_100%_67%/0.3),transparent_60%)]" />
        <div className="relative z-10 text-center px-12">
          <span className="text-8xl block mb-6">🍱</span>
          <h2 className="font-heading text-3xl font-bold text-primary-foreground">Welcome Back!</h2>
          <p className="text-primary-foreground/80 mt-3 text-lg">
            Your home-style meals are waiting for you.
          </p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="flex items-center gap-2 mb-8">
            <span className="text-2xl">🍱</span>
            <span className="font-heading font-bold text-xl text-foreground">
              TIFFIN<span className="text-primary">CONNECT</span>
            </span>
          </Link>

          <h1 className="font-heading text-2xl font-bold text-foreground">Log In</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your credentials to access your account.
          </p>

          <form className="mt-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1.5">
                <Input id="password" type={showPass ? "text" : "password"} placeholder="••••••••" />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button variant="hero" className="w-full" size="lg">
              Log In
            </Button>
          </form>

          <p className="text-sm text-muted-foreground mt-6 text-center">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Sign Up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
