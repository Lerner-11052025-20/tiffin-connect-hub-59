import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, role } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dashboardLink = role === "vendor" ? "/vendor" : role === "admin" ? "/admin" : "/dashboard";

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled ? "glass shadow-soft" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ rotate: 12, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="w-9 h-9 rounded-xl gradient-hero flex items-center justify-center shadow-glow"
          >
            <Zap className="h-4.5 w-4.5 text-primary-foreground" />
          </motion.div>
          <span className="font-heading font-bold text-lg text-foreground tracking-tight">
            Tiffin<span className="text-gradient">Connect</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-xl hover:bg-primary/5 group"
            >
              {link.label}
              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-0.5 rounded-full bg-primary transition-all duration-300 group-hover:w-5" />
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="hero" className="shadow-glow rounded-xl" asChild>
                <Link to={dashboardLink}>My Dashboard</Link>
              </Button>
            </motion.div>
          ) : (
            <>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground rounded-xl" asChild>
                <Link to="/login">Log In</Link>
              </Button>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="hero" className="shadow-glow rounded-xl" asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
              </motion.div>
            </>
          )}
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          className="md:hidden text-foreground p-2 rounded-xl hover:bg-primary/5"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </motion.button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden glass-card-strong overflow-hidden mx-4 mb-4 rounded-2xl"
          >
            <div className="flex flex-col p-4 gap-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 py-3 px-4 rounded-xl transition-all"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
              <div className="flex gap-3 pt-3 mt-2 border-t border-border/50">
                {user ? (
                  <Button variant="hero" className="flex-1 rounded-xl shadow-glow" asChild>
                    <Link to={dashboardLink}>My Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" className="flex-1 rounded-xl" asChild>
                      <Link to="/login">Log In</Link>
                    </Button>
                    <Button variant="hero" className="flex-1 rounded-xl shadow-glow" asChild>
                      <Link to="/register">Get Started</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
