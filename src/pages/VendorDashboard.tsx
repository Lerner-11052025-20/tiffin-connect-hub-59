import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, UtensilsCrossed, Package, DollarSign, Store, MessageSquare } from "lucide-react";
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { SkeletonBox } from "@/components/PremiumLoader";

// Smart Component Splitting
const VendorHome = lazy(() => import("./vendor/VendorHome"));
const MenuManagementPage = lazy(() => import("./vendor/MenuManagementPage"));
const IncomingOrdersPage = lazy(() => import("./vendor/IncomingOrdersPage"));
const EarningsPage = lazy(() => import("./vendor/EarningsPage"));
const BusinessProfilePage = lazy(() => import("./vendor/BusinessProfilePage"));
const VendorReviewsPage = lazy(() => import("./vendor/VendorReviewsPage"));

const ModuleLoader = () => (
  <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <SkeletonBox className="h-32" />
      <SkeletonBox className="h-32" />
      <SkeletonBox className="h-32" />
      <SkeletonBox className="h-32" />
    </div>
    <div className="flex gap-6">
      <SkeletonBox className="h-[500px] flex-1" />
      <SkeletonBox className="h-[500px] w-80 hidden lg:block" />
    </div>
  </div>
);

const navItems = [
  { title: "Overview", url: "/vendor", icon: LayoutDashboard },
  { title: "Menu Management", url: "/vendor/menu", icon: UtensilsCrossed },
  { title: "Incoming Orders", url: "/vendor/orders", icon: Package },
  { title: "Earnings", url: "/vendor/earnings", icon: DollarSign },
  { title: "Ratings & Reviews", url: "/vendor/reviews", icon: MessageSquare },
  { title: "Business Profile", url: "/vendor/profile", icon: Store },
];

const pages: Record<string, { title: string; component: React.FC }> = {
  menu: { title: "Menu Management", component: MenuManagementPage },
  orders: { title: "Incoming Orders", component: IncomingOrdersPage },
  earnings: { title: "Earnings", component: EarningsPage },
  reviews: { title: "Ratings & Reviews", component: VendorReviewsPage },
  profile: { title: "Business Profile", component: BusinessProfilePage },
};

export default function VendorDashboard() {
  return (
    <Suspense fallback={<ModuleLoader />}>
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
    </Suspense>
  );
}
