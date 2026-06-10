import { useGetProposal, useUpdateProposal, useCreateContract } from "@workspace/api-client-react";
import { useParams, Link, useLocation } from "wouter";
import { ArrowLeft, FileSignature, CheckCircle, XCircle, Send, Calendar, User, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
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
      <div className="p-8 space-y-6 max-w-5xl mx-auto">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  const handleStatusChange = async (status: 'sent' | 'accepted' | 'rejected') => {
    try {
      await updateProposal.mutateAsync({
        id: proposalId,
        data: { status }
      });
      toast({ title: `Proposal marked as ${status}` });
      refetch();
    } catch (e) {
      toast({ title: "Error updating status", variant: "destructive" });
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
          title: `Contract: ${proposal.title}`,
          totalAmount: proposal.totalPrice,
          currency: proposal.currency,
          content: `This contract outlines the agreement for: ${proposal.title}\n\nTotal Value: $${proposal.totalPrice} ${proposal.currency}\n\nTerms and conditions...`,
        }
      });
      toast({ title: "Contract generated successfully" });
      setLocation(`/contracts/${contract.id}`);
    } catch (e) {
      toast({ title: "Error generating contract", variant: "destructive" });
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Link href="/proposals" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Proposals
        </Link>
        <div className="flex gap-2">
          {proposal.status === "draft" && (
            <Button size="sm" onClick={() => handleStatusChange("sent")} className="gap-2">
              <Send className="w-4 h-4" /> Mark as Sent
            </Button>
          )}
          {proposal.status === "sent" && (
            <>
              <Button size="sm" variant="destructive" onClick={() => handleStatusChange("rejected")} className="gap-2">
                <XCircle className="w-4 h-4" /> Reject
              </Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 gap-2" onClick={() => handleStatusChange("accepted")}>
                <CheckCircle className="w-4 h-4" /> Accept
              </Button>
            </>
          )}
          {proposal.status === "accepted" && (
            <Button size="sm" onClick={handleGenerateContract} className="gap-2">
              <FileSignature className="w-4 h-4" /> Generate Contract
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{proposal.title}</h1>
                  <StatusBadge status={proposal.status} className="mb-4" />
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Proposal ID</div>
                  <div className="font-mono">#{proposal.id.toString().padStart(4, '0')}</div>
                </div>
              </div>
              
              <div className="prose dark:prose-invert max-w-none mb-10">
                <p className="text-lg leading-relaxed text-muted-foreground">{proposal.description}</p>
              </div>
              
              <h3 className="text-xl font-semibold mb-6 border-b pb-2">Scope of Services</h3>
              
              <div className="space-y-4">
                {(proposal.services || []).map((service, idx) => (
                  <div key={idx} className="flex justify-between items-start p-4 rounded-lg bg-muted/30 border border-border">
                    <div>
                      <h4 className="font-semibold text-lg">{service.name}</h4>
                      {service.description && <p className="text-muted-foreground text-sm mt-1">{service.description}</p>}
                      {service.duration && (
                        <div className="inline-flex items-center mt-2 px-2 py-1 rounded bg-background text-xs font-medium border text-muted-foreground">
                          <Calendar className="w-3 h-3 mr-1" /> {service.duration}
                        </div>
                      )}
                    </div>
                    <div className="font-bold text-lg whitespace-nowrap ml-4">
                      ${service.price.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between py-2 font-bold text-2xl border-b-2 border-primary mb-2">
                    <span>Total</span>
                    <span>${proposal.totalPrice?.toLocaleString()} {proposal.currency}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5" /> Client Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Name</div>
                <div className="font-medium">{proposal.clientName}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Email</div>
                <div className="font-medium">{proposal.clientEmail}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" /> Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Created On</div>
                <div className="font-medium">{format(new Date(proposal.createdAt), "MMMM d, yyyy")}</div>
              </div>
              {proposal.validUntil && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Valid Until</div>
                  <div className="font-medium">{format(new Date(proposal.validUntil), "MMMM d, yyyy")}</div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {proposal.auditId && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-2">Related Audit</h3>
                <Link href={`/audits/${proposal.auditId}`}>
                  <Button variant="outline" className="w-full justify-start">
                    View Original Audit
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
