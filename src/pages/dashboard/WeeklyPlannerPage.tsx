import { WeeklyPlanner } from "@/components/WeeklyPlanner";
import { Sparkles, Info, Calendar, Layout, ListChecks, Zap } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from "framer-motion";

export default function WeeklyPlannerPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-4 md:p-6 lg:p-8 space-y-10 max-w-[1600px] mx-auto pb-24"
        >
            <div className="relative group p-8 lg:p-10 rounded-[2.5rem] bg-card border border-border/50 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-accent/5 rounded-full blur-[80px] -ml-24 -mb-24 pointer-events-none" />

                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
                    <div className="space-y-3 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-2">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-widest leading-none">AI Meal Planner</span>
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-none">
                            Weekly <span className="text-primary italic">Planner</span>
                        </h1>
                        <p className="text-muted-foreground font-medium text-lg lg:text-xl max-w-2xl mx-auto lg:mx-0">
                            Plan your meals for the week and enjoy healthy, homemade food every day.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
                        <div className="p-5 rounded-2xl bg-background/50 backdrop-blur-md border border-border/40 text-center space-y-1 shadow-inner group/stat">
                            <Calendar className="h-4 w-4 text-primary mx-auto mb-2" />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Days Planned</p>
                            <p className="font-bold text-xl text-foreground">7 Days</p>
                        </div>
                        <div className="p-5 rounded-2xl bg-background/50 backdrop-blur-md border border-border/40 text-center space-y-1 shadow-inner group/stat">
                            <Zap className="h-4 w-4 text-accent mx-auto mb-2" />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Balance</p>
                            <p className="font-bold text-xl text-accent">+40%</p>
                        </div>
                    </div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
            >
                <Alert className="bg-primary/5 border-primary/20 rounded-2xl p-6 lg:p-8 shadow-xl overflow-hidden relative border-2 border-primary/10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32 opacity-50" />
                    <div className="flex items-start gap-4 relative z-10">
                        <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary shadow-inner border border-primary/20 shrink-0">
                            <Info className="h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-1.5">
                            <AlertTitle className="text-lg font-bold text-primary uppercase tracking-tight">Planning Benefits</AlertTitle>
                            <AlertDescription className="text-sm font-medium text-muted-foreground/80 leading-relaxed max-w-4xl">
                                Planning ahead helps our kitchens prepare the freshest ingredients for your meals.
                                <span className="text-foreground font-bold"> Changes are saved instantly</span> until the cutoff time.
                            </AlertDescription>
                        </div>
                    </div>
                </Alert>
            </motion.div>

            <WeeklyPlanner />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12">
                {[
                    { icon: "🍱", title: "Diverse Menu", sub: "Choose from a wide range of top kitchens in your area." },
                    { icon: "⏰", title: "Reliable Delivery", sub: "Select delivery times that fit your busy schedule." },
                    { icon: "🌱", title: "Eco-Friendly", sub: "Help reduce food waste and eat fresh, healthy meals." }
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -5 }}
                    className="group premium-card p-8 group transition-all duration-500 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-[40px] -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
                    <div className="w-12 h-12 rounded-xl bg-muted/30 flex items-center justify-center mb-6 border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
                      <span className="text-2xl">{feature.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-foreground tracking-tight">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">{feature.sub}</p>
                  </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
