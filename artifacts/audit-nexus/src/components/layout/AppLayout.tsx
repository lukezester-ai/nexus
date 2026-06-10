import { Link, useLocation } from "wouter";
import { 
  BarChart3, 
  Search, 
  FileText, 
  FileSignature, 
  Users, 
  Briefcase,
  Settings,
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
  Activity
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/", icon: BarChart3 },
    { name: "Audits", href: "/audits", icon: Search },
    { name: "Proposals", href: "/proposals", icon: FileText },
    { name: "Contracts", href: "/contracts", icon: FileSignature },
    { name: "Clients", href: "/clients", icon: Users },
    { name: "Projects", href: "/projects", icon: Briefcase },
  ];

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col z-20 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="h-14 flex items-center px-4 border-b border-sidebar-border gap-3 shrink-0">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && <span className="font-semibold text-sidebar-foreground tracking-tight text-lg">AuditNexus</span>}
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-2 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.name} href={item.href}>
                <div 
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-all duration-200 group ${
                    isActive 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  } ${collapsed ? "justify-center" : ""}`}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className={`shrink-0 ${isActive ? "text-primary" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80"} ${collapsed ? "w-5 h-5" : "w-4 h-4"}`} />
                  {!collapsed && <span>{item.name}</span>}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-sidebar-border shrink-0">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            title={collapsed ? "Settings" : undefined}
          >
            <Avatar className="h-8 w-8 rounded shrink-0 border border-sidebar-border group-hover:border-sidebar-accent transition-colors">
              <AvatarFallback className="bg-sidebar-accent text-xs">AN</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex flex-col flex-1 overflow-hidden">
                <span className="text-sm font-medium text-sidebar-foreground truncate">Admin User</span>
                <span className="text-xs text-sidebar-foreground/50 truncate">admin@auditnexus.com</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden relative">
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0 z-10">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 relative text-muted-foreground hover:text-foreground">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary border-2 border-card" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-muted/20 relative">
          {children}
        </div>
      </main>
    </div>
  );
}
