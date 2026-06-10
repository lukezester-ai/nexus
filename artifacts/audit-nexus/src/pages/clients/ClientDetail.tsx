import { useGetClient } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { ArrowLeft, Building, Mail, Phone, Globe, Briefcase, FileText, CheckCircle2, Search, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export function ClientDetail() {
  const { id } = useParams();
  const clientId = Number(id);
  
  const { data: client, isLoading } = useGetClient(clientId, {
    query: { enabled: !!clientId }
  });

  if (isLoading || !client) {
    return (
      <div className="space-y-6 max-w-[1600px] mx-auto">
        <div className="font-mono text-sm text-primary animate-pulse uppercase">
          [ Fetching Entity... ]
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Link href="/clients" className="inline-flex items-center text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-3 h-3 mr-2" /> Return to Roster
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-none font-mono text-[10px] uppercase font-bold border-border h-8">Modify Data</Button>
          <Link href={`/audits/new?clientName=${encodeURIComponent(client.name)}&clientEmail=${encodeURIComponent(client.email)}`}>
            <Button size="sm" className="rounded-none font-mono text-[10px] uppercase font-bold border border-primary gap-2 h-8">
              <Search className="w-3 h-3" /> Init Scan
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-card border border-border p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
            <div className="w-16 h-16 bg-primary/10 text-primary flex items-center justify-center text-3xl font-mono font-bold mb-6 border border-primary/20">
              {client.name.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-xl font-bold uppercase tracking-widest text-foreground mb-1">{client.name}</h1>
            <p className="font-mono text-xs text-muted-foreground flex items-center gap-2 mb-6 uppercase tracking-wider">
              <Building className="w-3 h-3" /> {client.company || "Independent"}
            </p>
            
            <div className="space-y-4 pt-4 border-t border-border font-mono text-xs">
              <div className="flex items-center gap-3">
                <Mail className="w-3 h-3 text-primary shrink-0" />
                <a href={`mailto:${client.email}`} className="text-foreground hover:text-primary transition-colors truncate">{client.email}</a>
              </div>
              {client.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-3 h-3 text-primary shrink-0" />
                  <span className="text-foreground">{client.phone}</span>
                </div>
              )}
              {client.website && (
                <div className="flex items-center gap-3">
                  <Globe className="w-3 h-3 text-primary shrink-0" />
                  <a href={client.website.startsWith('http') ? client.website : `https://${client.website}`} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors truncate">
                    {client.website}
                  </a>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-card border border-border p-6">
            <h2 className="font-mono text-[10px] uppercase tracking-widest text-primary mb-6 border-b border-border pb-2">Value Metrics</h2>
            <div className="space-y-6">
              <div>
                <div className="font-mono text-[10px] text-muted-foreground uppercase flex items-center gap-2 mb-1">
                  <DollarSign className="w-3 h-3 text-green-500" /> Cum. Revenue
                </div>
                <div className="font-mono text-2xl font-bold text-foreground">${client.totalRevenue?.toLocaleString() || 0}</div>
              </div>
              <div>
                <div className="font-mono text-[10px] text-muted-foreground uppercase flex items-center gap-2 mb-1">
                  <Briefcase className="w-3 h-3 text-blue-500" /> Projects Let
                </div>
                <div className="font-mono text-2xl font-bold text-foreground">{client.totalProjects.toString().padStart(2,'0')}</div>
              </div>
              <div className="font-mono text-[10px] text-muted-foreground pt-4 border-t border-border uppercase">
                Active since {format(new Date(client.createdAt), "yyyy-MM-dd")}
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card border border-border flex flex-col h-full">
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/10">
              <h2 className="font-mono text-[10px] uppercase tracking-widest text-primary">System Log</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[1.125rem] before:h-full before:w-px before:bg-border">
                
                <div className="relative flex items-start gap-6 group">
                  <div className="flex items-center justify-center w-9 h-9 border border-primary bg-background text-primary shrink-0 z-10 mt-1">
                    <Search className="w-4 h-4" />
                  </div>
                  <div className="flex-1 p-4 bg-muted/5 border border-border">
                    <div className="flex justify-between mb-2">
                      <span className="font-mono text-xs font-bold uppercase text-primary">Scan Executed</span>
                      <span className="font-mono text-[10px] text-muted-foreground">T-2d</span>
                    </div>
                    <p className="font-mono text-xs text-foreground/80 leading-relaxed">System scan completed for primary vector. Aggr score: 72.</p>
                  </div>
                </div>

                <div className="relative flex items-start gap-6 group">
                  <div className="flex items-center justify-center w-9 h-9 border border-blue-500 bg-background text-blue-500 shrink-0 z-10 mt-1">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1 p-4 bg-muted/5 border border-border">
                    <div className="flex justify-between mb-2">
                      <span className="font-mono text-xs font-bold uppercase text-blue-500">Proposal Transmitted</span>
                      <span className="font-mono text-[10px] text-muted-foreground">T-1w</span>
                    </div>
                    <p className="font-mono text-xs text-foreground/80 leading-relaxed">Valuation: $4,500. Awaiting target response.</p>
                  </div>
                </div>

                <div className="relative flex items-start gap-6 group">
                  <div className="flex items-center justify-center w-9 h-9 border border-green-500 bg-background text-green-500 shrink-0 z-10 mt-1">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1 p-4 bg-muted/5 border border-border">
                    <div className="flex justify-between mb-2">
                      <span className="font-mono text-xs font-bold uppercase text-green-500">Entity Created</span>
                      <span className="font-mono text-[10px] text-muted-foreground">{format(new Date(client.createdAt), "yyyy-MM-dd")}</span>
                    </div>
                    <p className="font-mono text-xs text-foreground/80 leading-relaxed">Object initialized in DB.</p>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
