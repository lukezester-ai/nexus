import { Link } from "wouter";
import { Activity, ArrowUpRight, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border pt-20 pb-10 overflow-hidden relative">
      <div className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-primary/20 blur-[150px] rounded-full" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="relative flex items-center justify-center w-8 h-8 rounded bg-primary/10 border border-primary/30">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <span className="font-serif font-bold text-xl tracking-wider text-foreground">
                NEXUS<span className="text-muted-foreground font-light text-lg">ECO</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-mono">
              The command center for enterprise decision-makers. Intelligence, law, commerce, and growth—unified.
            </p>
            <div className="flex items-center gap-4 text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-primary transition-colors"><Github className="w-5 h-5" /></a>
              <a href="#" className="hover:text-primary transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-mono text-sm tracking-widest uppercase text-foreground mb-6">Ecosystem</h4>
            <ul className="space-y-4">
              <li><a href="#terraiq" className="text-muted-foreground hover:text-primary text-sm transition-colors flex items-center gap-2 group"><ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /> TerraIQ</a></li>
              <li><a href="#agrinexus" className="text-muted-foreground hover:text-primary text-sm transition-colors flex items-center gap-2 group"><ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /> AgriNexus Law</a></li>
              <li><a href="#fieldlot" className="text-muted-foreground hover:text-primary text-sm transition-colors flex items-center gap-2 group"><ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /> FieldLot</a></li>
              <li><a href="#auditnexus" className="text-muted-foreground hover:text-primary text-sm transition-colors flex items-center gap-2 group"><ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /> AuditNexus</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-mono text-sm tracking-widest uppercase text-foreground mb-6">Company</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">About</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Careers</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Press</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-mono text-sm tracking-widest uppercase text-foreground mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Security</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-mono text-muted-foreground">
            © {new Date().getFullYear()} NEXUS Ecosystem. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-chart-2 shadow-[0_0_8px_hsl(var(--chart-2))]" />
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
