import { useGetProposal, useUpdateProposal, useCreateContract } from "@workspace/api-client-react";
import { useParams, Link, useLocation } from "wouter";
import { ArrowLeft, FileSignature, CheckCircle, XCircle, Send, Calendar, User, FileText, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export function ProposalDetail() {
  const { id } = useParams();
  const proposalId = Number(id);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { data: proposal, isLoading, refetch } = useGetProposal(proposalId, {
    query: { enabled: !!proposalId }
  });
  
  const updateProposal = useUpdateProposal();
  const createContract = useCreateContract();

  if (isLoading || !proposal) {
    return (
      <div className="space-y-6 max-w-[1600px] mx-auto">
        <div className="font-mono text-sm text-primary animate-pulse uppercase">
          [ Accessing Database... ]
        </div>
      </div>
    );
  }

  const handleStatusChange = async (status: 'sent' | 'accepted' | 'rejected') => {
    try {
      await updateProposal.mutateAsync({ id: proposalId, data: { status } });
      toast({ title: `STATUS: ${status.toUpperCase()}` });
      refetch();
    } catch (e) {
      toast({ title: "ERR: MUTATION FAILED", variant: "destructive" });
    }
  };

  const handleGenerateContract = async () => {
    try {
      const contract = await createContract.mutateAsync({
        data: {
          proposalId: proposal.id,
          clientId: proposal.clientId || undefined,
          clientName: proposal.clientName,
          clientEmail: proposal.clientEmail,
          title: `TX-${proposal.id.toString().padStart(4, '0')}: ${proposal.title}`,
          totalAmount: proposal.totalPrice,
          currency: proposal.currency,
          content: `AGREEMENT DIRECTIVE:\n\nSubject: ${proposal.title}\nValuation: $${proposal.totalPrice} ${proposal.currency}\n\nTerms...`,
        }
      });
      toast({ title: "CONTRACT COMPILED" });
      setLocation(`/contracts/${contract.id}`);
    } catch (e) {
      toast({ title: "ERR: COMPILATION FAILED", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Link href="/proposals" className="inline-flex items-center text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-3 h-3 mr-2" /> Return to Pipeline
        </Link>
        <div className="flex gap-2">
          {proposal.status === "draft" && (
            <Button size="sm" onClick={() => handleStatusChange("sent")} className="rounded-none font-mono text-[10px] uppercase font-bold border border-primary gap-2 h-8">
              <Send className="w-3 h-3" /> Transmit
            </Button>
          )}
          {proposal.status === "sent" && (
            <>
              <Button size="sm" variant="destructive" onClick={() => handleStatusChange("rejected")} className="rounded-none font-mono text-[10px] uppercase font-bold gap-2 h-8">
                <XCircle className="w-3 h-3" /> Reject
              </Button>
              <Button size="sm" onClick={() => handleStatusChange("accepted")} className="rounded-none font-mono text-[10px] uppercase font-bold bg-green-500 hover:bg-green-600 text-black gap-2 h-8">
                <CheckCircle className="w-3 h-3" /> Accept
              </Button>
            </>
          )}
          {proposal.status === "accepted" && (
            <Button size="sm" onClick={handleGenerateContract} className="rounded-none font-mono text-[10px] uppercase font-bold border border-primary gap-2 h-8">
              <FileSignature className="w-3 h-3" /> Compile Contract
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-card border border-border p-0 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            
            <div className="p-8 border-b border-border bg-muted/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="pl-4">
                <h1 className="text-2xl font-bold uppercase tracking-widest text-foreground mb-2 flex items-center gap-3">
                  <FileText className="w-6 h-6 text-primary" /> {proposal.title}
                </h1>
                <div className="flex items-center gap-4">
                  <StatusBadge status={proposal.status} />
                  <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">DOC-ID: {proposal.id.toString().padStart(6, '0')}</span>
                </div>
              </div>
              <div className="bg-background border border-border p-4 min-w-[200px] text-right">
                <div className="font-mono text-[10px] uppercase tracking-widest text-primary mb-1">Valuation</div>
                <div className="font-mono text-3xl font-bold text-foreground">
                  ${proposal.totalPrice?.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">{proposal.currency}</span>
                </div>
              </div>
            </div>
            
            <div className="p-8 space-y-10">
              {proposal.description && (
                <div>
                  <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4 border-b border-border pb-2">Abstract</h3>
                  <p className="font-mono text-sm leading-relaxed text-foreground/80">{proposal.description}</p>
                </div>
              )}
              
              <div>
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-primary mb-4 border-b border-border pb-2">Proposed Modules</h3>
                <div className="space-y-4">
                  {(proposal.services || []).map((service, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border bg-background">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-primary">[{String(idx+1).padStart(2, '0')}]</span>
                          <h4 className="font-mono text-sm font-bold uppercase tracking-wider">{service.name}</h4>
                        </div>
                        {service.description && <p className="font-mono text-[10px] text-muted-foreground uppercase">{service.description}</p>}
                        {service.duration && (
                          <div className="inline-flex items-center font-mono text-[10px] text-muted-foreground border border-border px-1 mt-1">
                            DUR: {service.duration}
                          </div>
                        )}
                      </div>
                      <div className="font-mono text-xl font-bold mt-4 sm:mt-0 text-right">
                        ${service.price.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-card border border-border p-5">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-primary mb-4 flex items-center gap-2 border-b border-border pb-2">
              <User className="w-4 h-4" /> Entity Data
            </h3>
            <div className="space-y-4 font-mono text-sm">
              <div>
                <div className="text-[10px] text-muted-foreground uppercase mb-1">Designation</div>
                <div className="font-bold">{proposal.clientName}</div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground uppercase mb-1">Comm Vector</div>
                <div className="text-foreground truncate">{proposal.clientEmail}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-card border border-border p-5">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-primary mb-4 flex items-center gap-2 border-b border-border pb-2">
              <Calendar className="w-4 h-4" /> Chronology
            </h3>
            <div className="space-y-4 font-mono text-sm">
              <div>
                <div className="text-[10px] text-muted-foreground uppercase mb-1">Generated</div>
                <div>{format(new Date(proposal.createdAt), "yyyy-MM-dd HH:mm")}</div>
              </div>
              {proposal.validUntil && (
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase mb-1">Expiration</div>
                  <div className="text-amber-500">{format(new Date(proposal.validUntil), "yyyy-MM-dd")}</div>
                </div>
              )}
            </div>
          </div>
          
          {proposal.auditId && (
            <div className="bg-card border border-border p-5">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4 border-b border-border pb-2">Linked Source</h3>
              <Link href={`/audits/${proposal.auditId}`}>
                <Button variant="outline" className="w-full rounded-none font-mono text-[10px] uppercase tracking-widest border-border gap-2">
                  <Terminal className="w-3 h-3" /> View Root Audit
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
