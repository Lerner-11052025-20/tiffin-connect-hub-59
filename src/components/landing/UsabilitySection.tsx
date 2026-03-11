import { motion } from "framer-motion";
import { MousePointer2, Zap, Layout, ShieldCheck, Heart } from "lucide-react";

const usabilityFeatures = [
  {
    icon: Zap,
    title: "One-Tap Control",
    desc: "Pause, skip, or modify your subscription with a single tap in your dashboard. Zero complexity, total control."
  },
  {
    icon: Layout,
    title: "Intuitive Interface",
    desc: "A clean, dark-mode first design that prioritizes your biological needs without visual noise."
  },
  {
    icon: ShieldCheck,
    title: "Predictive Logistics",
    desc: "Our AI accurately predicts delivery times, keeping you updated with surgical precision."
  },
  {
    icon: Heart,
    title: "Preference Memory",
    desc: "We remember your dietary exclusion rules automatically across all your orders. It just works."
  }
];

export default function UsabilitySection() {
  return (
    <section className="py-12 md:py-20 relative overflow-hidden bg-transparent">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col gap-4 mb-12 text-center items-center">
          <div className="badge-premium border-emerald-500/20 bg-emerald-500/5">
            <span>Operational UI/UX</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
            Designed For <span className="text-primary font-extrabold uppercase tracking-tight">High-Performance</span> <br />
            Member Portals.
          </h2>
          <p className="max-w-xl text-sm md:text-base text-muted-foreground/60 font-medium leading-relaxed mt-2">
            Every interaction is engineered to the same precision as our logistics network, 
            eliminating friction from your daily nutritional planning.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 px-10">
          {usabilityFeatures.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="premium-card p-10 flex flex-col gap-6 shadow-2xl group"
            >
              <div className="icon-box-premium transition-transform duration-500 group-hover:scale-110">
                <feature.icon className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground tracking-tight">{feature.title}</h3>
                <p className="text-[15px] font-medium text-muted-foreground/60 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
