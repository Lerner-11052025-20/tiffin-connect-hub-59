import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Clock, MapPin, Utensils, Star, Sparkles } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-36 mesh-bg">
      {/* Animated background orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 right-[10%] w-[400px] h-[400px] rounded-full bg-primary/[0.06] blur-[80px]"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 left-[5%] w-[500px] h-[500px] rounded-full bg-accent/[0.08] blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, 15, 0], y: [0, 15, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full bg-primary/[0.04] blur-[60px]"
        />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 rounded-full glass-subtle px-4 py-2 mb-8"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                Smart Meal Delivery
              </span>
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="font-heading text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.1] text-foreground tracking-tight"
            >
              Fresh Homemade Meals,{" "}
              <span className="text-gradient">Delivered Daily</span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-6 text-lg text-muted-foreground max-w-lg leading-relaxed"
            >
              Affordable lunch & dinner tiffin subscriptions from trusted local cooks.
              Customize your menu, pick your timing, and enjoy home-style meals.
            </motion.p>

            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-4 mt-10"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button variant="hero" size="lg" className="shadow-glow rounded-xl text-base px-8" asChild>
                  <Link to="/register">
                    Start Ordering <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button variant="outline" size="lg" className="rounded-xl text-base px-8 glass-subtle border-border/50" asChild>
                  <a href="#how-it-works">Explore Meals</a>
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-6 mt-14"
            >
              {[
                { icon: Utensils, label: "500+ Meal Plans", sub: "Customizable" },
                { icon: Clock, label: "On-Time Delivery", sub: "98% rate" },
                { icon: MapPin, label: "50+ Areas", sub: "& growing" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -2 }}
                  className="flex items-center gap-3 glass-subtle rounded-xl px-4 py-3"
                >
                  <div className="w-10 h-10 rounded-lg gradient-hero flex items-center justify-center shadow-glow">
                    <stat.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{stat.label}</p>
                    <p className="text-xs text-muted-foreground">{stat.sub}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Decorative elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-dashed border-primary/10"
              />
              <div className="absolute inset-4 rounded-full bg-primary/[0.04] animate-pulse-glow" />
              <div className="absolute inset-12 rounded-full bg-accent/[0.06]" />

              {/* Main card */}
              <motion.div
                className="absolute inset-20 rounded-3xl glass-card shadow-elevated flex items-center justify-center"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="text-center p-6">
                  <span className="text-7xl block mb-3">🍱</span>
                  <p className="font-heading font-bold text-2xl text-foreground">Today's Thali</p>
                  <p className="text-sm text-muted-foreground mt-1">Roti • Dal • Sabji • Rice • Salad</p>
                  <div className="mt-4 inline-flex items-center gap-1 gradient-hero text-primary-foreground rounded-full px-4 py-1.5 text-sm font-bold shadow-glow">
                    ₹80/meal
                  </div>
                </div>
              </motion.div>

              {/* Floating badges */}
              <motion.div
                className="absolute top-16 right-8 glass-card rounded-2xl px-4 py-3 shadow-card"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                    <Star className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">4.9 Rating</p>
                    <p className="text-[10px] text-muted-foreground">2k+ reviews</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-20 left-4 glass-card rounded-2xl px-4 py-3 shadow-card"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">12:30 PM</p>
                    <p className="text-[10px] text-muted-foreground">Next delivery</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
