import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, UtensilsCrossed, Package, Calendar, DollarSign } from "lucide-react";
import { Routes, Route } from "react-router-dom";

const navItems = [
  { title: "Overview", url: "/vendor", icon: LayoutDashboard },
  { title: "Menu Management", url: "/vendor/menu", icon: UtensilsCrossed },
  { title: "Incoming Orders", url: "/vendor/orders", icon: Package },
  { title: "Schedule", url: "/vendor/schedule", icon: Calendar },
  { title: "Earnings", url: "/vendor/earnings", icon: DollarSign },
];

function VendorHome() {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Orders", value: "24" },
          { label: "Pending Delivery", value: "8" },
          { label: "Today's Earnings", value: "₹3,200" },
          { label: "Active Subscribers", value: "56" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl p-5 shadow-card">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="font-heading text-2xl font-bold text-foreground mt-1">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-card rounded-xl p-6 shadow-card">
        <h2 className="font-heading font-semibold text-foreground text-lg mb-4">Recent Orders</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between border rounded-lg p-4">
              <div>
                <p className="font-medium text-foreground">Order #{1000 + i}</p>
                <p className="text-sm text-muted-foreground">Weekly Plan • Lunch + Dinner</p>
              </div>
              <span className="text-xs font-semibold bg-accent/20 text-accent-foreground px-3 py-1 rounded-full">
                In Progress
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="bg-card rounded-xl p-12 shadow-card text-center">
      <span className="text-5xl block mb-4">👨‍🍳</span>
      <h2 className="font-heading font-semibold text-foreground text-xl">{title}</h2>
      <p className="text-muted-foreground mt-2">Connect backend to manage this section.</p>
    </div>
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
