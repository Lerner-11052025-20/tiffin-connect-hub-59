import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Github, Twitter, Instagram, Mail, Zap } from "lucide-react";

const socials = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Github, href: "#", label: "Github" },
  { icon: Mail, href: "#", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground pt-20 pb-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(158_64%_52%/0.05),transparent_60%)]" />

      <div className="container mx-auto px-4 relative">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-xl gradient-hero flex items-center justify-center">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-lg tracking-tight">
                Tiffin<span className="text-primary">Connect</span>
              </span>
            </div>
            <p className="text-sm text-secondary-foreground/40 leading-relaxed">
              Connecting you with the best local home chefs for daily tiffin delivery.
            </p>
            <div className="flex gap-3 mt-7">
              {socials.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  whileHover={{ y: -2, scale: 1.1 }}
                  className="w-10 h-10 rounded-xl bg-secondary-foreground/5 flex items-center justify-center text-secondary-foreground/30 hover:text-primary hover:bg-primary/10 transition-all"
                  aria-label={s.label}
                >
                  <s.icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-6 text-secondary-foreground/70 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3.5 text-sm text-secondary-foreground/40">
              <li><a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a></li>
              <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#about" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-6 text-secondary-foreground/70 text-sm uppercase tracking-wider">For Vendors</h4>
            <ul className="space-y-3.5 text-sm text-secondary-foreground/40">
              <li><Link to="/register" className="hover:text-primary transition-colors">Become a Chef</Link></li>
              <li><Link to="/login" className="hover:text-primary transition-colors">Vendor Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-6 text-secondary-foreground/70 text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-3.5 text-sm text-secondary-foreground/40">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/8 mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-secondary-foreground/25">
          <span>© {new Date().getFullYear()} TiffinConnect™. All rights reserved.</span>
          <span>Made with 🧡 in India</span>
        </div>
      </div>
    </footer>
  );
}
