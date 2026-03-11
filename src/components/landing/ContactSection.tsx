import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button-premium";

export default function ContactSection() {
  return (
    <section id="contact" className="py-12 md:py-20 relative overflow-hidden bg-transparent">
      <div className="bg-mesh opacity-10" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-7xl mx-auto px-10">
          {/* Left: Info */}
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <div className="badge-premium border-emerald-500/20 bg-emerald-500/5 w-fit">
                <span>The Concierge Protocol</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
                Initiate Connection With Our <br />
                <span className="text-primary font-extrabold uppercase tracking-tight">Signature Support</span> Node.
              </h2>
              <p className="max-w-md text-sm md:text-base text-muted-foreground/60 font-medium leading-relaxed">
                Whether you're a discerning member or a culinary partner, 
                our system is designed to ensure your experience remains uncompromising.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="premium-card p-8 flex flex-col gap-5 shadow-xl">
                <div className="w-[48px] h-[48px] rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-xl shadow-emerald-500/5">
                  <Mail className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Network Mail</p>
                  <p className="text-sm font-bold text-foreground">concierge@tiffinconnect.com</p>
                </div>
              </div>

              <div className="premium-card p-8 flex flex-col gap-5 shadow-xl">
                <div className="w-[48px] h-[48px] rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-xl shadow-emerald-500/5">
                  <Phone className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Direct Terminal</p>
                  <p className="text-sm font-bold text-foreground">+91 98765 43210</p>
                </div>
              </div>

              <div className="premium-card p-8 flex flex-col gap-5 sm:col-span-2 shadow-xl">
                <div className="w-[48px] h-[48px] rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-xl shadow-emerald-500/5">
                  <MapPin className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Strategic Headquarters</p>
                  <p className="text-sm font-bold text-foreground leading-relaxed">Suite 402, Luxury Commons, BKC, Mumbai - 400051</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="premium-card p-8 md:p-10 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <form className="space-y-6 relative z-10">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 ml-4">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full h-12 bg-muted/40 border border-border rounded-xl px-5 text-sm font-bold text-foreground focus:ring-1 focus:ring-primary/40 focus:outline-none transition-none placeholder:text-muted-foreground/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 ml-4">Professional Email</label>
                  <input 
                    type="email" 
                    placeholder="john@company.com"
                    className="w-full h-12 bg-muted/40 border border-border rounded-xl px-5 text-sm font-bold text-foreground focus:ring-1 focus:ring-primary/40 focus:outline-none transition-none placeholder:text-muted-foreground/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 ml-4">Inquiry Specification</label>
                <div className="relative">
                  <select className="w-full h-12 bg-muted/40 border border-border rounded-xl px-5 text-sm font-bold text-foreground focus:ring-1 focus:ring-primary/40 focus:outline-none transition-none flex items-center appearance-none">
                    <option className="bg-background">General Membership Inquiry</option>
                    <option className="bg-background">Partnership Proposal</option>
                    <option className="bg-background">Technical Assistance</option>
                    <option className="bg-background">Logistics Feedback</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 ml-4">Inquiry Details</label>
                <textarea 
                  rows={4}
                  placeholder="Transmit your message through the secure channel..."
                  className="w-full bg-muted/40 border border-border rounded-xl px-5 py-4 text-sm font-bold text-foreground focus:ring-1 focus:ring-primary/40 focus:outline-none transition-none resize-none placeholder:text-muted-foreground/20"
                />
              </div>

              <Button className="w-full h-14 rounded-xl bg-primary text-white font-bold flex items-center justify-between px-10 border-none shadow-2xl shadow-primary/20 transition-none">
                <span className="text-lg">Transmit Inquiry</span>
                <Send className="w-5 h-5 ml-2" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
