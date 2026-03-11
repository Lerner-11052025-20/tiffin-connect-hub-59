import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowLeft, Zap, Mail, Lock, User, Phone, ChefHat, UserRound } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

const roles = [
  { value: "user", label: "Customer", icon: UserRound, desc: "Order fresh home meals daily" },
  { value: "vendor", label: "Tiffin Provider", icon: ChefHat, desc: "Sell homemade meals to nearby customers" },
];

export default function Register() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [role, setRole] = useState("user");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/register", { email, password, full_name: fullName, phone, role });
      toast.success("Account created! Please log in.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-background selection:bg-primary/30">
      {/* Left panel - Visual Branding */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 relative flex-col items-center justify-center overflow-hidden bg-zinc-950 dark:bg-zinc-950/95 border-r border-border/5">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div
            className="absolute top-[-5%] left-[-15%] w-[45vw] h-[45vw] max-w-[650px] max-h-[650px] rounded-full bg-emerald-500/15 opacity-50"
          />
          <div
            className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-primary/20 opacity-50"
          />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-lg px-8 lg:px-12">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/30 border border-white/10">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="font-heading font-black text-3xl text-white tracking-tight">
              Tiffin<span className="text-primary/90">Connect</span>
            </span>
          </div>

          <div className="text-center w-full">
            <h2 className="text-4xl xl:text-5xl font-bold tracking-tight text-white mb-6 leading-[1.15]">
              Join the Tiffin <br /> Revolution
            </h2>
            <p className="text-zinc-400 text-lg mx-auto max-w-[85%] font-medium">
              Start ordering delicious meals or become a provider to share your home-cooked magic with others.
            </p>
          </div>

          <div className="relative w-full h-[220px] mt-16 pointer-events-none">
            <div className="absolute left-[5%] top-4 bg-zinc-900 border border-white/10 p-4 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex items-center gap-4 w-[200px]">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400/20 to-purple-600/20 flex items-center justify-center text-xl shadow-inner border border-white/5">🫓</div>
              <div className="flex-1">
                <div className="h-2 w-[70%] bg-zinc-500 rounded-full mb-2.5"></div>
                <div className="h-2 w-[40%] bg-zinc-700 rounded-full"></div>
              </div>
            </div>

            <div className="absolute right-[5%] top-16 bg-zinc-900 border border-white/10 p-4 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex items-center gap-4 w-[220px] z-10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400/20 to-blue-600/20 flex items-center justify-center text-xl shadow-inner border border-white/5">👨‍🍳</div>
              <div className="flex-1">
                <div className="h-2 w-[80%] bg-zinc-500 rounded-full mb-2.5"></div>
                <div className="h-2 w-[50%] bg-zinc-700 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - Form Section */}
      <div className="flex-1 flex flex-col justify-start items-center px-6 py-10 sm:px-12 sm:py-12 relative bg-zinc-50 dark:bg-zinc-950 overflow-y-auto overflow-x-hidden">
        <div className="w-full max-w-[460px] lg:hidden flex items-center gap-3 mb-8 mt-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="font-heading font-black text-2xl text-foreground tracking-tight">
            Tiffin<span className="text-primary">Connect</span>
          </span>
        </div>

        <div className="w-full max-w-[460px] pb-10">
          <Link to="/#hero" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm font-medium">
            <div className="w-6 h-6 rounded-full bg-zinc-200/50 dark:bg-zinc-800/50 flex items-center justify-center">
              <ArrowLeft className="h-3 w-3" />
            </div>
            Back to home
          </Link>

          <div className="bg-white dark:bg-zinc-900 p-8 sm:p-10 rounded-[2rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] border border-border/40 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-foreground/10 dark:via-white/15 to-transparent"></div>

            <div className="mb-6">
              <h1 className="font-heading text-3xl font-bold text-foreground mb-2 leading-tight">Create Account</h1>
              <p className="text-[15px] text-muted-foreground">Select a role to get started with TIFFINCONNECT.</p>
            </div>

            {/* Role Selection */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              {roles.map((r) => {
                const isSelected = role === r.value;
                const Icon = r.icon;
                return (
                  <button
                    type="button"
                    key={r.value}
                    onClick={() => setRole(r.value)}
                    className={`flex-1 flex flex-col items-start text-left rounded-2xl p-4 relative overflow-hidden border ${isSelected
                        ? "bg-primary/5 dark:bg-primary/10 border-primary shadow-[0_4px_20px_-5px_rgba(var(--primary),0.3)] ring-1 ring-primary/20"
                        : "bg-zinc-50 dark:bg-zinc-900/50 border-border/60 hover:border-border hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                      }`}
                  >
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary/5 opacity-50 pointer-events-none" />
                    )}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${isSelected ? "bg-primary/20 text-primary" : "bg-zinc-200 dark:bg-zinc-800 text-muted-foreground"
                      }`}>
                      <Icon size={20} strokeWidth={isSelected ? 2.5 : 2} />
                    </div>
                    <span className={`text-[15px] font-bold block mb-1 ${isSelected ? "text-primary" : "text-foreground"}`}>
                      {r.label}
                    </span>
                    <span className="text-[12px] text-muted-foreground font-medium leading-snug block">
                      {r.desc}
                    </span>
                  </button>
                )
              })}
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2 relative">
                <Label htmlFor="fullname" className="text-foreground/80 text-[13px] font-bold uppercase tracking-wider ml-1">Full Name</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <User className="h-4 w-4" />
                  </div>
                  <Input
                    id="fullname"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-12 pl-10 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border-border/60 focus:bg-white dark:focus:bg-zinc-900 focus:border-primary focus:ring-4 focus:ring-primary/10 text-[15px]"
                  />
                </div>
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="email" className="text-foreground/80 text-[13px] font-bold uppercase tracking-wider ml-1">Email Address</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <Mail className="h-4 w-4" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 pl-10 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border-border/60 focus:bg-white dark:focus:bg-zinc-900 focus:border-primary focus:ring-4 focus:ring-primary/10 text-[15px]"
                  />
                </div>
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="phone" className="text-foreground/80 text-[13px] font-bold uppercase tracking-wider ml-1">Phone <span className="text-muted-foreground font-normal lowercase tracking-normal">(optional)</span></Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <Phone className="h-4 w-4" />
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-12 pl-10 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border-border/60 focus:bg-white dark:focus:bg-zinc-900 focus:border-primary focus:ring-4 focus:ring-primary/10 text-[15px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 relative">
                  <Label htmlFor="password" className="text-foreground/80 text-[13px] font-bold uppercase tracking-wider ml-1">Password</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                      <Lock className="h-4 w-4" />
                    </div>
                    <Input
                      id="password"
                      type={showPass ? "text" : "password"}
                      placeholder="Min 6 chars"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 pl-10 pr-10 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border-border/60 focus:bg-white dark:focus:bg-zinc-900 focus:border-primary focus:ring-4 focus:ring-primary/10 text-[15px] font-medium tracking-wide"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-foreground"
                      onClick={() => setShowPass(!showPass)}
                    >
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 relative">
                  <Label htmlFor="confirmPassword" className="text-foreground/80 text-[13px] font-bold uppercase tracking-wider ml-1 leading-tight">Confirm Password</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                      <Lock className="h-4 w-4" />
                    </div>
                    <Input
                      id="confirmPassword"
                      type={showConfirmPass ? "text" : "password"}
                      placeholder="Match password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`h-12 pl-10 pr-10 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 text-[15px] font-medium tracking-wide ${confirmPassword && confirmPassword !== password ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10" : "border-border/60 focus:border-primary focus:ring-primary/10"}`}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-foreground"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                    >
                      {showConfirmPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl text-white bg-primary hover:bg-primary/90 shadow-[0_8px_20px_-6px_rgba(var(--primary),0.5)] text-[15px] font-semibold relative overflow-hidden border border-white/10 w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </div>
                  ) : "Create Account"}
                </Button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-border/50 text-center">
              <p className="text-[14px] text-muted-foreground font-medium">
                Already have an account?{" "}
                <Link to="/login" className="text-foreground font-bold hover:text-primary ml-1 inline-flex items-center gap-1">
                  Log In
                  <span className="inline-block">→</span>
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground/60 font-medium">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
