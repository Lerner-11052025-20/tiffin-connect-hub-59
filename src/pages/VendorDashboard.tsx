import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, UtensilsCrossed, Package, Calendar, DollarSign } from "lucide-react";
import { Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { title: "Overview", url: "/vendor", icon: LayoutDashboard },
  { title: "Menu Management", url: "/vendor/menu", icon: UtensilsCrossed },
  { title: "Incoming Orders", url: "/vendor/orders", icon: Package },
  { title: "Schedule", url: "/vendor/schedule", icon: Calendar },
  { title: "Earnings", url: "/vendor/earnings", icon: DollarSign },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

function VendorHome() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={container} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Orders", value: "24", icon: "📦" },
          { label: "Pending Delivery", value: "8", icon: "🚚" },
          { label: "Today's Earnings", value: "₹3,200", icon: "💰" },
          { label: "Active Subscribers", value: "56", icon: "👥" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            variants={item}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="glass-card rounded-2xl p-6 hover:shadow-card-hover transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className="font-heading text-2xl font-bold text-foreground mt-2">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={item} className="glass-card rounded-2xl p-6 hover:shadow-card-hover transition-all">
        <h2 className="font-heading font-semibold text-foreground text-lg mb-5">Recent Orders</h2>
        <div className="space-y-3">
          {[
            { id: 1001, plan: "Weekly Plan • Lunch + Dinner", status: "In Progress" },
            { id: 1002, plan: "Monthly Plan • Lunch", status: "Preparing" },
            { id: 1003, plan: "Daily • Dinner", status: "Delivered" },
          ].map((order) => (
            <motion.div
              key={order.id}
              whileHover={{ scale: 1.005 }}
              className="flex items-center justify-between border border-border/30 rounded-xl p-4 glass-subtle"
            >
              <div>
                <p className="font-medium text-foreground">Order #{order.id}</p>
                <p className="text-sm text-muted-foreground">{order.plan}</p>
              </div>
              <span className="text-xs font-semibold gradient-hero text-primary-foreground px-3 py-1.5 rounded-full">
                {order.status}
              </span>
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
      <span className="text-6xl block mb-5">👨‍🍳</span>
      <h2 className="font-heading font-semibold text-foreground text-xl">{title}</h2>
      <p className="text-muted-foreground mt-3">Connect backend to manage this section.</p>
    </motion.div>
  );
}

export default function VendorDashboard() {
  return (
    <Routes>
      <Route
        index
        element={
          <DashboardLayout title="Vendor Overview" navItems={navItems} groupLabel="Vendor">
            <VendorHome />
          </DashboardLayout>
        }
      />
      {["menu", "orders", "schedule", "earnings"].map((path) => (
        <Route
          key={path}
          path={path}
          element={
            <DashboardLayout
              title={navItems.find((n) => n.url.endsWith(path))?.title || path}
              navItems={navItems}
              groupLabel="Vendor"
            >
              <PlaceholderPage title={navItems.find((n) => n.url.endsWith(path))?.title || path} />
            </DashboardLayout>
          }
        />
      ))}
    </Routes>
  );
}
