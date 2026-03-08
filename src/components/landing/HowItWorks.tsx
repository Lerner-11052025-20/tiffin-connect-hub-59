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
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/[0.03] blur-[100px]" />
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-widest glass-subtle rounded-full px-4 py-2">
            Simple Process
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-6">
            How TiffinConnect Works
          </h2>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto">
            Four easy steps to start enjoying daily home-cooked meals.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection line */}
          <div className="absolute top-10 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent hidden lg:block" />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="relative text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-20 h-20 mx-auto rounded-2xl gradient-hero flex items-center justify-center shadow-glow mb-6 relative"
              >
                <step.icon className="h-8 w-8 text-primary-foreground" />
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-card shadow-card flex items-center justify-center text-xs font-bold text-primary border border-primary/20">
                  {i + 1}
                </div>
              </motion.div>

              <h3 className="font-heading font-semibold text-lg text-foreground">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-[200px] mx-auto">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
