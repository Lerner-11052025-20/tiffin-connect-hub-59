import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

const roles = [
  { value: "user", label: "Customer", emoji: "🍽️" },
  { value: "vendor", label: "Tiffin Provider", emoji: "👨‍🍳" },
];

export default function Register() {
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState("user");

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(18_100%_60%/0.2),transparent_60%)]" />
        <div className="relative z-10 text-center px-12">
          <span className="text-8xl block mb-6">👨‍🍳</span>
          <h2 className="font-heading text-3xl font-bold text-secondary-foreground">Join TiffinConnect</h2>
          <p className="text-secondary-foreground/70 mt-3 text-lg">
            Start ordering or start serving delicious home meals.
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

          <h1 className="font-heading text-2xl font-bold text-foreground">Create Account</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign up to get started with TiffinConnect.
          </p>

          {/* Role selector */}
          <div className="flex gap-3 mt-6">
            {roles.map((r) => (
              <button
                key={r.value}
                onClick={() => setRole(r.value)}
                className={`flex-1 rounded-xl border-2 p-4 text-center transition-all ${
                  role === r.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <span className="text-2xl block">{r.emoji}</span>
                <span className="text-sm font-medium text-foreground mt-1 block">{r.label}</span>
              </button>
            ))}
          </div>

          <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fname">First Name</Label>
                <Input id="fname" placeholder="John" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="lname">Last Name</Label>
                <Input id="lname" placeholder="Doe" className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" placeholder="+91 98765 43210" className="mt-1.5" />
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
              Create Account
            </Button>
          </form>

          <p className="text-sm text-muted-foreground mt-6 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Log In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
