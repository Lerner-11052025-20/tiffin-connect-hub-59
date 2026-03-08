import { motion } from "framer-motion";
import { CalendarDays, ChefHat, MapPin, Shield, Smartphone, Utensils } from "lucide-react";

const features = [
  { icon: Utensils, title: "Menu Customization", desc: "Choose your roti, rice, dal, sabji, salad, and add-ons every day." },
  { icon: CalendarDays, title: "Flexible Meal Plans", desc: "Daily, weekly, or monthly subscriptions. Pause or cancel anytime." },
  { icon: MapPin, title: "Reliable Delivery", desc: "Track your tiffin delivery in real-time on an interactive map." },
  { icon: ChefHat, title: "Local Tiffin Providers", desc: "All vendors are verified for hygiene, quality, and reliability." },
  { icon: Shield, title: "Secure Payments", desc: "Pay safely with UPI, cards, or net banking via Razorpay." },
  { icon: Smartphone, title: "Mobile Friendly", desc: "Order from any device. Fully responsive, fast experience." },
];

export default function FeaturesSection() {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-accent/[0.04] blur-[80px]" />
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary uppercase tracking-widest glass-subtle rounded-full px-4 py-2">
            Features
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-6">
            Why Choose TiffinConnect?
          </h2>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto">
            Everything you need for convenient daily meal delivery.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="glass-card rounded-2xl p-7 hover:shadow-card-hover transition-all duration-300 group cursor-default"
            >
              <motion.div
                whileHover={{ rotate: 8, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:gradient-hero group-hover:shadow-glow transition-all duration-300"
              >
                <f.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </motion.div>
              <h3 className="font-heading font-semibold text-foreground text-lg">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
