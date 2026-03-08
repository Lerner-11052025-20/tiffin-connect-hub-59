import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, ChefHat } from "lucide-react";

export default function CTASection() {
  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-4">
        {/* Vendor CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-3xl p-10 md:p-14 text-center mb-12 hover-lift"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-accent/15 flex items-center justify-center mb-6">
            <ChefHat className="h-8 w-8 text-accent" />
          </div>
          <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
            Are You a Tiffin Provider?
          </h3>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Join our network of trusted home chefs. Reach thousands of hungry customers and grow your business.
          </p>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="mt-8 inline-block">
            <Button variant="outline" size="lg" className="rounded-xl border-accent/30 text-foreground hover:bg-accent/10" asChild>
              <Link to="/register">Become a Provider <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl gradient-hero p-12 md:p-20 text-center overflow-hidden"
        >
          {/* Glass overlay patterns */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(40_100%_67%/0.25),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,hsl(0_0%_100%/0.08),transparent_50%)]" />
          <div className="absolute top-0 left-0 w-full h-full bg-[repeating-linear-gradient(90deg,hsl(0_0%_100%/0.03)_0px,hsl(0_0%_100%/0.03)_1px,transparent_1px,transparent_80px)]" />

          <div className="relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground leading-tight"
            >
              Ready for Home-Style Meals?
            </motion.h2>
            <p className="text-primary-foreground/80 mt-5 max-w-lg mx-auto text-lg leading-relaxed">
              Join thousands of happy customers who enjoy fresh, affordable tiffin delivered to their doorstep every day.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="accent" size="lg" className="rounded-xl shadow-glow-accent text-base px-8" asChild>
                  <Link to="/register">
                    Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-xl border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground text-base px-8"
                  asChild
                >
                  <Link to="/login">I'm a Vendor</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
