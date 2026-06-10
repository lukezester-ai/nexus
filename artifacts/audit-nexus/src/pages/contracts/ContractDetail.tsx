import { useGetContract, useUpdateContract } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { ArrowLeft, FileSignature, Download, Building, Calendar, DollarSign, CheckCircle2, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export function ContractDetail() {
  const { id } = useParams();
  const contractId = Number(id);
  const { toast } = useToast();
  
  const { data: contract, isLoading, refetch } = useGetContract(contractId, {
    query: { enabled: !!contractId }
  });
  
  const updateContract = useUpdateContract();

  if (isLoading || !contract) {
    return (
      <div className="p-8 space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  const handleSign = async () => {
    try {
      await updateContract.mutateAsync({
        id: contractId,
        data: { 
          status: "signed",
          signedAt: new Date().toISOString()
        }
      });
      toast({ title: "Contract marked as signed" });
      refetch();
    } catch (e) {
      toast({ title: "Failed to sign contract", variant: "destructive" });
    }
  };

  const handleActivate = async () => {
    try {
      await updateContract.mutateAsync({
        id: contractId,
        data: { 
          status: "active",
          startDate: new Date().toISOString()
        }
      });
      toast({ title: "Contract activated, project can begin" });
      refetch();
    } catch (e) {
      toast({ title: "Failed to activate contract", variant: "destructive" });
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Link href="/contracts" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Contracts
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" /> Download PDF
          </Button>
          
          {(contract.status === "draft" || contract.status === "sent") && (
            <Button size="sm" className="gap-2" onClick={handleSign}>
              <FileSignature className="w-4 h-4" /> Mark Signed
            </Button>
          )}
          
          {contract.status === "signed" && (
            <Button size="sm" className="bg-primary text-primary-foreground gap-2" onClick={handleActivate}>
              <PlayCircle className="w-4 h-4" /> Activate Project
            </Button>
          )}
        </div>
      </div>

      <Card className="overflow-hidden shadow-md border-t-8 border-t-primary relative">
        <CardContent className="p-0">
          <div className="bg-muted/30 p-8 border-b border-border flex flex-col md:flex-row justify-between gap-6">
            <div>
              <h1 className="text-3xl font-serif font-bold tracking-tight mb-2 text-foreground">{contract.title}</h1>
              <div className="flex items-center gap-3">
                <StatusBadge status={contract.status} />
                <span className="text-sm text-muted-foreground font-mono">ID: {contract.id.toString().padStart(6, '0')}</span>
              </div>
            </div>
            
            <div className="bg-background rounded-xl p-4 border border-border shrink-0 min-w-[200px]">
              <div className="text-sm text-muted-foreground font-medium mb-1 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" /> Contract Value
              </div>
              <div className="text-3xl font-bold">
                ${contract.totalAmount?.toLocaleString() || 0}
                <span className="text-base font-normal text-muted-foreground ml-1">{contract.currency}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border border-b border-border bg-background">
            <div className="p-6">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Building className="w-4 h-4" /> Client
              </div>
              <div className="font-medium text-lg">{contract.clientName}</div>
              <div className="text-muted-foreground">{contract.clientEmail}</div>
            </div>
            <div className="p-6">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Timeline
              </div>
              {contract.startDate ? (
                <div>Starts: <span className="font-medium">{format(new Date(contract.startDate), "MMM d, yyyy")}</span></div>
              ) : (
                <div className="text-muted-foreground italic">Start date pending</div>
              )}
              {contract.endDate && (
                <div className="mt-1">Ends: <span className="font-medium">{format(new Date(contract.endDate), "MMM d, yyyy")}</span></div>
              )}
            </div>
            <div className="p-6">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Execution
              </div>
              {contract.signedAt ? (
                <div>
                  <div className="text-green-600 font-medium flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-4 h-4" /> Signed
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(contract.signedAt), "MMM d, yyyy 'at' h:mm a")}
                  </div>
                </div>
              ) : (
                <div className="text-amber-600 font-medium italic">Awaiting signature</div>
              )}
            </div>
          </div>
          
          <div className="p-8 sm:p-12 bg-white dark:bg-neutral-950 min-h-[500px]">
            <div className="prose dark:prose-invert max-w-none font-serif text-lg leading-relaxed whitespace-pre-wrap text-neutral-800 dark:text-neutral-200">
              {contract.content || "Standard terms and conditions apply. Scope of work is attached as Exhibit A."}
            </div>
            
            <div className="mt-20 pt-10 border-t border-border/50 grid grid-cols-2 gap-12">
              <div>
                <div className="text-sm text-muted-foreground mb-12">Provider Signature</div>
                <div className="border-b border-foreground/30 w-full mb-2"></div>
                <div className="text-sm font-medium">AuditNexus Inc.</div>
                <div className="text-xs text-muted-foreground">Date: {contract.signedAt ? format(new Date(contract.signedAt), "MMM d, yyyy") : "___________"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-12">Client Signature</div>
                <div className="border-b border-foreground/30 w-full mb-2"></div>
                <div className="text-sm font-medium">{contract.clientName}</div>
                <div className="text-xs text-muted-foreground">Date: {contract.signedAt ? format(new Date(contract.signedAt), "MMM d, yyyy") : "___________"}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
