import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Clock, MapPin, Utensils, Star, Sparkles, TrendingUp } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: "easeOut" as const },
  }),
};

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-28 md:pt-32 md:pb-40">
      {/* Background */}
      <div className="absolute inset-0 -z-10 mesh-bg dot-pattern" />
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-[5%] w-[500px] h-[500px] rounded-full bg-primary/[0.07] blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 left-[5%] w-[600px] h-[600px] rounded-full bg-accent/[0.06] blur-[120px]"
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
              className="inline-flex items-center gap-2 rounded-full glass-card px-4 py-2 mb-8 shadow-soft"
            >
              <div className="w-5 h-5 rounded-full gradient-hero flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-primary-foreground" />
              </div>
              <span className="text-xs font-semibold text-foreground tracking-wide">
                #1 Smart Meal Delivery Platform
              </span>
              <TrendingUp className="h-3 w-3 text-primary" />
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="font-heading text-4xl md:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.08] text-foreground"
            >
              Fresh Homemade{" "}
              <span className="relative">
                <span className="text-gradient">Meals</span>
                <motion.svg
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                >
                  <motion.path
                    d="M2 8 C40 2, 80 2, 100 6 C120 10, 160 10, 198 4"
                    stroke="hsl(158, 64%, 52%)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
                  />
                </motion.svg>
              </span>
              ,{"\n"}Delivered Daily
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-7 text-lg text-muted-foreground max-w-lg leading-relaxed"
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
                <Button variant="hero" size="lg" className="shadow-glow rounded-2xl text-base px-8 h-13" asChild>
                  <Link to="/register">
                    Start Ordering <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-2xl text-base px-8 h-13 glass-card border-border/50 hover:shadow-card-hover"
                  asChild
                >
                  <a href="#how-it-works">Explore Meals</a>
                </Button>
              </motion.div>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-5 mt-14"
            >
              {[
                { icon: Utensils, label: "500+", sub: "Meal Plans" },
                { icon: Clock, label: "98%", sub: "On-Time" },
                { icon: MapPin, label: "50+", sub: "Areas" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className="flex items-center gap-3 glass-card rounded-2xl px-5 py-3.5 shadow-soft"
                >
                  <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center shadow-glow">
                    <stat.icon className="h-4.5 w-4.5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-foreground leading-none">{stat.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/10 animate-spin-slow" />
              <div className="absolute inset-6 rounded-full bg-primary/[0.04] animate-pulse-glow" />
              <div className="absolute inset-14 rounded-full bg-accent/[0.05]" />

              {/* Main card */}
              <motion.div
                className="absolute inset-20 rounded-3xl glass-card-strong shadow-elevated flex items-center justify-center"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="text-center p-6">
                  <span className="text-7xl block mb-4">🍱</span>
                  <p className="font-heading font-bold text-2xl text-foreground">Today's Thali</p>
                  <p className="text-sm text-muted-foreground mt-1.5">Roti • Dal • Sabji • Rice • Salad</p>
                  <div className="mt-5 inline-flex items-center gap-1.5 gradient-hero text-primary-foreground rounded-full px-5 py-2 text-sm font-bold shadow-glow">
                    ₹80/meal
                  </div>
                </div>
              </motion.div>

              {/* Floating badges */}
              <motion.div
                className="absolute top-14 right-4 glass-card-strong rounded-2xl px-4 py-3 shadow-card"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center">
                    <Star className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">4.9 Rating</p>
                    <p className="text-[10px] text-muted-foreground">2k+ reviews</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-16 left-0 glass-card-strong rounded-2xl px-4 py-3 shadow-card"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
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
