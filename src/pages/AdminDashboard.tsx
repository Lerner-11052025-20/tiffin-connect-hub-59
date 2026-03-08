import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, Users, ChefHat, Package, BarChart3 } from "lucide-react";
import { Routes, Route } from "react-router-dom";

const navItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Vendors", url: "/admin/vendors", icon: ChefHat },
  { title: "Orders", url: "/admin/orders", icon: Package },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
];

function AdminHome() {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: "1,245" },
          { label: "Active Vendors", value: "38" },
          { label: "Orders Today", value: "312" },
          { label: "Revenue (MTD)", value: "₹2,45,600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl p-5 shadow-card">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="font-heading text-2xl font-bold text-foreground mt-1">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-card rounded-xl p-6 shadow-card">
        <h2 className="font-heading font-semibold text-foreground text-lg mb-4">Platform Overview</h2>
        <p className="text-muted-foreground">Connect Lovable Cloud for live analytics, user management, and order tracking.</p>
      </div>
    </div>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="bg-card rounded-xl p-12 shadow-card text-center">
      <span className="text-5xl block mb-4">⚙️</span>
      <h2 className="font-heading font-semibold text-foreground text-xl">{title}</h2>
      <p className="text-muted-foreground mt-2">Connect backend to manage {title.toLowerCase()}.</p>
    </div>
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
