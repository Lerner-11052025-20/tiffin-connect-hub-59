import { Button } from "@/components/ui/button-premium";
import { Check, Crown, Zap, ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Standard Pass",
    price: "80",
    period: "/meal",
    description: "Curated for the infrequent connoisseur who values quality on demand.",
    features: ["Single Service (Lunch/Dinner)", "Bespoke Customization", "Real-Time Tracking", "Priority Dispatch", "No Retainer Required"],
    accent: "bg-muted",
    isPremium: false,
  },
  {
    name: "Executive Weekly",
    price: "499",
    period: "/week",
    description: "The professional's choice for a balanced, health-conscious work week.",
    features: ["L+D Dual Service", "Full Customization daily", "Priority Logistics", "10% Retainer Savings", "Concierge Scheduling", "Pause Anytime"],
    accent: "bg-primary",
    isPremium: true,
    badge: "Most Refined",
  },
  {
    name: "Elite Monthly",
    price: "1,799",
    period: "/month",
    description: "Our most exclusive membership for those uncompromising on their lifestyle.",
    features: ["30-Day L+D Retention", "VIP Concierge Support", "Express Priority Delivery", "25% Maximum Savings", "Nutrition Consultation", "Flexible Menu Freezes"],
    accent: "bg-muted",
    isPremium: false,
    badge: "Best Value",
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-12 md:py-20 relative overflow-hidden bg-transparent">
      <div className="bg-mesh opacity-20" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-12">
          <div className="badge-premium border-primary/20 bg-primary/5">
            <span>Membership Protocol</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight text-foreground">
            Sovereign <span className="text-primary font-extrabold uppercase tracking-tight">Investment</span>. <br />
            Total Scalability.
          </h2>

          <p className="max-w-xl text-sm md:text-base text-muted-foreground/60 font-medium leading-relaxed mt-2">
            Select an operational tier that fulfills your culinary requirements.
            Every plan is powered by our high-performance logistics network.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto items-stretch">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.6 }}
              className="h-full"
            >
              <div
                className={`premium-card h-full flex flex-col p-10 shadow-2xl ${plan.isPremium ? "border-emerald-500/60 ring-1 ring-emerald-500/20 bg-emerald-500/[0.02]" : ""}`}
              >
                <div className="flex flex-col gap-8 h-full">
                  {/* Plan Top */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-500">
                        {plan.name}
                      </h3>
                      {plan.badge && (
                        <span className="bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-[0.1em] px-3 py-1 rounded-full border border-emerald-500/20">
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-foreground tracking-tighter">₹{plan.price}</span>
                      <span className="text-xs font-bold text-muted-foreground/30 uppercase tracking-widest">{plan.period}</span>
                    </div>
                    <p className="text-[13px] font-medium text-muted-foreground/60 leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  {/* Divider Line */}
                  <div className="h-px w-full bg-border/40" />

                  {/* Features List */}
                  <div className="flex flex-col gap-5 flex-grow">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/20">Network Features</p>
                    <ul className="space-y-4">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-4 text-[13px] font-bold text-foreground/70">
                          <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 shrink-0 shadow-inner">
                            <Check className="w-3 h-3 stroke-[3.5]" />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action */}
                  <Button
                    variant={plan.isPremium ? "default" : "outline"}
                    className={`w-full h-12 rounded-xl font-bold transition-none border-none ${plan.isPremium ? "bg-primary text-white shadow-2xl shadow-primary/20" : "bg-muted text-foreground"}`}
                    asChild
                  >
                    <Link to="/register" className="flex items-center justify-center gap-2.5">
                      <span className="text-sm">Secure Enrollment</span>
                       <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Closing Trust Section */}
        <div className="mt-24 text-center">
          <div className="inline-flex items-center gap-12 opacity-60">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">PCI Licensed</span>
            </div>
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Quality Insured</span>
            </div>
            <div className="flex items-center gap-2 text-primary">
              <Zap className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Instant Activation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
