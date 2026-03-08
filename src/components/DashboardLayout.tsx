import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { LucideIcon, LogOut, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  navItems: { title: string; url: string; icon: LucideIcon }[];
  groupLabel: string;
}

function InnerSidebar({ navItems, groupLabel }: Pick<DashboardLayoutProps, "navItems" | "groupLabel">) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent className="bg-card/80 backdrop-blur-xl">
        <div className={`p-4 ${collapsed ? "px-2" : "px-4"} border-b border-border/30`}>
          <Link to="/" className="flex items-center gap-2.5">
            <motion.div
              whileHover={{ rotate: 12 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center shadow-glow flex-shrink-0"
            >
              <Zap className="h-4 w-4 text-primary-foreground" />
            </motion.div>
            {!collapsed && (
              <span className="font-heading font-bold text-sm text-foreground tracking-tight">
                Tiffin<span className="text-gradient">Connect</span>
              </span>
            )}
          </Link>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground/50 text-[10px] uppercase tracking-[0.15em] font-bold">{groupLabel}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-primary/5 rounded-xl transition-all duration-200"
                      activeClassName="bg-primary/10 text-primary font-semibold shadow-soft"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4 border-t border-border/30">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors w-full rounded-xl px-2 py-2 hover:bg-destructive/5"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Log Out</span>}
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

export default function DashboardLayout({ children, title, navItems, groupLabel }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <InnerSidebar navItems={navItems} groupLabel={groupLabel} />
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center border-b border-border/30 px-6 gap-4 bg-card/60 backdrop-blur-xl sticky top-0 z-30">
            <SidebarTrigger />
            <div className="w-px h-6 bg-border/40" />
            <h1 className="font-heading font-bold text-foreground text-lg tracking-tight">{title}</h1>
          </header>
          <main className="flex-1 p-6 md:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
