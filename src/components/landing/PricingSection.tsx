import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Daily",
    price: "₹80",
    period: "/meal",
    description: "Order one meal at a time",
    features: ["Choose lunch or dinner", "Customize your menu", "Map-based delivery", "Pay per order"],
    popular: false,
  },
  {
    name: "Weekly",
    price: "₹499",
    period: "/week",
    description: "7 days of delicious meals",
    features: ["Lunch + Dinner", "Full menu customization", "Priority delivery", "Save 10%", "Change menu daily"],
    popular: true,
  },
  {
    name: "Monthly",
    price: "₹1,799",
    period: "/month",
    description: "Best value for regulars",
    features: ["Lunch + Dinner", "Full menu customization", "Priority delivery", "Save 25%", "Pause anytime", "Dedicated chef"],
    popular: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/[0.03] blur-[120px]" />
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-widest glass-subtle rounded-full px-4 py-2">
            Pricing
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-6">
            Affordable Meal Plans
          </h2>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto">
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
              transition={{ delay: i * 0.12 }}
              whileHover={!plan.popular ? { y: -8, transition: { duration: 0.3 } } : undefined}
              className={`relative rounded-3xl p-8 transition-all duration-300 ${
                plan.popular
                  ? "glass-dark text-secondary-foreground shadow-hero scale-[1.04] ring-1 ring-primary/20 z-10"
                  : "glass-card hover:shadow-card-hover"
              }`}
            >
              {plan.popular && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-hero text-primary-foreground text-xs font-bold px-5 py-1.5 rounded-full shadow-glow flex items-center gap-1.5"
                >
                  <Sparkles className="h-3 w-3" />
                  Most Popular
                </motion.div>
              )}

              <h3 className={`font-heading font-bold text-xl ${plan.popular ? "" : "text-foreground"}`}>
                {plan.name}
              </h3>
              <p className={`text-sm mt-1 ${plan.popular ? "text-secondary-foreground/70" : "text-muted-foreground"}`}>
                {plan.description}
              </p>

              <div className="mt-8 mb-8">
                <span className="font-heading text-5xl font-extrabold tracking-tight">{plan.price}</span>
                <span className={`text-sm ml-1 ${plan.popular ? "text-secondary-foreground/60" : "text-muted-foreground"}`}>
                  {plan.period}
                </span>
              </div>

              <ul className="space-y-3 mb-10">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      plan.popular ? "bg-accent/20" : "bg-primary/10"
                    }`}>
                      <Check className={`h-3 w-3 ${plan.popular ? "text-accent" : "text-primary"}`} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant={plan.popular ? "accent" : "hero"}
                  className={`w-full rounded-xl ${plan.popular ? "shadow-glow-accent" : ""}`}
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
