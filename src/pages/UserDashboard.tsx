import React, { lazy, Suspense } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { LayoutGrid, Utensils, CalendarDays, Truck, Clock, User, Sparkles } from "lucide-react";
import { Routes, Route } from "react-router-dom";
import { SkeletonBox } from "@/components/PremiumLoader";

// High-Performance Dynamic Imports
const DashboardHome = lazy(() => import("./dashboard/DashboardHome"));
const SubscriptionPage = lazy(() => import("./dashboard/SubscriptionPage"));
const OrderHistoryPage = lazy(() => import("./dashboard/OrderHistoryPage"));
const BrowseMealsPage = lazy(() => import("./dashboard/BrowseMealsPage"));
const WeeklyPlannerPage = lazy(() => import("./dashboard/WeeklyPlannerPage"));
const TrackOrderPage = lazy(() => import("./dashboard/TrackOrderPage"));
const ProfilePage = lazy(() => import("./dashboard/ProfilePage"));

const ModuleLoader = () => (
  <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="flex items-center gap-6">
       <SkeletonBox className="h-44 flex-1" />
       <SkeletonBox className="h-44 w-1/3" />
    </div>
    <SkeletonBox className="h-96 w-full" />
  </div>
);

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutGrid },
  { title: "Browse Meals", url: "/dashboard/meals", icon: Utensils },
  { title: "Weekly Planner", url: "/dashboard/planner", icon: Sparkles },
  { title: "My Subscription", url: "/dashboard/subscription", icon: CalendarDays },
  { title: "Track Order", url: "/dashboard/track", icon: Truck },
  { title: "Order History", url: "/dashboard/history", icon: Clock },
  { title: "Profile", url: "/dashboard/profile", icon: User },
];

const pages: Record<string, { title: string; component: React.FC }> = {
  meals: { title: "Browse Meals", component: BrowseMealsPage },
  planner: { title: "Weekly Planner", component: WeeklyPlannerPage },
  subscription: { title: "My Subscription", component: SubscriptionPage },
  track: { title: "Track Order", component: TrackOrderPage },
  history: { title: "Order History", component: OrderHistoryPage },
  profile: { title: "Profile", component: ProfilePage },
};

export default function UserDashboard() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <Routes>
        <Route
          index
          element={
            <DashboardLayout title="Overview" navItems={navItems} groupLabel="Customer Dashboard">
              <DashboardHome />
            </DashboardLayout>
          }
        />
        {Object.entries(pages).map(([path, { title, component: Component }]) => (
          <React.Fragment key={path}>
            <Route
              path={path}
              element={
                <DashboardLayout title={title} navItems={navItems} groupLabel="Customer Dashboard">
                  <Component />
                </DashboardLayout>
              }
            />
            {path === 'track' && (
              <Route
                path="track/:id"
                element={
                  <DashboardLayout title={title} navItems={navItems} groupLabel="Customer Dashboard">
                    <Component />
                  </DashboardLayout>
                }
              />
            )}
          </React.Fragment>
        ))}
      </Routes>
    </Suspense>
  );
}
