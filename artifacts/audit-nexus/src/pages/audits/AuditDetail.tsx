import { useGetAudit } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { ArrowLeft, RefreshCw, FileText, CheckCircle2, AlertTriangle, ExternalLink, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export function AuditDetail() {
  const { id } = useParams();
  const auditId = Number(id);
  const { data: audit, isLoading, refetch } = useGetAudit(auditId, {
    query: {
      enabled: !!auditId,
      refetchInterval: (data) => 
        (data?.state?.data?.status === 'pending' || data?.state?.data?.status === 'running') ? 2000 : false,
    }
  });

  if (isLoading || !audit) {
    return (
      <div className="space-y-6 max-w-[1600px] mx-auto">
        <div className="font-mono text-sm text-primary animate-pulse uppercase">
          [ Fetching Scan Results... ]
        </div>
      </div>
    );
  }

  const isRunning = audit.status === "pending" || audit.status === "running";
  
  const getScoreColor = (score: number | null | undefined) => {
    if (score == null) return "text-muted-foreground";
    if (score >= 80) return "text-green-500";
    if (score >= 50) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <Link href="/audits" className="inline-flex items-center text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-3 h-3 mr-2" /> Return to Database
        </Link>
        <div className="flex gap-2">
          {isRunning && (
            <Button variant="outline" size="sm" onClick={() => refetch()} className="rounded-none font-mono text-[10px] uppercase gap-2 h-8 border-border">
              <RefreshCw className="w-3 h-3 animate-spin" /> Polling...
            </Button>
          )}
          {audit.status === "completed" && (
            <Link href={`/proposals/new?auditId=${audit.id}`}>
              <Button size="sm" className="rounded-none font-mono text-[10px] uppercase tracking-widest font-bold border border-primary gap-2 h-8">
                <FileText className="w-3 h-3" /> Gen Proposal
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="bg-card border border-border rounded-none p-0 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
        <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6 md:items-start">
          <div className="space-y-4 flex-1 pl-4">
            <div>
              <div className="flex items-center gap-3 text-2xl font-bold tracking-widest uppercase text-foreground mb-1">
                <Terminal className="w-6 h-6 text-primary" />
                {audit.url}
                <a href={audit.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
              <div className="font-mono text-xs tracking-widest uppercase text-muted-foreground flex gap-4 items-center">
                <span>Entity: <span className="text-foreground">{audit.clientName || "UNKNOWN"}</span></span>
                <span>ID: {audit.id.toString().padStart(6, '0')}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <StatusBadge status={audit.status} />
            </div>
          </div>
          
          <div className="shrink-0 flex items-center justify-center flex-col border border-border bg-background p-6 min-w-[160px]">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Aggregate Vector</span>
            <span className={cn("text-6xl font-black font-mono leading-none tracking-tighter", getScoreColor(audit.overallScore))}>
              {audit.overallScore != null ? audit.overallScore : "---"}
            </span>
          </div>
        </div>

        {isRunning && (
          <div className="p-6 border-t border-border bg-muted/10">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-primary mb-3">
              <span className="flex items-center gap-2"><RefreshCw className="w-3 h-3 animate-spin" /> Stream active...</span>
              <span>{audit.status === 'running' ? '65%' : '20%'}</span>
            </div>
            <Progress value={audit.status === 'running' ? 65 : 20} className="h-1 rounded-none bg-border" indicatorClassName="bg-primary" />
          </div>
        )}
      </div>

      {audit.status === "completed" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ScoreCard title="SEARCH INDEX (SEO)" score={audit.seoScore} data={audit.seoData} colorClass="bg-blue-500" />
          <ScoreCard title="LOCAL GRAPH (GEO)" score={audit.geoScore} data={audit.geoData} colorClass="bg-purple-500" />
          <ScoreCard title="AI ANSWERS (AEO)" score={audit.aeoScore} data={audit.aeoData} colorClass="bg-amber-500" />
        </div>
      )}

      {audit.status === "completed" && (
        <div className="bg-card border border-border rounded-none mt-6">
          <Tabs defaultValue="seo" className="w-full">
            <div className="border-b border-border px-6 pt-4 bg-muted/5">
              <TabsList className="bg-transparent space-x-6 pb-0">
                {["seo", "geo", "aeo"].map((tab) => (
                  <TabsTrigger 
                    key={tab} 
                    value={tab} 
                    className="font-mono text-[10px] tracking-widest uppercase data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 pb-3"
                  >
                    {tab} Telemetry
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            <div className="p-6">
              <TabsContent value="seo" className="mt-0 outline-none"><DataSection data={audit.seoData} /></TabsContent>
              <TabsContent value="geo" className="mt-0 outline-none"><DataSection data={audit.geoData} /></TabsContent>
              <TabsContent value="aeo" className="mt-0 outline-none"><DataSection data={audit.aeoData} /></TabsContent>
            </div>
          </Tabs>
        </div>
      )}
    </div>
  );
}

function ScoreCard({ title, score, data, colorClass }: { title: string, score: number | null | undefined, data: any, colorClass: string }) {
  const issuesCount = data?.issues?.length || 0;
  
  return (
    <div className="bg-card border border-border p-5 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-6">
        <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{title}</h3>
        {issuesCount > 0 && (
          <span className="font-mono text-[10px] uppercase text-destructive flex items-center gap-1 bg-destructive/10 px-2 py-0.5 border border-destructive/20">
            <AlertTriangle className="w-3 h-3" /> {issuesCount} Err
          </span>
        )}
      </div>
      <div className="font-mono text-5xl font-bold tracking-tighter text-foreground mb-4">
        {score || "00"}
      </div>
      <Progress value={score || 0} className="h-1 rounded-none bg-border" indicatorClassName={colorClass} />
    </div>
  );
}

function DataSection({ data }: { data: any }) {
  if (!data) return <div className="font-mono text-sm text-muted-foreground uppercase text-center py-8">No data stream available</div>;
  
  const issues = data.issues || [];
  const recommendations = data.recommendations || [];
  const subScores = Object.entries(data).filter(([key, value]) => key.endsWith('Score') && typeof value === 'number');

  return (
    <div className="space-y-8">
      {subScores.length > 0 && (
        <div>
          <h3 className="font-mono text-[10px] uppercase tracking-widest text-primary mb-4 border-b border-border pb-2">Component Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {subScores.map(([key, value]) => (
              <div key={key} className="border border-border p-3 bg-background flex flex-col items-start justify-between">
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
                  {key.replace('Score', '').replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="font-mono text-2xl font-bold text-foreground">{String(value).padStart(2, '0')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-destructive/20 bg-destructive/5 p-4">
          <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-destructive flex items-center gap-2 mb-4 border-b border-destructive/20 pb-2">
            <AlertTriangle className="w-4 h-4" /> Detected Anomalies
          </h3>
          <ul className="space-y-2">
            {issues.length === 0 ? (
              <li className="font-mono text-[10px] uppercase text-muted-foreground">Optimal. No anomalies detected.</li>
            ) : (
              issues.map((issue: string, i: number) => (
                <li key={i} className="flex items-start gap-3 font-mono text-xs text-destructive/90 leading-tight">
                  <span className="shrink-0 text-destructive mt-0.5">[!]</span>
                  {issue}
                </li>
              ))
            )}
          </ul>
        </div>
        
        <div className="border border-green-500/20 bg-green-500/5 p-4">
          <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-green-500 flex items-center gap-2 mb-4 border-b border-green-500/20 pb-2">
            <CheckCircle2 className="w-4 h-4" /> Resolution Directives
          </h3>
          <ul className="space-y-2">
            {recommendations.length === 0 ? (
              <li className="font-mono text-[10px] uppercase text-muted-foreground">No directives logged.</li>
            ) : (
              recommendations.map((rec: string, i: number) => (
                <li key={i} className="flex items-start gap-3 font-mono text-xs text-green-500/90 leading-tight">
                  <span className="shrink-0 text-green-500 mt-0.5">{">"}</span>
                  {rec}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
