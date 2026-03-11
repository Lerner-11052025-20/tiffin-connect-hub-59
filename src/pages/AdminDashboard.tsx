import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, Users, ChefHat, Package, BarChart3, ShieldAlert } from "lucide-react";
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { SkeletonBox } from "@/components/PremiumLoader";

// Instant Module Loading
const AdminHome = lazy(() => import("./admin/AdminHome"));
const UsersPage = lazy(() => import("./admin/UsersPage"));
const VendorsPage = lazy(() => import("./admin/VendorsPage"));
const OrdersPage = lazy(() => import("./admin/OrdersPage"));
const AnalyticsPage = lazy(() => import("./admin/AnalyticsPage"));
const ReviewModerationPage = lazy(() => import("./admin/ReviewModerationPage"));

const ModuleLoader = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SkeletonBox className="h-32" />
      <SkeletonBox className="h-32" />
      <SkeletonBox className="h-32" />
    </div>
    <SkeletonBox className="h-[400px] w-full" />
  </div>
);

const navItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Vendors", url: "/admin/vendors", icon: ChefHat },
  { title: "Orders", url: "/admin/orders", icon: Package },
  { title: "Moderation", url: "/admin/moderation", icon: ShieldAlert },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
];

const pages: Record<string, { title: string; component: React.FC }> = {
  users: { title: "Users", component: UsersPage },
  vendors: { title: "Vendors", component: VendorsPage },
  orders: { title: "Orders", component: OrdersPage },
  moderation: { title: "Review Moderation", component: ReviewModerationPage },
  analytics: { title: "Analytics", component: AnalyticsPage },
};

export default function AdminDashboard() {
  return (
    <Suspense fallback={<ModuleLoader />}>
      <Routes>
        <Route
          index
          element={
            <DashboardLayout title="Admin Dashboard" navItems={navItems} groupLabel="Admin">
              <AdminHome />
            </DashboardLayout>
          }
        />
        {Object.entries(pages).map(([path, { title, component: Component }]) => (
          <Route
            key={path}
            path={path}
            element={
              <DashboardLayout title={title} navItems={navItems} groupLabel="Admin">
                <Component />
              </DashboardLayout>
            }
          />
        ))}
      </Routes>
    </Suspense>
  );
}
