import { UserPlus, Utensils, CreditCard, Truck, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: UserPlus,
    title: "Create Profile",
    description: "Join our exclusive network of food enthusiasts. Secure, verified, and personalized to your tastes.",
    number: "01",
  },
  {
    icon: Utensils,
    title: "Curate Menu",
    description: "Hand-pick your daily ingredients. From grains to proteins, you are the master of your plate.",
    number: "02",
  },
  {
    icon: CreditCard,
    title: "Reserve Plan",
    description: "Select from flexible daily or monthly memberships with zero long-term commitment.",
    number: "03",
  },
  {
    icon: Truck,
    title: "Timed Arrival",
    description: "Experience the elegance of surgical punctuality. Freshly cooked, delivered exactly as promised.",
    number: "04",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-12 md:py-20 relative overflow-hidden bg-transparent">
      <div className="bg-mesh opacity-20" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col gap-5 mb-10">
          <div className="badge-premium border-primary/20 bg-primary/5 w-fit">
            <span>The Methodology</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-end">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-[1.2] text-foreground max-w-xl">
              Elevating the <span className="text-primary font-extrabold uppercase tracking-tight">Daily Ritual</span>
              <br /> of Dining.
            </h2>
            <p className="max-w-md text-sm md:text-base text-muted-foreground/60 font-medium pb-1">
              A seamless integration of local culinary mastery and modern logistics,
              refined for those who value time and health.
            </p>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6, ease: "easeOut" }}
              className="relative"
            >
              {/* Card */}
              <div className="premium-card h-full flex flex-col gap-6 p-10 shadow-2xl relative group">
                {/* Large Background Number */}
                <div className="step-number-bg">
                   {step.number}
                </div>

                {/* Icon Container */}
                <div className="icon-box-premium relative z-10 transition-transform duration-500 group-hover:scale-110">
                  <step.icon className="h-7 w-7 stroke-[2.5]" />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-5 relative z-10 mt-4">
                  <h3 className="text-2xl font-bold tracking-tight text-foreground leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-base font-medium text-muted-foreground/60 leading-relaxed max-w-[90%]">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Context */}
        <div className="mt-16 pt-6 border-t border-white/5 flex flex-wrap justify-between items-center gap-6 opacity-40">
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em]">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>Mobile Verified Checkout</span>
          </div>
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em]">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>Encrypted Data Privacy</span>
          </div>
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em]">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>Priority Support Access</span>
          </div>
        </div>
      </div>
    </section>
  );
}
