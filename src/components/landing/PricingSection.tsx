import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Crown } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Daily",
    price: "₹80",
    period: "/meal",
    description: "Order one meal at a time",
    features: ["Choose lunch or dinner", "Customize your menu", "Map-based delivery", "Pay per order"],
    popular: false,
    icon: "🥗",
  },
  {
    name: "Weekly",
    price: "₹499",
    period: "/week",
    description: "7 days of delicious meals",
    features: ["Lunch + Dinner", "Full menu customization", "Priority delivery", "Save 10%", "Change menu daily"],
    popular: true,
    icon: "🍱",
  },
  {
    name: "Monthly",
    price: "₹1,799",
    period: "/month",
    description: "Best value for regulars",
    features: ["Lunch + Dinner", "Full menu customization", "Priority delivery", "Save 25%", "Pause anytime", "Dedicated chef"],
    popular: false,
    icon: "👨‍🍳",
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-primary/[0.03] blur-[150px]" />
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-[0.2em] glass-card rounded-full px-5 py-2.5 shadow-soft">
            💰 Pricing
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mt-7">
            Affordable Meal Plans
          </h2>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto text-base">
            Choose a plan that fits your lifestyle. Cancel or pause anytime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={!plan.popular ? { y: -8, transition: { duration: 0.3 } } : undefined}
              className={`relative rounded-3xl p-8 transition-all duration-400 ${
                plan.popular
                  ? "bg-secondary text-secondary-foreground shadow-hero scale-[1.04] ring-2 ring-primary/30 z-10"
                  : "glass-card hover:shadow-card-hover"
              }`}
            >
              {plan.popular && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 gradient-hero text-primary-foreground text-xs font-bold px-5 py-2 rounded-full shadow-glow flex items-center gap-1.5"
                >
                  <Crown className="h-3.5 w-3.5" />
                  Most Popular
                </motion.div>
              )}

              <div className="text-4xl mb-4">{plan.icon}</div>

              <h3 className={`font-heading font-bold text-xl ${plan.popular ? "" : "text-foreground"}`}>
                {plan.name}
              </h3>
              <p className={`text-sm mt-1.5 ${plan.popular ? "text-secondary-foreground/60" : "text-muted-foreground"}`}>
                {plan.description}
              </p>

              <div className="mt-8 mb-8">
                <span className="font-heading text-5xl font-extrabold tracking-tight">{plan.price}</span>
                <span className={`text-sm ml-1.5 ${plan.popular ? "text-secondary-foreground/50" : "text-muted-foreground"}`}>
                  {plan.period}
                </span>
              </div>

              <ul className="space-y-3.5 mb-10">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      plan.popular ? "bg-primary/20" : "bg-primary/10"
                    }`}>
                      <Check className={`h-3 w-3 ${plan.popular ? "text-primary" : "text-primary"}`} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant={plan.popular ? "hero" : "outline"}
                  className={`w-full rounded-2xl h-12 font-semibold ${plan.popular ? "shadow-glow" : "hover:bg-primary/5"}`}
                  size="lg"
                  asChild
                >
                  <Link to="/register">Subscribe Now</Link>
                </Button>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
