import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowLeft, Zap, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const data = await api.post<{ token: string; user: any }>("/auth/login", { email, password });
      setAuthUser(data.user, data.token);
      toast.success("Logged in successfully!");
      const map: Record<string, string> = { user: "/dashboard", vendor: "/vendor", admin: "/admin" };
      navigate(map[data.user.role] || "/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
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
            className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-primary/20 opacity-50"
          />
          <div
            className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-rose-500/15 opacity-50"
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
              Fresh Home Meals <br /> Delivered Daily
            </h2>
            <p className="text-zinc-400 text-lg mx-auto max-w-[85%] font-medium">
              Experience the taste of authentic, home-cooked food made with love and care, brought straight to your door.
            </p>
          </div>

          {/* Decorative Floating Cards */}
          <div className="relative w-full h-[220px] mt-16 pointer-events-none">
            <div className="absolute left-[5%] top-4 bg-zinc-900 border border-white/10 p-4 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex items-center gap-4 w-[200px]">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 flex items-center justify-center text-xl shadow-inner border border-white/5">🥗</div>
              <div className="flex-1">
                <div className="h-2 w-[70%] bg-zinc-500 rounded-full mb-2.5"></div>
                <div className="h-2 w-[40%] bg-zinc-700 rounded-full"></div>
              </div>
            </div>

            <div className="absolute right-[5%] top-16 bg-zinc-900 border border-white/10 p-4 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex items-center gap-4 w-[220px] z-10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400/20 to-orange-600/20 flex items-center justify-center text-xl shadow-inner border border-white/5">🥘</div>
              <div className="flex-1">
                <div className="h-2 w-[80%] bg-zinc-500 rounded-full mb-2.5"></div>
                <div className="h-2 w-[50%] bg-zinc-700 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - Form Section */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 sm:px-12 relative bg-zinc-50 dark:bg-zinc-950">
        {/* Mobile Header */}
        <div className="w-full max-w-[420px] lg:hidden flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="font-heading font-black text-2xl text-foreground tracking-tight">
            Tiffin<span className="text-primary">Connect</span>
          </span>
        </div>

        <div className="w-full max-w-[420px]">
          <Link to="/#hero" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 text-sm font-medium">
            <div className="w-6 h-6 rounded-full bg-zinc-200/50 dark:bg-zinc-800/50 flex items-center justify-center">
              <ArrowLeft className="h-3 w-3" />
            </div>
            Back to home
          </Link>

          <div className="bg-white dark:bg-zinc-900 p-8 sm:p-10 rounded-[2rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] border border-border/40 relative overflow-hidden">
            {/* Subtle top border for clean edge effect */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-foreground/10 dark:via-white/15 to-transparent"></div>

            <div className="mb-8">
              <h1 className="font-heading text-3xl font-bold text-foreground mb-2 mt-2 leading-tight">Welcome Back</h1>
              <p className="text-[15px] text-muted-foreground">Login to your TIFFINCONNECT account.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
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
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-foreground/80 text-[13px] font-bold uppercase tracking-wider">Password</Label>
                  <a href="#" className="text-[13px] text-primary font-semibold hover:text-primary/80">Forgot password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <Lock className="h-4 w-4" />
                  </div>
                  <Input
                    id="password"
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pl-10 pr-12 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border-border/60 focus:bg-white dark:focus:bg-zinc-900 focus:border-primary focus:ring-4 focus:ring-primary/10 text-[15px] font-medium tracking-wide"
                  />
                  <button
                    type="button"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-foreground"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
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
                      <span>Authenticating...</span>
                    </div>
                  ) : "Login"}
                </Button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-border/50 text-center">
              <p className="text-[14px] text-muted-foreground font-medium">
                Don't have an account?{" "}
                <Link to="/register" className="text-foreground font-bold hover:text-primary ml-1 inline-flex items-center gap-1">
                  Create one
                  <span className="inline-block">→</span>
                </Link>
              </p>
            </div>
          </div>

          {/* Subtle footer */}
          <div className="mt-10 text-center">
            <p className="text-xs text-muted-foreground/60 font-medium">
              By logging in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
