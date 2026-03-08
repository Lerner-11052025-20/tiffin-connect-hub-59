import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, Users, ChefHat, Package, BarChart3 } from "lucide-react";
import { Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Vendors", url: "/admin/vendors", icon: ChefHat },
  { title: "Orders", url: "/admin/orders", icon: Package },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

function AdminHome() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={container} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: "1,245", icon: "👤", trend: "+12%" },
          { label: "Active Vendors", value: "38", icon: "👨‍🍳", trend: "+3" },
          { label: "Orders Today", value: "312", icon: "📦", trend: "+18%" },
          { label: "Revenue (MTD)", value: "₹2,45,600", icon: "📊", trend: "+24%" },
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
            <span className="text-xs font-semibold text-primary mt-1 inline-block">{stat.trend}</span>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={item} className="glass-card rounded-2xl p-6 hover:shadow-card-hover transition-all">
        <h2 className="font-heading font-semibold text-foreground text-lg mb-4">Platform Overview</h2>
        <p className="text-muted-foreground">Connect Lovable Cloud for live analytics, user management, and order tracking.</p>
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
      <span className="text-6xl block mb-5">⚙️</span>
      <h2 className="font-heading font-semibold text-foreground text-xl">{title}</h2>
      <p className="text-muted-foreground mt-3">Connect backend to manage {title.toLowerCase()}.</p>
    </motion.div>
  );
}

export default function AdminDashboard() {
  return (
    <Routes>
      <Route
        index
        element={
          <DashboardLayout title="Admin Dashboard" navItems={navItems} groupLabel="Admin">
            <AdminHome />
          </DashboardLayout>
        }
      />
      {["users", "vendors", "orders", "analytics"].map((path) => (
        <Route
          key={path}
          path={path}
          element={
            <DashboardLayout
              title={navItems.find((n) => n.url.endsWith(path))?.title || path}
              navItems={navItems}
              groupLabel="Admin"
            >
              <PlaceholderPage title={navItems.find((n) => n.url.endsWith(path))?.title || path} />
            </DashboardLayout>
          }
        />
      ))}
    </Routes>
  );
}
