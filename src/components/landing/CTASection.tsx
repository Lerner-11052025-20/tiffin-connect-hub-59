import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, ChefHat, Heart } from "lucide-react";

export default function CTASection() {
  return (
    <section id="contact" className="py-28">
      <div className="container mx-auto px-4">
        {/* Vendor CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card rounded-3xl p-10 md:p-14 text-center mb-12 hover-lift"
        >
          <div className="w-18 h-18 mx-auto rounded-3xl bg-accent/12 flex items-center justify-center mb-7 w-[72px] h-[72px]">
            <ChefHat className="h-9 w-9 text-accent" />
          </div>
          <h3 className="font-heading text-2xl md:text-3xl font-extrabold text-foreground">
            Are You a Tiffin Provider?
          </h3>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto leading-relaxed">
            Join our network of trusted home chefs. Reach thousands of hungry customers and grow your business.
          </p>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="mt-8 inline-block">
            <Button variant="outline" size="lg" className="rounded-2xl border-accent/30 text-foreground hover:bg-accent/10 h-12 px-8" asChild>
              <Link to="/register">Become a Provider <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl gradient-hero p-12 md:p-20 text-center overflow-hidden grain"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(172_66%_50%/0.4),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,hsl(0_0%_100%/0.06),transparent_50%)]" />

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-16 h-16 mx-auto rounded-full bg-primary-foreground/10 flex items-center justify-center mb-8"
            >
              <Heart className="h-8 w-8 text-primary-foreground" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-heading text-3xl md:text-5xl font-extrabold text-primary-foreground leading-tight"
            >
              Ready for Home-Style Meals?
            </motion.h2>
            <p className="text-primary-foreground/80 mt-5 max-w-lg mx-auto text-lg leading-relaxed">
              Join thousands of happy customers who enjoy fresh, affordable tiffin delivered to their doorstep every day.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="accent"
                  size="lg"
                  className="rounded-2xl shadow-glow-accent text-base px-8 h-13 font-bold"
                  asChild
                >
                  <Link to="/register">
                    Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-2xl border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground text-base px-8 h-13"
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
