import { motion } from "framer-motion";
import { UserPlus, UtensilsCrossed, CreditCard, Truck } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Sign Up",
    description: "Create your free account in seconds with email or phone.",
  },
  {
    icon: UtensilsCrossed,
    title: "Customize Menu",
    description: "Pick your meals — roti, rice, dal, sabji, salad and add-ons.",
  },
  {
    icon: CreditCard,
    title: "Choose Plan & Pay",
    description: "Select daily, weekly, or monthly plan. Pay securely online.",
  },
  {
    icon: Truck,
    title: "Get Delivered",
    description: "Track your tiffin in real-time. Enjoy fresh, home-style food!",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wide">
            Simple Process
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2">
            How TiffinConnect Works
          </h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            Four easy steps to start enjoying daily home-cooked meals.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative text-center group"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl gradient-hero flex items-center justify-center shadow-hero mb-5 group-hover:scale-110 transition-transform">
                <step.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <div className="absolute top-8 left-1/2 w-full h-px bg-border -z-10 hidden lg:block last:hidden" />
              <span className="text-xs font-bold text-primary mb-2 block">
                STEP {i + 1}
              </span>
              <h3 className="font-heading font-semibold text-lg text-foreground">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-2">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
