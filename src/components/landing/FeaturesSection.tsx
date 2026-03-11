import { motion } from "framer-motion";
import { CalendarDays, ChefHat, MapPin, Shield, Smartphone, Utensils, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button-premium";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Utensils,
    title: "Culinary Individuality",
    desc: "We reject the one-size-fits-all approach. Every component of your meal is customizable, ensuring your plate reflects your unique health goals and palate.",
    benefits: ["Bespoke Portions", "Ingredient Exclusion", "Gourmet Substitutions"]
  },
  {
    icon: CalendarDays,
    title: "Sovereign Flexibility",
    desc: "Life is unpredictable; your meal plan shouldn't be. Pause, skip, or modify your subscription in real-time with our intuitive member dashboard.",
    benefits: ["Zero-Notice Pause", "Dynamic Scheduling", "No Commitment"]
  },
  {
    icon: MapPin,
    title: "Precision Logistics",
    desc: "Harness the power of surgical punctuality. Our proprietary tracking system ensures your meal arrives at the exact moment of culinary peak.",
    benefits: ["GPS Live Stream", "Push Notifications", "ETA Accuracy"]
  },
  {
    icon: ChefHat,
    title: "Master Artisan Cooks",
    desc: "We partner exclusively with verified local culinary masters who meet our uncompromising standards for hygiene, taste, and artisanal quality.",
    benefits: ["Quality Audited", "Verified Sanitation", "Small-Batch Cooking"]
  },
  {
    icon: Shield,
    title: "Fortified Security",
    desc: "Your data and financial security are our silent priorities. Experience seamless, encrypted transactions through our world-class payment gateway.",
    benefits: ["Bank-Grade Encryption", "Instant Receipts", "Privacy Guaranteed"]
  },
  {
    icon: Smartphone,
    title: "Digital Excellence",
    desc: "A mobile experience that feels natural. Manage your entire dining life from a fluid, responsive interface designed for the modern professional.",
    benefits: ["Native Performance", "Intelligent Reordering", "Sync Across Devices"]
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-12 md:py-20 relative overflow-hidden bg-transparent">
      <div className="bg-mesh opacity-20" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col gap-4 mb-10 max-w-4xl">
          <div className="badge-premium w-fit border-emerald-500/20 bg-emerald-500/5">
            <span>The Competitive Edge</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-[1.2] text-foreground">
            Engineering the <span className="text-primary font-extrabold uppercase tracking-tight">Perfect</span> <br />
            Dining Ecosystem.
          </h2>

          <p className="max-w-2xl text-sm md:text-base text-muted-foreground/60 font-medium leading-relaxed">
            We’ve deconstructed the traditional tiffin service and rebuilt it for the modern age,
            focusing on the three pillars of premium service: Quality, Flexibility, and Tech.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.6 }}
            >
              <div className="premium-card h-full flex flex-col gap-8 p-10 shadow-2xl relative group hover:bg-emerald-500/[0.02]">
                {/* Header Side-by-Side */}
                <div className="flex items-start justify-between relative z-10">
                  <div className="icon-box-premium transition-transform duration-500 group-hover:scale-110">
                    <feature.icon className="h-7 w-7 stroke-[2.5]" />
                  </div>
                  <div className="w-9 h-9 rounded-full border border-emerald-500/40 flex items-center justify-center text-emerald-500 bg-emerald-500/5 shadow-inner">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex flex-col gap-4 relative z-10">
                  <h3 className="text-2xl font-bold tracking-tight text-foreground leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-[15px] font-medium text-muted-foreground/60 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>

                {/* Divider Line */}
                <div className="h-px w-full bg-emerald-500/10 mt-auto relative z-10" />

                {/* Micro-Benefits */}
                <div className="flex flex-wrap gap-2.5 relative z-10">
                  {feature.benefits.map((benefit) => (
                    <span
                      key={benefit}
                      className="text-[10px] font-bold uppercase tracking-[0.12em] px-4 py-1.5 rounded-full bg-transparent border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/5 transition-colors cursor-default"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Closing Focus */}
        <div className="mt-16 p-8 lg:p-10 rounded-2xl bg-card border border-border relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center lg:text-left">
              <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">Scale your daily efficiency.</h3>
              <p className="text-sm text-muted-foreground/60 font-medium">Join 2,500+ professionals who have already reclaimed their time and health through our verified partner network.</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-foreground">Top Rated</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-primary">Trustpilot verified</p>
              </div>
              <Button size="xl" className="bg-primary text-white font-bold rounded-xl px-10 h-14 transition-none" asChild>
                 <Link to="/register">Join the Network</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
