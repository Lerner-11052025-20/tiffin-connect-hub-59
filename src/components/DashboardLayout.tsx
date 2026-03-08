import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
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
import { LucideIcon } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  navItems: { title: string; url: string; icon: LucideIcon }[];
  groupLabel: string;
}

function InnerSidebar({ navItems, groupLabel }: Pick<DashboardLayoutProps, "navItems" | "groupLabel">) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className={`p-4 ${collapsed ? "px-2" : ""}`}>
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl">🍱</span>
            {!collapsed && (
              <span className="font-heading font-bold text-sm text-foreground">
                TIFFIN<span className="text-primary">CONNECT</span>
              </span>
            )}
          </Link>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-muted/50"
                      activeClassName="bg-primary/10 text-primary font-medium"
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
      </SidebarContent>
    </Sidebar>
  );
}

export default function DashboardLayout({ children, title, navItems, groupLabel }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <InnerSidebar navItems={navItems} groupLabel={groupLabel} />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b px-4 gap-3 bg-card">
            <SidebarTrigger />
            <h1 className="font-heading font-semibold text-foreground">{title}</h1>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
