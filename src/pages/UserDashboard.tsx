import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, Utensils, CalendarDays, Truck, Clock, User } from "lucide-react";
import { Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Browse Meals", url: "/dashboard/meals", icon: Utensils },
  { title: "My Subscription", url: "/dashboard/subscription", icon: CalendarDays },
  { title: "Track Order", url: "/dashboard/track", icon: Truck },
  { title: "Order History", url: "/dashboard/history", icon: Clock },
  { title: "Profile", url: "/dashboard/profile", icon: User },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

function DashboardHome() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={container} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Plan", value: "Weekly", icon: "📋", gradient: "from-primary/10 to-accent/10" },
          { label: "Next Delivery", value: "12:30 PM", icon: "🕐", gradient: "from-accent/10 to-primary/5" },
          { label: "Meals This Week", value: "12", icon: "🍱", gradient: "from-primary/5 to-accent/10" },
          { label: "Saved", value: "₹240", icon: "💰", gradient: "from-accent/10 to-primary/10" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            variants={item}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`glass-card rounded-2xl p-6 hover:shadow-card-hover transition-all duration-300 bg-gradient-to-br ${stat.gradient}`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className="font-heading text-2xl font-bold text-foreground mt-2">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={item} className="glass-card rounded-2xl p-6 hover:shadow-card-hover transition-all duration-300">
        <h2 className="font-heading font-semibold text-foreground text-lg mb-5">Today's Menu</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {["Lunch", "Dinner"].map((meal) => (
            <motion.div
              key={meal}
              whileHover={{ scale: 1.01 }}
              className="border border-border/30 rounded-2xl p-5 glass-subtle"
            >
              <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                {meal === "Lunch" ? "☀️" : "🌙"} {meal}
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>🫓 4 Roti</li>
                <li>🍚 Steamed Rice</li>
                <li>🥘 Dal Tadka</li>
                <li>🥗 Mix Veg Sabji</li>
                <li>🥒 Fresh Salad</li>
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-16 text-center"
    >
      <span className="text-6xl block mb-5">🚧</span>
      <h2 className="font-heading font-semibold text-foreground text-xl">{title}</h2>
      <p className="text-muted-foreground mt-3">This section will be available once backend is connected.</p>
    </motion.div>
  );
}

export default function UserDashboard() {
  return (
    <Routes>
      <Route
        index
        element={
          <DashboardLayout title="Dashboard" navItems={navItems} groupLabel="Menu">
            <DashboardHome />
          </DashboardLayout>
        }
      />
      {["meals", "subscription", "track", "history", "profile"].map((path) => (
        <Route
          key={path}
          path={path}
          element={
            <DashboardLayout
              title={navItems.find((n) => n.url.endsWith(path))?.title || path}
              navItems={navItems}
              groupLabel="Menu"
            >
              <PlaceholderPage title={navItems.find((n) => n.url.endsWith(path))?.title || path} />
            </DashboardLayout>
          }
        />
      ))}
    </Routes>
  );
}
