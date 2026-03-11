import { Link } from "react-router-dom";
import { Mail, MapPin, Twitter, Instagram, Github, Linkedin, ArrowUp } from "lucide-react";

const socials = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Github, href: "#", label: "Github" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

const links = {
  product: [
    { label: "Methodology", href: "/#how-it-works" },
    { label: "Valuation", href: "/#pricing" },
    { label: "Ecosystem", href: "/#features" },
    { label: "Member Portal", href: "/login" },
  ],
  vendors: [
    { label: "Become a Partner", href: "/register?type=vendor" },
    { label: "Vendor Relations", href: "/#contact" },
    { label: "Kitchen Audits", href: "/#features" },
    { label: "Growth Capital", href: "/#pricing" },
  ],
  legal: [
    { label: "Data Privacy", href: "/#contact" },
    { label: "Master Terms", href: "/#contact" },
    { label: "Refund Policy", href: "/#pricing" },
    { label: "Contact Us", href: "/#contact" },
  ],
};

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (href: string) => {
    if (href.startsWith("/#")) {
      const id = href.split("#")[1];
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="relative overflow-hidden bg-transparent border-t border-border">
      <div className="bg-mesh opacity-10" />

      <div className="container mx-auto px-6 py-16 md:py-20">
        {/* Top Section */}
        <div className="grid lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link 
              to="/" 
              className="flex items-center gap-2.5 group"
              onClick={() => scrollToSection("/#hero")}
            >
              <div className="relative w-9 h-9 flex items-center justify-center">
                <div className="absolute inset-0 bg-primary opacity-20 rounded-lg" />
                <span className="relative text-lg">🍱</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-none tracking-tight text-foreground">
                  Tiffin<span className="text-primary tracking-tighter">Connect</span>
                </span>
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mt-1">
                  Premium Dining
                </span>
              </div>
            </Link>

            <p className="max-w-xs text-xs md:text-sm font-medium text-muted-foreground/60 leading-relaxed">
              Redefining the daily meal ritual through artisanal cooking,
              surgical logistics, and uncompromising quality standards.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-8 h-8 rounded-lg bg-muted/20 flex items-center justify-center text-muted-foreground/40 transition-none border border-border"
                  aria-label={social.label}
                >
                  <social.icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {[
            { title: "Navigation", items: links.product },
            { title: "Partnerships", items: links.vendors },
            { title: "Legal & Support", items: links.legal },
          ].map((column) => (
            <div key={column.title} className="space-y-6">
              <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground">
                {column.title}
              </h4>
              <ul className="space-y-3">
                {column.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.href}
                      onClick={() => scrollToSection(item.href)}
                      className="text-xs font-medium text-muted-foreground/50 transition-none"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="relative py-8">
          <div className="h-px bg-border w-full" />
          <button
            onClick={scrollToTop}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card border border-border shadow-xl flex items-center justify-center text-muted-foreground transition-none"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pt-6 opacity-40">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
            © {new Date().getFullYear()} TiffinConnect Global. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <a href="mailto:concierge@tiffinconnect.com" className="text-[9px] font-black uppercase tracking-[0.15em] flex items-center gap-2">
              <Mail className="h-3.5 w-3.5" />
              <span>concierge@tiffinconnect.com</span>
            </a>
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.15em]">
              <MapPin className="h-3.5 w-3.5" />
              <span>Designed in Bangalore • Serviced Globally</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
