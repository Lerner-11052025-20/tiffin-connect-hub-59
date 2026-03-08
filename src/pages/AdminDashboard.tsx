import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, Users, ChefHat, Package, BarChart3 } from "lucide-react";
import { Routes, Route } from "react-router-dom";
import AdminHome from "./admin/AdminHome";
import UsersPage from "./admin/UsersPage";
import VendorsPage from "./admin/VendorsPage";
import OrdersPage from "./admin/OrdersPage";
import AnalyticsPage from "./admin/AnalyticsPage";

const navItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Vendors", url: "/admin/vendors", icon: ChefHat },
  { title: "Orders", url: "/admin/orders", icon: Package },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
];

const pages: Record<string, { title: string; component: React.FC }> = {
  users: { title: "Users", component: UsersPage },
  vendors: { title: "Vendors", component: VendorsPage },
  orders: { title: "Orders", component: OrdersPage },
  analytics: { title: "Analytics", component: AnalyticsPage },
};

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
  );
}
