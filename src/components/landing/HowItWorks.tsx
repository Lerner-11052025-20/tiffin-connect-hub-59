import { motion } from "framer-motion";
import { UserPlus, UtensilsCrossed, CreditCard, Truck } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Sign Up",
    description: "Create your free account in seconds with email or phone.",
    color: "from-primary to-primary",
  },
  {
    icon: UtensilsCrossed,
    title: "Customize Menu",
    description: "Pick your meals — roti, rice, dal, sabji, salad and add-ons.",
    color: "from-accent to-accent",
  },
  {
    icon: CreditCard,
    title: "Choose Plan & Pay",
    description: "Select daily, weekly, or monthly plan. Pay securely online.",
    color: "from-info to-info",
  },
  {
    icon: Truck,
    title: "Get Delivered",
    description: "Track your tiffin in real-time. Enjoy fresh, home-style food!",
    color: "from-success to-success",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/[0.03] blur-[120px]" />
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
            ✨ Simple Process
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mt-7">
            How TiffinConnect Works
          </h2>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto text-base">
            Four easy steps to start enjoying daily home-cooked meals.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection line */}
          <div className="absolute top-12 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent hidden lg:block" />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.08, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-24 h-24 mx-auto rounded-3xl gradient-hero flex items-center justify-center shadow-glow mb-7 relative"
              >
                <step.icon className="h-10 w-10 text-primary-foreground" />
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-card shadow-card flex items-center justify-center text-xs font-bold text-primary border-2 border-primary/20">
                  {i + 1}
                </div>
              </motion.div>

              <h3 className="font-heading font-bold text-lg text-foreground">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-[220px] mx-auto leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
