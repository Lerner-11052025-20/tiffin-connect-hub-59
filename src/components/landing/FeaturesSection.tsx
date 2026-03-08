import { motion } from "framer-motion";
import { CalendarDays, ChefHat, MapPin, Shield, Smartphone, Utensils } from "lucide-react";

const features = [
  { icon: Utensils, title: "Customizable Menus", desc: "Choose your roti, rice, dal, sabji, salad, and add-ons every day." },
  { icon: CalendarDays, title: "Flexible Plans", desc: "Daily, weekly, or monthly subscriptions. Pause or cancel anytime." },
  { icon: MapPin, title: "Live Tracking", desc: "Track your tiffin delivery in real-time on an interactive map." },
  { icon: ChefHat, title: "Verified Home Chefs", desc: "All vendors are verified for hygiene, quality, and reliability." },
  { icon: Shield, title: "Secure Payments", desc: "Pay safely with UPI, cards, or net banking via Razorpay." },
  { icon: Smartphone, title: "Mobile Friendly", desc: "Order from any device. Fully responsive, fast experience." },
];

export default function FeaturesSection() {
  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wide">Features</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mt-2">
            Why Choose TiffinConnect?
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:gradient-hero group-hover:text-primary-foreground transition-all">
                <f.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
              </div>
              <h3 className="font-heading font-semibold text-foreground text-lg">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
