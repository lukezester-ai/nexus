import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, Send, ShieldCheck, Activity, Cpu, CheckCircle, XCircle, FileSignature, X } from "lucide-react";

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [prompt, setPrompt] = useState("");
  const [selectedDecisionId, setSelectedDecisionId] = useState<number | null>(null);
  const [contractModalData, setContractModalData] = useState<any>(null);

  const { data: decisions, isLoading: loadingDecisions } = useQuery({
    queryKey: ["decisions"],
    queryFn: async () => {
      const res = await fetch("/api/trust-engine/decisions");
      return res.json();
    }
  });

  const { data: decisionDetails, isLoading: loadingDetails } = useQuery({
    queryKey: ["decision", selectedDecisionId],
    queryFn: async () => {
      const res = await fetch(`/api/trust-engine/decisions/${selectedDecisionId}`);
      return res.json();
    },
    enabled: !!selectedDecisionId
  });

  const proposeMutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await fetch("/api/agents/terra-iq/propose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text })
      });
      return res.json();
    },
    onSuccess: () => {
      setPrompt("");
      queryClient.invalidateQueries({ queryKey: ["decisions"] });
    }
  });

  const validateMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/trust-engine/decisions/${id}/validate`, {
        method: "POST"
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decisions"] });
      queryClient.invalidateQueries({ queryKey: ["decision", selectedDecisionId] });
    }
  });

  const executeMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/trust-engine/decisions/${id}/execute`, {
        method: "POST"
      });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["decisions"] });
      queryClient.invalidateQueries({ queryKey: ["decision", selectedDecisionId] });
      setContractModalData(data.contract);
    }
  });

  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-primary/30 selection:text-primary-foreground">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-24 pb-12">
        <h1 className="text-4xl font-serif font-bold mb-8">TerraIQ Executive Dashboard</h1>

        <Tabs defaultValue="inbox" className="w-full">
          <TabsList className="mb-8 grid grid-cols-2 w-[400px]">
            <TabsTrigger value="inbox" className="font-mono text-xs uppercase tracking-widest"><ShieldCheck className="w-4 h-4 mr-2" /> Executive Inbox</TabsTrigger>
            <TabsTrigger value="agent" className="font-mono text-xs uppercase tracking-widest"><Activity className="w-4 h-4 mr-2" /> Agent Control</TabsTrigger>
          </TabsList>

          <TabsContent value="agent">
            <div className="max-w-2xl bg-card border border-border rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-serif font-bold mb-4 flex items-center">
                <Cpu className="w-6 h-6 mr-3 text-primary" />
                TerraIQ Operations Agent
              </h2>
              <p className="text-muted-foreground font-mono text-sm mb-6">
                Instruct the AI agent to optimize an operational goal. It will analyze the request and generate a formal corporate proposal for executive review.
              </p>

              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Find a way to reduce harvesting fuel costs by 15%..."
                  className="flex-1 bg-background border border-border rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-primary transition-colors"
                  disabled={proposeMutation.isPending}
                />
                <Button 
                  onClick={() => proposeMutation.mutate(prompt)} 
                  disabled={!prompt || proposeMutation.isPending}
                  className="bg-primary text-primary-foreground h-auto px-6"
                >
                  {proposeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                  {proposeMutation.isPending ? "Generating..." : "Propose"}
                </Button>
              </div>

              {proposeMutation.isSuccess && (
                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start text-green-400">
                  <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold font-mono text-sm mb-1">Proposal Submitted</h4>
                    <p className="text-xs opacity-80">The agent has generated a formal decision proposal. It is now waiting in the Executive Inbox for the Trust Engine audit.</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="inbox">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Inbox List */}
              <div className="lg:col-span-1 space-y-4">
                <h3 className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-4">Pending & Audited Decisions</h3>
                {loadingDecisions ? (
                  <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                ) : decisions?.map((d: any) => (
                  <div 
                    key={d.id} 
                    onClick={() => setSelectedDecisionId(d.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedDecisionId === d.id ? 'bg-primary/5 border-primary shadow-[0_0_15px_-3px_hsl(var(--primary))]' : 'bg-card border-border hover:border-primary/50'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground">{d.sourceAgent}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${d.status === 'executed' ? 'bg-purple-500/20 text-purple-400' : d.status === 'validated' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {d.status === 'executed' ? 'EXECUTED' : d.status === 'validated' ? 'AUDITED' : 'PENDING'}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm truncate">{d.proposedAction}</h4>
                  </div>
                ))}
              </div>

              {/* Details Pane */}
              <div className="lg:col-span-2">
                {selectedDecisionId ? (
                  loadingDetails ? (
                     <div className="flex items-center justify-center h-[400px] border border-border rounded-xl bg-card"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                  ) : decisionDetails && (
                    <div className="bg-card border border-border rounded-xl p-8">
                      <div className="mb-8">
                        <span className="text-xs font-mono tracking-widest text-primary uppercase mb-2 block">{decisionDetails.decision.decisionType}</span>
                        <h2 className="text-3xl font-serif font-bold mb-4">{decisionDetails.decision.proposedAction}</h2>
                        <div className="bg-background border border-border p-4 rounded-lg font-mono text-sm text-muted-foreground">
                          <p><strong className="text-foreground">Reasoning:</strong> {decisionDetails.decision.context?.reasoning}</p>
                          <p className="mt-2"><strong className="text-foreground">Expected ROI:</strong> {decisionDetails.decision.context?.expectedROI}</p>
                          <p className="mt-2"><strong className="text-foreground">Urgency:</strong> {decisionDetails.decision.context?.urgency}</p>
                        </div>
                      </div>

                      {decisionDetails.decision.status === 'pending_audit' ? (
                        <div className="text-center p-12 border border-dashed border-border rounded-xl bg-background/50">
                          <ShieldCheck className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
                          <h3 className="text-xl font-bold mb-2">Awaiting Trust Engine Audit</h3>
                          <p className="text-muted-foreground font-mono text-sm mb-6 max-w-md mx-auto">This proposal has not been validated. Run the Nexus Trust Engine to analyze risks using GPT-4o before approving.</p>
                          <Button 
                            size="lg" 
                            onClick={() => validateMutation.mutate(decisionDetails.decision.id)}
                            disabled={validateMutation.isPending}
                            className="bg-[hsl(var(--chart-4))] text-primary-foreground hover:bg-[hsl(var(--chart-4))]/90"
                          >
                            {validateMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
                            {validateMutation.isPending ? "Auditing (GPT-4o running...)" : "Run Nexus Audit"}
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <div className={`p-6 rounded-xl border mb-8 flex items-center justify-between ${decisionDetails.trustScore.overallRisk === 'HIGH' ? 'bg-red-500/10 border-red-500/30' : decisionDetails.trustScore.overallRisk === 'MEDIUM' ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
                            <div>
                              <span className="text-xs font-mono tracking-widest uppercase opacity-70 block mb-1">Executive Verdict</span>
                              <h3 className="text-2xl font-bold font-serif">{decisionDetails.trustScore.finalVerdict}</h3>
                              <p className="text-sm font-mono mt-2 opacity-80">{decisionDetails.trustScore.executiveSummary}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-5xl font-bold font-serif">{decisionDetails.trustScore.overallScore}<span className="text-xl opacity-50">/100</span></div>
                              <span className="text-xs font-mono tracking-widest uppercase opacity-70 block mt-1">Trust Score</span>
                            </div>
                          </div>

                          <h3 className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-4">Detailed Validation Findings</h3>
                          <div className="space-y-4 mb-8">
                            {decisionDetails.validations.map((v: any) => (
                              <div key={v.id} className="bg-background border border-border p-4 rounded-lg flex gap-4">
                                <div className="flex-shrink-0 pt-1">
                                  {v.riskLevel === 'HIGH' ? <XCircle className="w-5 h-5 text-red-400" /> : <CheckCircle className="w-5 h-5 text-green-400" />}
                                </div>
                                <div>
                                  <div className="flex items-center gap-3 mb-2">
                                    <h4 className="font-bold text-sm">{v.module}</h4>
                                    <span className={`text-[9px] px-2 py-0.5 rounded uppercase font-mono tracking-widest ${v.riskLevel === 'HIGH' ? 'bg-red-500/20 text-red-400' : v.riskLevel === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                                      RISK: {v.riskLevel}
                                    </span>
                                    <span className="text-[10px] font-mono text-muted-foreground ml-auto">CONFIDENCE: {v.confidenceScore}%</span>
                                  </div>
                                  <ul className="list-disc list-inside text-xs font-mono text-muted-foreground space-y-1">
                                    {v.findings.map((f: string, i: number) => <li key={i}>{f}</li>)}
                                  </ul>
                                </div>
                              </div>
                            ))}
                          </div>

                          {decisionDetails.decision.status === 'validated' && (
                            <div className="border-t border-border pt-8 flex justify-end">
                              <Button 
                                size="lg"
                                className="bg-green-600 hover:bg-green-700 text-white font-bold"
                                disabled={executeMutation.isPending}
                                onClick={() => executeMutation.mutate(decisionDetails.decision.id)}
                              >
                                {executeMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileSignature className="w-4 h-4 mr-2" />}
                                {executeMutation.isPending ? "Agrinexus Law Drafting..." : "APPROVE & DRAFT CONTRACT"}
                              </Button>
                            </div>
                          )}

                          {decisionDetails.decision.status === 'executed' && (
                            <div className="border-t border-border pt-8">
                              <div className="bg-purple-500/10 border border-purple-500/30 text-purple-400 p-4 rounded-lg flex items-center justify-between">
                                <div className="flex items-center">
                                  <FileSignature className="w-5 h-5 mr-3" />
                                  <span className="font-bold text-sm font-mono uppercase tracking-widest">Execution Complete</span>
                                </div>
                                <span className="text-xs">Contract stored in Agrinexus Law</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  <div className="flex items-center justify-center h-[400px] border border-dashed border-border rounded-xl bg-background/50 text-muted-foreground font-mono text-sm">
                    Select a decision from the inbox to review.
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Contract Modal */}
      {contractModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
          <div className="bg-background border border-border w-full max-w-4xl max-h-[85vh] rounded-xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center bg-card">
              <div className="flex items-center gap-2 text-primary font-mono text-sm font-bold uppercase tracking-widest">
                <FileSignature className="w-5 h-5" />
                Agrinexus Law - Generated Contract
              </div>
              <button onClick={() => setContractModalData(null)} className="p-2 hover:bg-border rounded text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 overflow-y-auto font-serif text-lg leading-relaxed flex-1 prose prose-invert max-w-none">
              <h1 className="text-3xl font-bold text-center mb-8">{contractModalData.title}</h1>
              {contractModalData.content.split('\n').map((line: string, i: number) => {
                if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold mt-6 mb-2">{line.replace('### ', '')}</h3>;
                if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold mt-8 mb-4">{line.replace('## ', '')}</h2>;
                if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold mt-8 mb-4">{line.replace('# ', '')}</h1>;
                if (line.startsWith('**')) return <p key={i} className="font-bold mt-4">{line.replace(/\*\*/g, '')}</p>;
                if (line.trim() === '') return <br key={i} />;
                return <p key={i} className="mb-2">{line}</p>;
              })}
              <div className="mt-12 pt-8 border-t border-dashed border-border flex justify-between items-end">
                <div>
                  <p className="font-bold text-sm mb-1 uppercase font-mono tracking-widest">Estimated Value</p>
                  <p className="text-2xl">{Number(contractModalData.totalAmount).toLocaleString('bg-BG')} BGN</p>
                </div>
                <div className="flex gap-16">
                  <div className="w-48 border-b border-border">
                    <span className="text-xs text-muted-foreground block mb-8 font-mono">For Nexus Intelligence Group</span>
                  </div>
                  <div className="w-48 border-b border-border">
                    <span className="text-xs text-muted-foreground block mb-8 font-mono">For Contractor</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
