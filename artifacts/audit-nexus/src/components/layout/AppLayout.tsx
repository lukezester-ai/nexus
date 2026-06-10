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
  Activity,
  TerminalSquare
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: "Terminal", href: "/", icon: TerminalSquare },
    { name: "Audits", href: "/audits", icon: Search },
    { name: "Proposals", href: "/proposals", icon: FileText },
    { name: "Contracts", href: "/contracts", icon: FileSignature },
    { name: "Clients", href: "/clients", icon: Users },
    { name: "Projects", href: "/projects", icon: Briefcase },
  ];

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-sm font-mono text-foreground">
      {/* Sidebar */}
      <aside 
        className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col z-20 ${
          collapsed ? "w-14" : "w-56"
        }`}
      >
        <div className="h-12 flex items-center px-4 border-b border-sidebar-border gap-3 shrink-0 bg-sidebar/50">
          <Activity className="w-4 h-4 text-primary" />
          {!collapsed && <span className="font-bold tracking-widest text-primary uppercase text-xs">AuditNexus</span>}
        </div>
        
        <div className="flex-1 overflow-y-auto py-2 flex flex-col">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.name} href={item.href}>
                <div 
                  className={`flex items-center gap-3 px-4 py-2 cursor-pointer group uppercase text-xs tracking-wider ${
                    isActive 
                      ? "bg-primary/10 text-primary border-l-2 border-primary" 
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground border-l-2 border-transparent"
                  } ${collapsed ? "justify-center px-0" : ""}`}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className={`shrink-0 w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                  {!collapsed && <span>{item.name}</span>}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-sidebar-border shrink-0 bg-sidebar/50">
          <div className="flex items-center gap-3">
            <Avatar className="h-6 w-6 rounded-none border border-sidebar-border shrink-0">
              <AvatarFallback className="bg-transparent text-[10px] text-muted-foreground font-mono">AN</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex flex-col flex-1 overflow-hidden">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider truncate">SYS.ADMIN</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden relative">
        <header className="h-12 border-b border-border bg-card/50 flex items-center justify-between px-4 shrink-0 z-10 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 rounded-none hover:bg-accent hover:text-accent-foreground"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <PanelLeftOpen className="h-3 w-3" /> : <PanelLeftClose className="h-3 w-3" />}
            </Button>
            <div className="text-xs text-muted-foreground">
              [ {new Date().toISOString().split('T')[0]} ] {location.toUpperCase()}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-none hover:bg-accent text-muted-foreground hover:text-accent-foreground relative">
              <Bell className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-none hover:bg-accent text-muted-foreground hover:text-accent-foreground">
              <Settings className="h-3 w-3" />
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-auto relative p-4">
          <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          {children}
        </div>
      </main>
    </div>
  );
}
