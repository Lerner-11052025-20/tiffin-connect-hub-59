import { motion } from "framer-motion";

export const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xl">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-24 h-24">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-primary/20 rounded-[2rem] blur-2xl"
          />
          <motion.div
            animate={{
              rotate: 360,
              borderRadius: ["2rem", "1rem", "2rem"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-full h-full border-4 border-primary/30 border-t-primary shadow-[0_0_30px_hsl(var(--primary)/0.2)]"
          />
          <div className="absolute inset-0 flex items-center justify-center text-3xl">
             🍱
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-foreground animate-pulse">
            Tiffin<span className="text-primary tracking-tighter">Connect</span>
          </h2>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonBox = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-muted/40 rounded-2xl ${className}`} />
);
