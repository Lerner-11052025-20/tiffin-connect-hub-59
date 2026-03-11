import { ReactNode, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { useQueryClient, useIsFetching } from "@tanstack/react-query";
import { LucideIcon, LogOut, User, Settings, ShieldCheck, Activity, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { NotificationBell } from "@/components/NotificationBell";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  navItems: { title: string; url: string; icon: LucideIcon }[];
  groupLabel: string;
}

function InnerSidebar({ navItems, groupLabel }: Pick<DashboardLayoutProps, "navItems" | "groupLabel">) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const handleRefresh = async () => {
    // Hard reset triggers the loading states for a better "reloading" feel
    await queryClient.resetQueries();
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const isVendor = groupLabel.toLowerCase().includes("vendor") || groupLabel.toLowerCase().includes("vender");
  const isAdmin = groupLabel.toLowerCase().includes("admin");

  const scrollToSection = (href: string) => {
    if (href.startsWith("/#")) {
      const id = href.split("#")[1];
      if (location.pathname === "/") {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          return;
        }
      }
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0 bg-background/50">
      <SidebarContent className="bg-card/30 backdrop-blur-xl border-r border-border/40">
        <div className={`p-8 ${collapsed ? "px-2" : "px-8"} mb-4`}>
          <Link 
            to="/#hero" 
            className="flex items-center gap-4 group"
            onClick={() => scrollToSection("/#hero")}
          >
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/20 rounded-[14px] group-hover:bg-primary transition-all duration-500 scale-100 group-hover:scale-110 shadow-[0_0_20px_hsl(var(--primary)/0.3)]" />
              <span className="relative text-xl group-hover:drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)] transition-all duration-500">{isVendor ? "👨‍🍳" : isAdmin ? "⚡" : "🍱"}</span>
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-sans font-bold text-lg text-foreground tracking-tight leading-none">
                  Tiffin<span className="text-primary">Connect</span>
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground mt-1">
                  {isVendor ? "Vendor Dashboard" : isAdmin ? "Admin Dashboard" : "User Dashboard"}
                </span>
              </div>
            )}
          </Link>
        </div>

        <SidebarGroup className="px-3">
          <SidebarGroupLabel className="px-4 text-muted-foreground/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 mt-2 pb-2 border-b border-border/5">
            {collapsed ? "NAV" : "Main Menu"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="h-11 hover:bg-transparent">
                      <NavLink
                        to={item.url}
                        end
                        onClick={handleRefresh}
                        className="flex items-center gap-3 px-4 rounded-xl text-muted-foreground font-medium transition-all duration-300 border border-transparent hover:bg-muted/30 group"
                        activeClassName="bg-primary/10 text-primary font-semibold border-primary/20 shadow-sm"
                      >
                        <item.icon className={`h-5 w-5 transition-all duration-500 ${isActive ? "rotate-0 shadow-white" : "group-hover:scale-110 text-muted-foreground/40 group-hover:text-primary group-hover:rotate-3"}`} />
                        {!collapsed && (
                          <div className="flex items-center justify-between w-full">
                              <span className="text-sm">{item.title}</span>
                            {isActive && (
                                <motion.div
                                  layoutId="sidebar-active-indicator"
                                  className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.4)]"
                                />
                            )}
                          </div>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className={`mt-auto p-4 border-t border-border/5 ${collapsed ? "px-2" : "px-4"}`}>
          <div className={`relative flex ${collapsed ? "flex-col items-center gap-4" : "flex-col gap-2"} bg-muted/20 backdrop-blur-md p-3 rounded-2xl border border-border/10 shadow-inner group/usercard overflow-hidden`}>
            
            {!collapsed && (
              <div className="flex items-center justify-between w-full mb-1">
                <div className="scale-75 origin-top-left -ml-1">
                  <ThemeToggle />
                </div>
                <button
                  onClick={handleLogout}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground/40 hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-90 border border-transparent hover:border-red-500/20"
                  title="Sign Out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            <Link 
              to={isAdmin ? "/admin/analytics" : isVendor ? "/vendor/profile" : "/profile"} 
              onClick={handleRefresh}
              className={`flex items-center transition-all hover:opacity-80 group/userlink overflow-hidden ${collapsed ? 'w-full justify-center' : 'min-w-0 gap-3'}`}
            >
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner group-hover/userlink:rotate-3 transition-transform">
                  <User className="h-5 w-5" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background shadow-lg" />
              </div>
              
              {!collapsed && (
                <div className="flex flex-col min-w-0 pr-1 flex-1">
                  <span className="text-[13px] font-bold text-foreground leading-tight break-words">{user?.full_name || 'Nexus Entity'}</span>
                  <span className="text-[8px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-0.5 opacity-30">Active System Node</span>
                </div>
              )}
            </Link>
            
            {collapsed && (
              <div className="flex flex-col items-center gap-3 w-full border-t border-border/5 pt-3">
                <div className="scale-75">
                  <ThemeToggle />
                </div>
                <button
                  onClick={handleLogout}
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-muted-foreground/40 hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-95 border border-border/10 hover:border-red-500/20"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

export default function DashboardLayout({ children, title, navItems, groupLabel }: DashboardLayoutProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const location = useLocation();
  const isFetching = useIsFetching();
  const isVendor = groupLabel.toLowerCase().includes("vendor") || groupLabel.toLowerCase().includes("vender");

  const handleManualRefresh = () => {
    queryClient.resetQueries();
  };

  // Auto-refresh data on every route change within the dashboard
  useEffect(() => {
    queryClient.invalidateQueries();
  }, [location.pathname, queryClient]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#fcfdfe] dark:bg-[#010409] transition-colors duration-700 font-sans selection:bg-primary selection:text-white">
        <InnerSidebar navItems={navItems} groupLabel={groupLabel} />
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <header className="h-24 flex items-center border-b border-border/10 px-8 lg:px-12 gap-8 bg-background/40 backdrop-blur-2xl sticky top-0 z-30 transition-all duration-500 shrink-0">
            {/* Real-time Loading Indicator */}
            <AnimatePresence>
              {isFetching > 0 && (
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary origin-left z-50 shadow-[0_0_8px_hsl(var(--primary))]"
                />
              )}
            </AnimatePresence>

            <SidebarTrigger className="text-muted-foreground/60 hover:text-primary transition-all duration-500 hover:scale-110 active:scale-95 border-none bg-transparent shadow-none" />

            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-1 h-3 rounded-full ${isVendor ? "bg-primary" : "bg-accent"}`} />
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{groupLabel}</p>
              </div>
              <h1 className="font-bold text-foreground text-2xl lg:text-3xl tracking-tight leading-none">{title}</h1>
            </div>

            <div className="ml-auto flex items-center gap-4 lg:gap-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="hidden sm:flex items-center gap-4 px-6 py-3 rounded-[1.75rem] bg-muted/20 border border-border/40 hover:bg-card hover:border-primary/20 hover:shadow-2xl transition-all duration-500 cursor-pointer group/user shadow-inner"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner group-hover/user:rotate-3 transition-transform">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-background shadow-lg" />
                </div>
                <div className="flex flex-col items-start pr-2">
                  <span className="text-[10px] font-bold text-foreground uppercase tracking-widest">{user?.full_name?.split(' ')[0] || 'User'}</span>
                  <div className="flex items-center gap-1.5 underline decoration-primary/30 underline-offset-4">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-primary">Logged In</span>
                    <Activity className="h-2 w-2 text-primary" />
                  </div>
                </div>
              </motion.div>
              <div className="w-px h-10 bg-border/20 mx-2 hidden sm:block" />
              <button
                onClick={handleManualRefresh}
                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-muted/20 border border-border/40 hover:bg-card hover:border-primary/20 transition-all duration-500 group/refresh"
                title="Refresh Data"
              >
                <RefreshCw className="h-4 w-4 text-muted-foreground/60 group-hover:text-primary transition-all duration-500 group-active:rotate-180" />
              </button>
              <NotificationBell />
            </div>
          </header>

          <main className="flex-1 overflow-y-auto scrollbar-hide bg-[url('/bg-mesh.png')] bg-fixed bg-cover bg-no-repeat">
            <div className="p-8 lg:p-14 max-w-[1700px] mx-auto w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
                  transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
