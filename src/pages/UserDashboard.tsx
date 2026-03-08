import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, Utensils, CalendarDays, Truck, Clock, User } from "lucide-react";
import { Routes, Route } from "react-router-dom";
import DashboardHome from "./dashboard/DashboardHome";
import SubscriptionPage from "./dashboard/SubscriptionPage";
import OrderHistoryPage from "./dashboard/OrderHistoryPage";
import BrowseMealsPage from "./dashboard/BrowseMealsPage";
import TrackOrderPage from "./dashboard/TrackOrderPage";
import ProfilePage from "./dashboard/ProfilePage";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Browse Meals", url: "/dashboard/meals", icon: Utensils },
  { title: "My Subscription", url: "/dashboard/subscription", icon: CalendarDays },
  { title: "Track Order", url: "/dashboard/track", icon: Truck },
  { title: "Order History", url: "/dashboard/history", icon: Clock },
  { title: "Profile", url: "/dashboard/profile", icon: User },
];

const pages: Record<string, { title: string; component: React.FC }> = {
  meals: { title: "Browse Meals", component: BrowseMealsPage },
  subscription: { title: "My Subscription", component: SubscriptionPage },
  track: { title: "Track Order", component: TrackOrderPage },
  history: { title: "Order History", component: OrderHistoryPage },
  profile: { title: "Profile", component: ProfilePage },
};

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
      {Object.entries(pages).map(([path, { title, component: Component }]) => (
        <Route
          key={path}
          path={path}
          element={
            <DashboardLayout title={title} navItems={navItems} groupLabel="Menu">
              <Component />
            </DashboardLayout>
          }
        />
      ))}
    </Routes>
  );
}
