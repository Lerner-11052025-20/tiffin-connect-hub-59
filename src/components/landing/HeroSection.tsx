import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Clock, MapPin, Utensils } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 mb-6">
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                🍱 Fresh Home-Style Meals
              </span>
            </div>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-foreground">
              Delicious Tiffin,{" "}
              <span className="text-primary">Delivered Daily</span>
            </h1>

            <p className="mt-5 text-lg text-muted-foreground max-w-lg">
              Connect with local home chefs for affordable, hygienic, customizable
              meal plans. Subscribe weekly or monthly — lunch, dinner, or both.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <Button variant="hero" size="lg" asChild>
                <Link to="/register">
                  Start Ordering <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#how-it-works">See How It Works</a>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-12">
              {[
                { icon: Utensils, label: "500+ Meal Plans", sub: "Customizable" },
                { icon: Clock, label: "On-Time Delivery", sub: "98% rate" },
                { icon: MapPin, label: "50+ Areas", sub: "& growing" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg gradient-hero flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{stat.label}</p>
                    <p className="text-xs text-muted-foreground">{stat.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Decorative circles */}
              <div className="absolute inset-0 rounded-full gradient-hero opacity-10 animate-pulse" />
              <div className="absolute inset-8 rounded-full bg-accent/20" />
              <div className="absolute inset-16 rounded-full bg-card shadow-card flex items-center justify-center">
                <div className="text-center">
                  <span className="text-7xl block mb-2">🍱</span>
                  <p className="font-heading font-bold text-2xl text-foreground">Today's Thali</p>
                  <p className="text-sm text-muted-foreground mt-1">Roti • Dal • Sabji • Rice • Salad</p>
                  <div className="mt-4 inline-flex items-center gap-1 bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-semibold">
                    ₹80/meal
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
