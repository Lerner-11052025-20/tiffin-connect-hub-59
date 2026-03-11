import { Button } from "@/components/ui/button-premium";
import { Link } from "react-router-dom";
import { ArrowRight, ChefHat, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="py-12 md:py-20 relative overflow-hidden bg-transparent">
      <div className="bg-mesh opacity-10" />

      <div className="container mx-auto px-10 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 15 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
        >
          {/* Main Card - Operational Architecture Look */}
          <div className="premium-card p-8 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
              <div className="flex-1 space-y-6 text-center lg:text-left">
                <div className="badge-premium border-emerald-500/20 bg-emerald-500/5 mx-auto lg:mx-0">
                  <span>Economic Prosperity Network</span>
                </div>

                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight text-foreground">
                    Scale Your <span className="text-primary font-extrabold uppercase tracking-tight">Kitchen</span> <br />
                    At Enterprise Velocity.
                  </h2>

                  <p className="max-w-xl text-base text-muted-foreground/60 font-medium leading-relaxed mx-auto lg:mx-0">
                    Join an elite network of culinary artisans. Leverage our high-performance 
                    logistics and premium member base to transform your operation.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-10 pt-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-3xl font-bold text-foreground tracking-tighter">150+</span>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Certified Hubs</span>
                  </div>
                   <div className="flex flex-col gap-1">
                    <span className="text-3xl font-bold text-foreground tracking-tighter">₹2.5M</span>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Monthly Settlements</span>
                  </div>
                </div>
              </div>

              <div className="lg:flex-shrink-0 flex flex-col gap-4 items-center">
                <Button
                  className="bg-primary text-white rounded-xl h-16 px-12 font-bold shadow-2xl shadow-primary/20 border-none min-w-[280px] transition-none"
                  asChild
                >
                  <Link to="/register?type=vendor" className="flex items-center justify-between w-full">
                    <span className="text-lg">Apply as Partner</span>
                    <ArrowRight className="w-5 h-5 ml-4" />
                  </Link>
                </Button>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30">
                    Onboarding response speed: &lt; 24h
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
