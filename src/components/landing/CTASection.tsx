import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl gradient-hero p-12 md:p-20 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(40_100%_67%/0.3),transparent_60%)]" />
          <div className="relative z-10">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground">
              Ready for Home-Style Meals?
            </h2>
            <p className="text-primary-foreground/80 mt-4 max-w-lg mx-auto text-lg">
              Join thousands of happy customers who enjoy fresh, affordable tiffin delivered to their doorstep every day.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button variant="accent" size="lg" asChild>
                <Link to="/register">
                  Start Free Trial <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                asChild
              >
                <Link to="/login">I'm a Vendor</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
