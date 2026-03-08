import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, Utensils, CalendarDays, Truck, Clock, User } from "lucide-react";
import { Routes, Route } from "react-router-dom";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Browse Meals", url: "/dashboard/meals", icon: Utensils },
  { title: "My Subscription", url: "/dashboard/subscription", icon: CalendarDays },
  { title: "Track Order", url: "/dashboard/track", icon: Truck },
  { title: "Order History", url: "/dashboard/history", icon: Clock },
  { title: "Profile", url: "/dashboard/profile", icon: User },
];

function DashboardHome() {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Plan", value: "Weekly", color: "bg-primary/10 text-primary" },
          { label: "Next Delivery", value: "12:30 PM", color: "bg-accent/20 text-accent-foreground" },
          { label: "Meals This Week", value: "12", color: "bg-primary/10 text-primary" },
          { label: "Saved", value: "₹240", color: "bg-green-50 text-green-700" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl p-5 shadow-card">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className={`font-heading text-2xl font-bold mt-1 ${stat.color.split(" ")[1]}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl p-6 shadow-card">
        <h2 className="font-heading font-semibold text-foreground text-lg mb-4">Today's Menu</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {["Lunch", "Dinner"].map((meal) => (
            <div key={meal} className="border rounded-xl p-4">
              <h3 className="font-heading font-semibold text-foreground">{meal}</h3>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>🫓 4 Roti</li>
                <li>🍚 Steamed Rice</li>
                <li>🥘 Dal Tadka</li>
                <li>🥗 Mix Veg Sabji</li>
                <li>🥒 Fresh Salad</li>
              </ul>
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
      <span className="text-5xl block mb-4">🚧</span>
      <h2 className="font-heading font-semibold text-foreground text-xl">{title}</h2>
      <p className="text-muted-foreground mt-2">This section will be available once backend is connected.</p>
    </div>
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
