import { motion } from "framer-motion";
import { CalendarDays, ChefHat, MapPin, Shield, Smartphone, Utensils } from "lucide-react";

const features = [
  { icon: Utensils, title: "Menu Customization", desc: "Choose your roti, rice, dal, sabji, salad, and add-ons every day.", gradient: "from-primary/10 to-primary/5" },
  { icon: CalendarDays, title: "Flexible Meal Plans", desc: "Daily, weekly, or monthly subscriptions. Pause or cancel anytime.", gradient: "from-accent/10 to-accent/5" },
  { icon: MapPin, title: "Reliable Delivery", desc: "Track your tiffin delivery in real-time on an interactive map.", gradient: "from-info/10 to-info/5" },
  { icon: ChefHat, title: "Local Tiffin Providers", desc: "All vendors are verified for hygiene, quality, and reliability.", gradient: "from-primary/10 to-accent/5" },
  { icon: Shield, title: "Secure Payments", desc: "Pay safely with UPI, cards, or net banking via Razorpay.", gradient: "from-success/10 to-primary/5" },
  { icon: Smartphone, title: "Mobile Friendly", desc: "Order from any device. Fully responsive, fast experience.", gradient: "from-accent/10 to-info/5" },
];

export default function FeaturesSection() {
  return (
    <section id="about" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 dot-pattern" />
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-accent/[0.04] blur-[100px]" />
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
            🚀 Features
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mt-7">
            Why Choose TiffinConnect?
          </h2>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto text-base">
            Everything you need for convenient daily meal delivery.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`glass-card rounded-3xl p-8 hover:shadow-card-hover transition-all duration-400 group cursor-default bg-gradient-to-br ${f.gradient}`}
            >
              <motion.div
                whileHover={{ rotate: 8, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:gradient-hero group-hover:shadow-glow transition-all duration-400"
              >
                <f.icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors duration-400" />
              </motion.div>
              <h3 className="font-heading font-bold text-foreground text-lg">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
