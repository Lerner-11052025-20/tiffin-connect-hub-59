import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rohan Khanna",
    location: "Mumbai",
    text: "The precision of delivery and the consistency of taste is something I've never experienced before with tiffin services. Truly premium.",
    rating: 5,
    initials: "RK"
  },
  {
    name: "Ishita Verma",
    location: "Bangalore",
    text: "Being a fitness enthusiast, the ability to exclude specific ingredients from my meals is a game-changer. TiffinConnect understands my needs.",
    rating: 5,
    initials: "IV"
  },
  {
    name: "Sameer Joshi",
    location: "Delhi",
    text: "As a busy professional, the Executive Weekly plan has saved me hours of decision fatigue. The food feels like it's from a luxury kitchen.",
    rating: 5,
    initials: "SJ"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-12 md:py-20 relative overflow-hidden bg-transparent">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center gap-4 mb-12">
          <div className="badge-premium border-primary/20 bg-primary/5">
            <span>Verified Testimonials</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
            Global <span className="text-primary font-extrabold uppercase tracking-tight">Consensus</span>.
          </h2>
          <p className="max-w-xl text-sm md:text-base text-muted-foreground/60 font-medium leading-relaxed mt-2">
            Hear from our elite member network of professionals who have 
            already transformed their daily nutritional systems.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto px-10">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.6 }}
            >
              <div className="premium-card h-full flex flex-col gap-8 p-8 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-[1rem] bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-black border border-emerald-500/20 shadow-xl shadow-emerald-500/5 text-sm">
                    {t.initials}
                  </div>
                  <div className="flex gap-1 opacity-40">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <Quote className="absolute -top-3 -left-1.5 w-6 h-6 text-primary/5 -z-10" />
                  <p className="text-sm text-muted-foreground/60 font-medium leading-relaxed">
                    "{t.text}"
                  </p>
                </div>

                <div className="pt-6 border-t border-border mt-auto">
                  <p className="text-base font-bold text-foreground tracking-tight">{t.name}</p>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary mt-1">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
