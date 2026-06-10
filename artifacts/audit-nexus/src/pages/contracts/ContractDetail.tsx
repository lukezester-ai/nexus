import { useGetContract, useUpdateContract } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { ArrowLeft, FileSignature, Download, Building, Calendar, DollarSign, CheckCircle2, PlayCircle, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
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
      <div className="space-y-6 max-w-[1600px] mx-auto">
        <div className="font-mono text-sm text-primary animate-pulse uppercase">
          [ Fetching Contract... ]
        </div>
      </div>
    );
  }

  const handleSign = async () => {
    try {
      await updateContract.mutateAsync({
        id: contractId,
        data: { status: "signed", signedAt: new Date().toISOString() }
      });
      toast({ title: "STATE: SIGNED" });
      refetch();
    } catch (e) {
      toast({ title: "ERR: MUTATION FAILED", variant: "destructive" });
    }
  };

  const handleActivate = async () => {
    try {
      await updateContract.mutateAsync({
        id: contractId,
        data: { status: "active", startDate: new Date().toISOString() }
      });
      toast({ title: "STATE: ACTIVE" });
      refetch();
    } catch (e) {
      toast({ title: "ERR: MUTATION FAILED", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Link href="/contracts" className="inline-flex items-center text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-3 h-3 mr-2" /> Return to Ledger
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-none font-mono text-[10px] uppercase font-bold border-border gap-2 h-8">
            <Download className="w-3 h-3" /> Dump PDF
          </Button>
          
          {(contract.status === "draft" || contract.status === "sent") && (
            <Button size="sm" className="rounded-none font-mono text-[10px] uppercase font-bold border border-primary gap-2 h-8" onClick={handleSign}>
              <FileSignature className="w-3 h-3" /> Execute Sign
            </Button>
          )}
          
          {contract.status === "signed" && (
            <Button size="sm" className="rounded-none font-mono text-[10px] uppercase font-bold bg-green-500 hover:bg-green-600 text-black gap-2 h-8" onClick={handleActivate}>
              <PlayCircle className="w-3 h-3" /> Init Project
            </Button>
          )}
        </div>
      </div>

      <div className="bg-card border border-border shadow-none rounded-none overflow-hidden relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
        
        <div className="bg-muted/10 p-8 border-b border-border flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="pl-4">
            <h1 className="text-2xl font-bold uppercase tracking-widest text-foreground mb-2 flex items-center gap-3">
              <Terminal className="w-6 h-6 text-primary" /> {contract.title}
            </h1>
            <div className="flex items-center gap-4">
              <StatusBadge status={contract.status} />
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">DOC-ID: {contract.id.toString().padStart(6, '0')}</span>
            </div>
          </div>
          
          <div className="bg-background border border-border p-4 min-w-[200px] text-right">
            <div className="font-mono text-[10px] uppercase tracking-widest text-primary mb-1">Contract Value</div>
            <div className="font-mono text-3xl font-bold text-foreground">
              ${contract.totalAmount?.toLocaleString() || 0}
              <span className="text-sm font-normal text-muted-foreground ml-2">{contract.currency}</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border border-b border-border bg-background">
          <div className="p-6">
            <div className="font-mono text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
              <Building className="w-3 h-3" /> Principal
            </div>
            <div className="font-mono text-sm font-bold uppercase tracking-wider">{contract.clientName}</div>
            <div className="font-mono text-xs text-muted-foreground">{contract.clientEmail}</div>
          </div>
          <div className="p-6">
            <div className="font-mono text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
              <Calendar className="w-3 h-3" /> Chronology
            </div>
            <div className="font-mono text-xs space-y-1">
              {contract.startDate ? (
                <div>Start: <span className="text-foreground">{format(new Date(contract.startDate), "yyyy-MM-dd")}</span></div>
              ) : (
                <div className="text-muted-foreground">[ PENDING ]</div>
              )}
              {contract.endDate && (
                <div>End: <span className="text-foreground">{format(new Date(contract.endDate), "yyyy-MM-dd")}</span></div>
              )}
            </div>
          </div>
          <div className="p-6">
            <div className="font-mono text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-3 h-3" /> State
            </div>
            <div className="font-mono text-xs">
              {contract.signedAt ? (
                <div className="space-y-1">
                  <div className="text-green-500 font-bold uppercase tracking-wider">[ SIGNED ]</div>
                  <div className="text-muted-foreground">{format(new Date(contract.signedAt), "yyyy-MM-dd HH:mm")}</div>
                </div>
              ) : (
                <div className="text-amber-500 font-bold uppercase tracking-wider">[ AWAITING SIG ]</div>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-8 sm:p-12 bg-background min-h-[500px]">
          <div className="font-mono text-sm leading-loose whitespace-pre-wrap text-foreground/80 max-w-4xl mx-auto border border-border p-8 bg-muted/5 relative">
            <div className="absolute top-0 right-0 p-2 font-mono text-[10px] text-muted-foreground opacity-50 uppercase">EOF_BLOCK</div>
            {contract.content || "Standard terms and conditions apply. Scope of work is attached as Exhibit A."}
          </div>
          
          <div className="mt-20 pt-10 border-t border-border grid grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div>
              <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-12">Provider Sig Block</div>
              <div className="border-b border-border w-full mb-2"></div>
              <div className="font-mono text-sm font-bold uppercase">AuditNexus Inc.</div>
              <div className="font-mono text-[10px] text-muted-foreground mt-1">TS: {contract.signedAt ? format(new Date(contract.signedAt), "yyyy-MM-dd HH:mm") : "[ NULL ]"}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-12">Client Sig Block</div>
              <div className="border-b border-border w-full mb-2"></div>
              <div className="font-mono text-sm font-bold uppercase">{contract.clientName}</div>
              <div className="font-mono text-[10px] text-muted-foreground mt-1">TS: {contract.signedAt ? format(new Date(contract.signedAt), "yyyy-MM-dd HH:mm") : "[ NULL ]"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
