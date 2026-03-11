import { Button } from "@/components/ui/button-premium";
import { Link } from "react-router-dom";
import { ArrowRight, Utensils, Star, ShieldCheck, Zap, Activity, Users, ChefHat } from "lucide-react";
import { motion } from "framer-motion";
import NumberTicker from "@/components/ui/number-ticker";

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-[85vh] flex items-center pt-36 pb-16 overflow-hidden bg-transparent">
      {/* Background Architecture */}
      <div className="bg-mesh opacity-20" />
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 items-center">

          {/* Left Content: High-Performance Messaging */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            <div className="flex flex-col gap-4">
              <div className="badge-premium w-fit border-emerald-500/20 bg-emerald-500/5">
                <span className="flex items-center gap-2">
                  <Activity className="w-3 h-3 text-emerald-500" />
                  Live Operational Hub
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold tracking-tight leading-[1.2] text-foreground">
                  The <span className="text-primary font-extrabold uppercase tracking-tighter">Operating System</span> <br />
                  For Your Daily Meals.
                </h1>

                <p className="max-w-2xl text-sm md:text-base text-muted-foreground/60 font-medium leading-relaxed">
                  Precision logistics meets artisanal cooking. Experience the first enterprise-grade 
                  tiffin ecosystem designed for the modern professional. Join 2,500+ verified members.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button size="xl" className="bg-primary text-white rounded-xl px-10 h-14 font-bold shadow-2xl shadow-primary/20 border-none transition-none" asChild>
                <Link to="/register" className="flex items-center gap-3">
                  <span>Initialize Account</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>

              <Button size="xl" variant="outline" className="rounded-xl font-bold border-white/10 bg-white/5 transition-none px-8 h-14 text-foreground" asChild>
                <a href="#how-it-works">Systems Protocol</a>
              </Button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-white/5 max-w-2xl">
              <div className="flex flex-col gap-1">
                <div className="text-2xl font-black text-foreground tracking-tighter flex items-center gap-1.5">
                  <NumberTicker value={2500} />
                  <span className="text-primary text-lg">+</span>
                </div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Active Nodes</p>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-2xl font-black text-foreground tracking-tighter flex items-center gap-1.5">
                  <NumberTicker value={150} />
                  <span className="text-primary text-lg">+</span>
                </div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Verified Units</p>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-2xl font-black text-foreground tracking-tighter flex items-center gap-1.5">
                  <NumberTicker value={99} />
                  <span className="text-primary text-lg">%</span>
                </div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Uptime Score</p>
              </div>
            </div>
          </motion.div>

          {/* Right Content: Dashboard Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="premium-card-glass border-border/40 bg-card/60 shadow-xl p-0 overflow-hidden min-h-[440px] flex flex-col">
              {/* Dashboard Header Bar */}
              <div className="h-12 border-b border-border/40 bg-muted/10 flex items-center justify-between px-6">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500/20" />
                  <div className="w-2 h-2 rounded-full bg-amber-500/20" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500/20" />
                </div>
                <div className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/30">Terminal Version 2.0</div>
              </div>

              {/* Terminal Content */}
              <div className="p-6 space-y-6 flex-1">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-foreground">Operational Status</h3>
                    <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                      <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500">Active</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-muted/20 border border-border/40">
                      <Users className="w-3.5 h-3.5 text-primary mb-2" />
                      <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/30 mb-1">New Users</p>
                      <p className="text-lg font-bold text-foreground">+124</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/20 border border-border/40">
                      <ChefHat className="w-3.5 h-3.5 text-emerald-500 mb-2" />
                      <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/30 mb-1">Live Kitchens</p>
                      <p className="text-lg font-bold text-foreground">84</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                   <h3 className="text-base font-bold text-foreground tracking-tight">Recent Activity</h3>
                   <div className="space-y-2">
                      {[
                        { title: "Order #8429", desc: "Out for delivery", time: "2m ago" },
                        { title: "Chef Verified", desc: "Premium Unit #12", time: "15m ago" },
                        { title: "Plan Secured", desc: "User 'Alpha' joined", time: "44m ago" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3.5 rounded-lg bg-muted/20 border border-border/20">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center text-primary text-[9px] font-black">
                              {item.title.split('#')[1]?.[0] || 'V'}
                            </div>
                            <div>
                              <p className="text-[11px] font-bold text-foreground">{item.title}</p>
                              <p className="text-[9px] text-muted-foreground/50">{item.desc}</p>
                            </div>
                          </div>
                          <span className="text-[8px] font-black text-muted-foreground/20 uppercase">{item.time}</span>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>

            {/* Float Decoration */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-[60px] -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

