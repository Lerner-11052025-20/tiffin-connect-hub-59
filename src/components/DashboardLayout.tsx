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
import { LucideIcon, LogOut } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  navItems: { title: string; url: string; icon: LucideIcon }[];
  groupLabel: string;
}

function InnerSidebar({ navItems, groupLabel }: Pick<DashboardLayoutProps, "navItems" | "groupLabel">) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent className="glass-subtle">
        <div className={`p-4 ${collapsed ? "px-2" : "px-4"} border-b border-border/30`}>
          <Link to="/" className="flex items-center gap-2">
            <motion.span whileHover={{ rotate: 12 }} className="text-xl">🍱</motion.span>
            {!collapsed && (
              <span className="font-heading font-bold text-sm text-foreground">TIFFIN<span className="text-gradient">CONNECT</span></span>
            )}
          </Link>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground/60 text-[10px] uppercase tracking-widest">{groupLabel}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className="hover:bg-primary/5 rounded-xl transition-all" activeClassName="bg-primary/10 text-primary font-medium shadow-sm">
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
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full">
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
      <div className="min-h-screen flex w-full mesh-bg">
        <InnerSidebar navItems={navItems} groupLabel={groupLabel} />
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center border-b border-border/30 px-6 gap-3 glass-subtle">
            <SidebarTrigger />
            <h1 className="font-heading font-semibold text-foreground text-lg">{title}</h1>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
