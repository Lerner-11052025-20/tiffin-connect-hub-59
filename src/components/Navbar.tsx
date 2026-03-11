import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button-premium";
import { Menu, X, ChevronRight, Globe } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

const navLinks = [
  { label: "Home", href: "/#hero" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { user, role } = useAuth();
  const location = useLocation();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dashboardLink = role === "vendor" ? "/vendor" : role === "admin" ? "/admin" : "/dashboard";

  const scrollToSection = (href: string) => {
    if (href.startsWith("/#")) {
      const id = href.replace("/#", "");
      if (location.pathname === "/") {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          return;
        }
      }
    }
    // For Home link "/"
    if (href === "/") {
       window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled ? "py-4" : "py-6"
      )}
    >
      <div className="container mx-auto px-6">
        <div
          className={cn(
            "flex items-center justify-between transition-all duration-500 rounded-2xl px-6 py-2.5",
            scrolled
              ? "bg-background/80 luxury-blur border border-border/50 shadow-2xl shadow-black/5"
              : "bg-transparent"
          )}
        >
          {/* Logo */}
          <Link 
            to="/#hero" 
            className="flex items-center gap-3 group relative"
            onClick={() => scrollToSection('/#hero')}
          >
            <div className="relative w-9 h-9 flex items-center justify-center">
              <div className="absolute inset-0 bg-primary opacity-20 rounded-lg group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative text-xl group-hover:scale-110 transition-transform duration-500">🍱</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none tracking-tight text-foreground">
                Tiffin<span className="text-primary tracking-tighter">Connect</span>
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground mt-1 opacity-60">
                Premium Dining
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden lg:flex items-center gap-2 px-2 bg-muted/20 border border-border/50 rounded-2xl luxury-blur">
            {navLinks.map((link, idx) => {
              const itemHovered = hoveredIndex === idx;
              return (
                <div
                  key={link.label}
                  className="relative px-4 py-2"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <Link
                    to={link.href}
                    className={cn(
                      "relative z-10 text-xs font-bold uppercase tracking-widest transition-colors duration-300",
                      itemHovered ? "text-primary" : "text-muted-foreground/60"
                    )}
                    onClick={() => scrollToSection(link.href)}
                  >
                    {link.label}
                  </Link>
                  <AnimatePresence>
                    {itemHovered && (
                      <motion.div
                        layoutId="nav-hover-pill"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        className="absolute inset-0 bg-primary/10 rounded-xl z-0"
                      />
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            {user ? (
              <Button variant="gradient" className="rounded-full px-6 luxury-button" asChild>
                <Link 
                  to={dashboardLink} 
                  onClick={() => queryClient.resetQueries()}
                  className="flex items-center gap-2"
                >
                  Member Portal <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-semibold hover:text-primary transition-colors hidden sm:block">
                  Log In
                </Link>
                <Button variant="gradient" className="rounded-full px-6 luxury-button" asChild>
                  <Link to="/register">Join Platform</Link>
                </Button>
              </div>
            )}

            {/* Mobile Toggle */}
            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-muted/50 text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-full inset-x-4 mt-2 bg-background/95 luxury-blur border border-border shadow-2xl rounded-3xl overflow-hidden pointer-events-auto"
          >
            <div className="p-8 flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => {
                      setMobileOpen(false);
                      scrollToSection(link.href);
                    }}
                    className="text-xl font-bold hover:text-primary transition-colors flex items-center justify-between"
                  >
                    {link.label}
                    <ChevronRight size={18} className="opacity-30" />
                  </Link>
                ))}
              </div>
              <div className="pt-6 border-t border-border flex flex-col gap-4">
                <Link to="/login" className="w-full text-center py-4 font-bold border border-border rounded-2xl">
                  Log In
                </Link>
                <Button variant="gradient" className="w-full py-7 rounded-2xl text-lg font-bold" asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
