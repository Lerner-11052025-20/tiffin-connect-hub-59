import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🍱</span>
              <span className="font-heading font-bold text-lg">
                TIFFIN<span className="text-primary">CONNECT</span>
              </span>
            </div>
            <p className="text-sm text-secondary-foreground/60">
              Connecting you with the best local home chefs for daily tiffin delivery.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/60">
              <li><a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a></li>
              <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#about" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">For Vendors</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/60">
              <li><Link to="/register" className="hover:text-primary transition-colors">Become a Chef</Link></li>
              <li><Link to="/login" className="hover:text-primary transition-colors">Vendor Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/60">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 mt-8 pt-8 text-center text-sm text-secondary-foreground/40">
          © {new Date().getFullYear()} TiffinConnect™. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
