import { useGetAudit } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { ArrowLeft, RefreshCw, FileText, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
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
      <div className="p-8 space-y-6">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-32 w-full" />
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
    <div className="p-8 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Link href="/audits" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Audits
        </Link>
        <div className="flex gap-2">
          {isRunning && (
            <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" /> Refreshing...
            </Button>
          )}
          {audit.status === "completed" && (
            <Link href={`/proposals/new?auditId=${audit.id}`}>
              <Button size="sm" className="gap-2">
                <FileText className="w-4 h-4" /> Generate Proposal
              </Button>
            </Link>
          )}
        </div>
      </div>

      <Card className="overflow-hidden border-t-4 border-t-primary">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row justify-between gap-6 md:items-center">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight">{audit.url}</h1>
                <a href={audit.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1 font-medium text-foreground">
                  {audit.clientName || "Unknown Client"}
                </span>
                <span>•</span>
                <span>{audit.clientEmail}</span>
                <span>•</span>
                <StatusBadge status={audit.status} />
              </div>
            </div>
            
            <div className="shrink-0 bg-muted/30 p-4 rounded-xl border border-border flex items-center gap-6">
              <div className="flex flex-col items-center">
                <span className="text-sm font-medium text-muted-foreground mb-1">Overall</span>
                <span className={cn("text-4xl font-black", getScoreColor(audit.overallScore))}>
                  {audit.overallScore != null ? audit.overallScore : "-"}
                </span>
              </div>
            </div>
          </div>

          {isRunning && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between text-sm font-medium">
                <span className="text-primary flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" /> 
                  Analyzing website data...
                </span>
              </div>
              <Progress value={audit.status === 'running' ? 65 : 20} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {audit.status === "completed" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ScoreCard 
            title="Search Engine (SEO)" 
            score={audit.seoScore} 
            data={audit.seoData} 
            colorClass="bg-blue-500" 
          />
          <ScoreCard 
            title="Local & Geo (GEO)" 
            score={audit.geoScore} 
            data={audit.geoData} 
            colorClass="bg-purple-500" 
          />
          <ScoreCard 
            title="AI Answers (AEO)" 
            score={audit.aeoScore} 
            data={audit.aeoData} 
            colorClass="bg-amber-500" 
          />
        </div>
      )}

      {audit.status === "completed" && (
        <Card className="mt-8">
          <Tabs defaultValue="seo" className="w-full">
            <div className="border-b border-border px-6 pt-4">
              <TabsList className="bg-transparent space-x-6 pb-0">
                <TabsTrigger value="seo" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3">
                  SEO Details
                </TabsTrigger>
                <TabsTrigger value="geo" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3">
                  GEO Details
                </TabsTrigger>
                <TabsTrigger value="aeo" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3">
                  AEO Details
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-6">
              <TabsContent value="seo" className="mt-0 space-y-6 outline-none">
                <DataSection data={audit.seoData} />
              </TabsContent>
              <TabsContent value="geo" className="mt-0 space-y-6 outline-none">
                <DataSection data={audit.geoData} />
              </TabsContent>
              <TabsContent value="aeo" className="mt-0 space-y-6 outline-none">
                <DataSection data={audit.aeoData} />
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      )}
    </div>
  );
}

function ScoreCard({ title, score, data, colorClass }: { title: string, score: number | null | undefined, data: any, colorClass: string }) {
  const issuesCount = data?.issues?.length || 0;
  
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold text-muted-foreground mb-4">{title}</h3>
        <div className="flex items-end justify-between mb-4">
          <div className="text-5xl font-black">{score || 0}</div>
          <div className="text-sm font-medium text-destructive flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" /> {issuesCount} Issues
          </div>
        </div>
        <Progress value={score || 0} className="h-2 bg-muted overflow-hidden" indicatorClassName={colorClass} />
      </CardContent>
    </Card>
  );
}

function DataSection({ data }: { data: any }) {
  if (!data) return <div className="text-muted-foreground py-8 text-center">No data available</div>;
  
  const issues = data.issues || [];
  const recommendations = data.recommendations || [];
  
  // Filter out non-numeric score fields
  const subScores = Object.entries(data).filter(([key, value]) => key.endsWith('Score') && typeof value === 'number');

  return (
    <div className="space-y-8">
      {subScores.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Score Breakdown</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {subScores.map(([key, value]) => (
              <div key={key} className="bg-muted/30 border border-border rounded-lg p-4 flex flex-col justify-between">
                <span className="text-sm text-muted-foreground capitalize mb-2">{key.replace('Score', '').replace(/([A-Z])/g, ' $1').trim()}</span>
                <span className="text-2xl font-bold">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-destructive flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5" /> Critical Issues
          </h3>
          <ul className="space-y-3">
            {issues.length === 0 ? (
              <li className="text-muted-foreground text-sm">No issues found.</li>
            ) : (
              issues.map((issue: string, i: number) => (
                <li key={i} className="flex items-start gap-3 bg-red-500/5 border border-red-500/10 p-3 rounded-md text-sm text-red-900 dark:text-red-200">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5" />
                  {issue}
                </li>
              ))
            )}
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-green-600 flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5" /> Recommendations
          </h3>
          <ul className="space-y-3">
            {recommendations.length === 0 ? (
              <li className="text-muted-foreground text-sm">No recommendations available.</li>
            ) : (
              recommendations.map((rec: string, i: number) => (
                <li key={i} className="flex items-start gap-3 bg-green-500/5 border border-green-500/10 p-3 rounded-md text-sm text-green-900 dark:text-green-200">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5" />
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
