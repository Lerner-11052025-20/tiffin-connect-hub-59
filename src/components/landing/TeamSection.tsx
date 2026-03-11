import { motion } from "framer-motion";
import { Linkedin, Twitter, Github } from "lucide-react";

const team = [
  {
    name: "Vikram Malhotra",
    role: "Founder & CEO",
    bio: "Visionary leader with 15+ years in high-end hospitality and logistics tech.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop"
  },
  {
    name: "Ananya Sharma",
    role: "Chief Culinary Officer",
    bio: "Expert nutritionist and former executive chef focused on artisanal home cooking.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop"
  },
  {
    name: "Siddharth Raj",
    role: "Head of Operations",
    bio: "Logistics specialist ensuring surgical punctuality across our entire delivery network.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&auto=format&fit=crop"
  }
];

export default function TeamSection() {
  return (
    <section className="py-12 md:py-20 relative overflow-hidden bg-transparent">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center gap-4 mb-12">
          <div className="badge-premium border-primary/20 bg-primary/5">
            <span>Leadership Architecture</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
            Meet the <span className="text-primary font-extrabold uppercase tracking-tight">Visionaries</span> <br />
            Behind TiffinConnect.
          </h2>
          <p className="max-w-xl text-sm md:text-base text-muted-foreground/60 font-medium leading-relaxed mt-2">
            A diverse collective of culinary experts, logistics masters, and tech innovators 
            dedicated to redefining your terminal-to-table experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-10">
          {team.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.6 }}
            >
              <div className="premium-card flex flex-col items-center text-center gap-6 p-8 shadow-xl">
                <div className="relative">
                  <div className="w-[100px] h-[100px] rounded-[1.5rem] overflow-hidden border-2 border-emerald-500/10 shadow-emerald-500/10 shadow-xl">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-foreground tracking-tight">{member.name}</h3>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">{member.role}</p>
                  </div>
                  <p className="text-[13px] font-medium text-muted-foreground/60 leading-relaxed max-w-xs">
                    {member.bio}
                  </p>
                </div>

                <div className="flex items-center gap-6 pt-5 border-t border-border w-full justify-center opacity-30">
                  <Linkedin className="w-4 h-4 text-foreground" />
                  <Twitter className="w-4 h-4 text-foreground" />
                  <Github className="w-4 h-4 text-foreground" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
