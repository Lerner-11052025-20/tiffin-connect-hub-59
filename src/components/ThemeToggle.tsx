import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button-premium";
import { toast } from "sonner";

export default function ThemeToggle({ collapsed = false }: { collapsed?: boolean }) {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
    >
      <Button
        onClick={() => {
          setDark((d) => {
            const isDark = !d;
            toast.success(`${isDark ? "Dark" : "Light"} mode enabled 🎉`);
            return isDark;
          });
        }}
        variant="glass"
        size="icon"
        className="relative overflow-hidden h-10 w-10 rounded-full flex transition-all bg-background/50 border border-primary/20 hover:border-primary/50"
        aria-label="Toggle dark mode"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={dark ? "moon" : "sun"}
            initial={{ y: -20, opacity: 0, rotate: -180 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 20, opacity: 0, rotate: 180 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute"
          >
            {dark ? (
              <Sun className="h-5 w-5 text-primary" />
            ) : (
              <Moon className="h-5 w-5 text-primary" />
            )}
          </motion.div>
        </AnimatePresence>
      </Button>
    </motion.div>
  );
}
