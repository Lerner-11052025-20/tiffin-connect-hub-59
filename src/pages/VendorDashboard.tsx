import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, UtensilsCrossed, Package, DollarSign, Store } from "lucide-react";
import { Routes, Route } from "react-router-dom";
import VendorHome from "./vendor/VendorHome";
import MenuManagementPage from "./vendor/MenuManagementPage";
import IncomingOrdersPage from "./vendor/IncomingOrdersPage";
import EarningsPage from "./vendor/EarningsPage";
import BusinessProfilePage from "./vendor/BusinessProfilePage";

const navItems = [
  { title: "Overview", url: "/vendor", icon: LayoutDashboard },
  { title: "Menu Management", url: "/vendor/menu", icon: UtensilsCrossed },
  { title: "Incoming Orders", url: "/vendor/orders", icon: Package },
  { title: "Earnings", url: "/vendor/earnings", icon: DollarSign },
  { title: "Business Profile", url: "/vendor/profile", icon: Store },
];

const pages: Record<string, { title: string; component: React.FC }> = {
  menu: { title: "Menu Management", component: MenuManagementPage },
  orders: { title: "Incoming Orders", component: IncomingOrdersPage },
  earnings: { title: "Earnings", component: EarningsPage },
  profile: { title: "Business Profile", component: BusinessProfilePage },
};

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
      {Object.entries(pages).map(([path, { title, component: Component }]) => (
        <Route
          key={path}
          path={path}
          element={
            <DashboardLayout title={title} navItems={navItems} groupLabel="Vendor">
              <Component />
            </DashboardLayout>
          }
        />
      ))}
    </Routes>
  );
}
