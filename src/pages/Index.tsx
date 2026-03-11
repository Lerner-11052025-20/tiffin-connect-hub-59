import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PricingSection from "@/components/landing/PricingSection";
import CTASection from "@/components/landing/CTASection";
import TeamSection from "@/components/landing/TeamSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import UsabilitySection from "@/components/landing/UsabilitySection";
import ContactSection from "@/components/landing/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground transition-all duration-500">
      <div className="home-page-frame bg-background relative">
        <Navbar />
        <HeroSection />
        <HowItWorks />
        <FeaturesSection />
        <PricingSection />
        <CTASection />
        <TeamSection />
        <TestimonialsSection />
        <UsabilitySection />
        <ContactSection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
