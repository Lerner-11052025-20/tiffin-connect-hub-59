import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
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
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wide">
            Pricing
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2">
            Affordable Meal Plans
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            Choose a plan that fits your lifestyle. Cancel or pause anytime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl p-8 transition-all ${
                plan.popular
                  ? "bg-secondary text-secondary-foreground shadow-hero scale-105"
                  : "bg-card shadow-card hover:shadow-card-hover"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-bold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <h3 className={`font-heading font-bold text-xl ${plan.popular ? "" : "text-foreground"}`}>
                {plan.name}
              </h3>
              <p className={`text-sm mt-1 ${plan.popular ? "text-secondary-foreground/70" : "text-muted-foreground"}`}>
                {plan.description}
              </p>

              <div className="mt-6 mb-6">
                <span className="font-heading text-4xl font-extrabold">{plan.price}</span>
                <span className={`text-sm ${plan.popular ? "text-secondary-foreground/60" : "text-muted-foreground"}`}>
                  {plan.period}
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className={`h-4 w-4 flex-shrink-0 ${plan.popular ? "text-accent" : "text-primary"}`} />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? "accent" : "hero"}
                className="w-full"
                asChild
              >
                <Link to="/register">Get Started</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
