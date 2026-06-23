import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, Send, ShieldCheck, Activity, Cpu, CheckCircle, XCircle, FileSignature, X, Search } from "lucide-react";
import { AuditForm } from "@/components/audit/AuditForm";
import { AuditResult } from "@/components/audit/AuditResult";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [prompt, setPrompt] = useState("");
  const [activeTab, setActiveTab] = useState("agent");
  const [selectedDecisionId, setSelectedDecisionId] = useState<number | null>(null);
  const [contractModalData, setContractModalData] = useState<any>(null);
  const [auditId, setAuditId] = useState<string | null>(null);
  const [auditData, setAuditData] = useState<any>(null);

  const { data: decisions, isLoading: loadingDecisions } = useQuery({
    queryKey: ["decisions"],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 500));
      const stored = localStorage.getItem('mockDecisions');
      if (!stored) {
        const initial = [{
          id: 1, sourceAgent: "TERRA-IQ", status: "pending_audit", proposedAction: "Initialize Nexus Core Systems", decisionType: "SYSTEM_CONFIG"
        }];
        localStorage.setItem('mockDecisions', JSON.stringify(initial));
        localStorage.setItem('mockDetails', JSON.stringify({
          1: { decision: initial[0], trustScore: {}, validations: [] }
        }));
        return initial;
      }
      return JSON.parse(stored);
    }
  });

  const { data: decisionDetails, isLoading: loadingDetails } = useQuery({
    queryKey: ["decision", selectedDecisionId],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 500));
      const details = JSON.parse(localStorage.getItem('mockDetails') || "{}");
      return details[selectedDecisionId!] || null;
    },
    enabled: !!selectedDecisionId
  });

  const proposeMutation = useMutation({
    mutationFn: async (text: string) => {
      await new Promise(r => setTimeout(r, 1500));
      const isBg = /[а-яА-Я]/.test(text);
      
      const newDecision = {
        id: Date.now(),
        sourceAgent: "TERRA-IQ",
        status: "pending_audit",
        language: isBg ? 'bg' : 'en',
        proposedAction: isBg 
          ? "Стратегическо предложение: " + text.substring(0, 30) + "..." 
          : "Strategic Proposal: " + text.substring(0, 30) + "...",
        decisionType: isBg ? "ОПЕРАТИВНА_СТРАТЕГИЯ" : "OPERATIONAL_STRATEGY",
        context: {
          reasoning: isBg 
            ? "Разузнавателните данни от ShadowNet в комбинация с предиктивните модели на TerraIQ силно препоръчват това действие за оптимизация на работната ширина и минимизиране на режийните разходи."
            : "ShadowNet intelligence combined with TerraIQ predictive models strongly suggest this action to optimize operational bandwidth and minimize overhead.",
          expectedROI: isBg ? "Висока доходност, приблизително +18.5% ефективност" : "High yield, approx +18.5% efficiency",
          urgency: isBg ? "ВИСОКА" : "HIGH"
        }
      };
      const existing = JSON.parse(localStorage.getItem('mockDecisions') || "[]");
      localStorage.setItem('mockDecisions', JSON.stringify([newDecision, ...existing]));
      
      const details = JSON.parse(localStorage.getItem('mockDetails') || "{}");
      details[newDecision.id] = { decision: newDecision, trustScore: {}, validations: [] };
      localStorage.setItem('mockDetails', JSON.stringify(details));

      return { decision: newDecision };
    },
    onSuccess: (data) => {
      setPrompt("");
      setActiveTab("inbox");
      if (data && data.decision && data.decision.id) setSelectedDecisionId(data.decision.id);
      queryClient.invalidateQueries({ queryKey: ["decisions"] });
    }
  });

  const validateMutation = useMutation({
    mutationFn: async (id: number) => {
      await new Promise(r => setTimeout(r, 2000));
      const details = JSON.parse(localStorage.getItem('mockDetails') || "{}");
      if (details[id]) {
        const isBg = details[id].decision.language === 'bg';
        details[id].decision.status = "validated";
        details[id].trustScore = {
          overallRisk: isBg ? "НИСЪК" : "LOW", 
          finalVerdict: isBg ? "ОДОБРЕНО" : "APPROVED", 
          executiveSummary: isBg ? "Автоматизираният анализ не откри нарушения на правилата." : "Automated analysis found no compliance breaches.", 
          overallScore: 92
        };
        details[id].validations = [
          { 
            id: 1, 
            module: isBg ? "Правна Рамка" : "Legal Framework", 
            riskLevel: isBg ? "НИСЪК" : "LOW", 
            confidenceScore: 98, 
            findings: isBg ? ["Условията отговарят на корпоративните насоки"] : ["Terms align with enterprise guidelines"] 
          },
          { 
            id: 2, 
            module: isBg ? "Пазарна Стратегия" : "Market Strategy", 
            riskLevel: isBg ? "НИСЪК" : "LOW", 
            confidenceScore: 89, 
            findings: isBg ? ["Прогнозирана е положителна възвръщаемост"] : ["Positive ROI projected"] 
          }
        ];
        localStorage.setItem('mockDetails', JSON.stringify(details));
        
        const decisions = JSON.parse(localStorage.getItem('mockDecisions') || "[]");
        const d = decisions.find((x: any) => x.id === id);
        if (d) { d.status = "validated"; localStorage.setItem('mockDecisions', JSON.stringify(decisions)); }
      }
      return details[id];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decisions"] });
      queryClient.invalidateQueries({ queryKey: ["decision", selectedDecisionId] });
    }
  });

  const executeMutation = useMutation({
    mutationFn: async (id: number) => {
      await new Promise(r => setTimeout(r, 1500));
      const details = JSON.parse(localStorage.getItem('mockDetails') || "{}");
      let isBg = false;
      if (details[id]) {
        isBg = details[id].decision.language === 'bg';
        details[id].decision.status = "executed";
        localStorage.setItem('mockDetails', JSON.stringify(details));
        const decisions = JSON.parse(localStorage.getItem('mockDecisions') || "[]");
        const d = decisions.find((x: any) => x.id === id);
        if (d) { d.status = "executed"; localStorage.setItem('mockDecisions', JSON.stringify(decisions)); }
      }
      
      const contractContentBg = "## Резюме\n\nТози обвързващ документ упълномощава незабавното изпълнение на стратегическото предложение.\n\n### Клаузи\n\n1. Системата ще разпредели ресурсите динамично.\n2. Всички агенти са длъжни да спазват насоките на AuditNexus.\n\n**Подписи**\nСистемата е автоматично подписана чрез криптографски ключ на TerraIQ.";
      const contractContentEn = "## Summary\n\nThis binding document authorizes the immediate execution of the strategic proposal.\n\n### Clauses\n\n1. The system shall dynamically allocate resources.\n2. All agents are required to comply with AuditNexus guidelines.\n\n**Signatures**\nSystem auto-signed via TerraIQ cryptographic key.";
      
      return { 
        contract: { 
          title: isBg ? "Изпълнителна Заповед и Договор за Изпълнение" : "Executive Order & Implementation Contract", 
          content: isBg ? contractContentBg : contractContentEn, 
          totalAmount: 150000 
        } 
      };
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
        <h1 className="text-4xl font-serif font-bold mb-8">{t('dashboard.title')}</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8 grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="inbox" className="min-w-0 font-mono text-[10px] uppercase tracking-widest sm:text-xs"><ShieldCheck className="mr-1 h-4 w-4 shrink-0 sm:mr-2" /> <span className="truncate">{t('dashboard.tab_inbox')}</span></TabsTrigger>
            <TabsTrigger value="agent" className="min-w-0 font-mono text-[10px] uppercase tracking-widest sm:text-xs"><Activity className="mr-1 h-4 w-4 shrink-0 sm:mr-2" /> <span className="truncate">{t('dashboard.tab_agent')}</span></TabsTrigger>
            <TabsTrigger value="audit" className="min-w-0 font-mono text-[10px] uppercase tracking-widest text-purple-400 sm:text-xs"><Search className="mr-1 h-4 w-4 shrink-0 sm:mr-2" /> <span className="truncate">AuditNexus</span></TabsTrigger>
          </TabsList>

          <TabsContent value="agent">
            <div className="max-w-2xl bg-card border border-border rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-serif font-bold mb-4 flex items-center">
                <Cpu className="w-6 h-6 mr-3 text-primary" />
                {t('dashboard.hub_title')}
              </h2>
              <div className="flex items-center gap-2 mb-6">
                <span className="bg-purple-500/20 text-purple-400 text-[10px] font-mono px-2 py-1 rounded border border-purple-500/30">{t('dashboard.powered_by')}</span>
                <span className="bg-red-500/20 text-red-400 text-[10px] font-mono px-2 py-1 rounded border border-red-500/30">{t('dashboard.proxies_active')}</span>
              </div>
              <p className="text-muted-foreground font-mono text-sm mb-6">
                {t('dashboard.hub_desc')}
              </p>

              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={t('dashboard.input_placeholder')}
                  className="flex-1 bg-background border border-border rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-primary transition-colors"
                  disabled={proposeMutation.isPending}
                />
                <Button 
                  onClick={() => proposeMutation.mutate(prompt)} 
                  disabled={!prompt || proposeMutation.isPending}
                  className="bg-primary text-primary-foreground h-auto px-6"
                >
                  {proposeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                  {proposeMutation.isPending ? t('dashboard.btn_generating') : t('dashboard.btn_propose')}
                </Button>
              </div>

              {proposeMutation.isSuccess && (
                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start text-green-400">
                  <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold font-mono text-sm mb-1">{t('dashboard.proposal_submitted')}</h4>
                    <p className="text-xs opacity-80">{t('dashboard.proposal_desc')}</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="inbox">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Inbox List */}
              <div className="lg:col-span-1 space-y-4">
                <h3 className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-4">{t('dashboard.inbox_list_title')}</h3>
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
                        {d.status === 'executed' ? t('dashboard.status_executed') : d.status === 'validated' ? t('dashboard.status_audited') : t('dashboard.status_pending')}
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
                          <p><strong className="text-foreground">{t('dashboard.reasoning')}</strong> {decisionDetails.decision.context?.reasoning}</p>
                          <p className="mt-2"><strong className="text-foreground">{t('dashboard.expected_roi')}</strong> {decisionDetails.decision.context?.expectedROI}</p>
                          <p className="mt-2"><strong className="text-foreground">{t('dashboard.urgency')}</strong> {decisionDetails.decision.context?.urgency}</p>
                        </div>
                      </div>

                      {decisionDetails.decision.status === 'pending_audit' ? (
                        <div className="text-center p-12 border border-dashed border-border rounded-xl bg-background/50">
                          <ShieldCheck className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
                          <h3 className="text-xl font-bold mb-2">{t('dashboard.awaiting_audit')}</h3>
                          <p className="text-muted-foreground font-mono text-sm mb-6 max-w-md mx-auto">{t('dashboard.awaiting_audit_desc')}</p>
                          <Button 
                            size="lg" 
                            onClick={() => validateMutation.mutate(decisionDetails.decision.id)}
                            disabled={validateMutation.isPending}
                            className="bg-[hsl(var(--chart-4))] text-primary-foreground hover:bg-[hsl(var(--chart-4))]/90"
                          >
                            {validateMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
                            {validateMutation.isPending ? t('dashboard.btn_auditing') : t('dashboard.btn_run_audit')}
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <div className={`p-6 rounded-xl border mb-8 flex items-center justify-between ${decisionDetails.trustScore.overallRisk === 'HIGH' || decisionDetails.trustScore.overallRisk === 'ВИСОК' ? 'bg-red-500/10 border-red-500/30' : decisionDetails.trustScore.overallRisk === 'MEDIUM' || decisionDetails.trustScore.overallRisk === 'СРЕДЕН' ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
                            <div>
                              <span className="text-xs font-mono tracking-widest uppercase opacity-70 block mb-1">{t('dashboard.executive_verdict')}</span>
                              <h3 className="text-2xl font-bold font-serif">{decisionDetails.trustScore.finalVerdict}</h3>
                              <p className="text-sm font-mono mt-2 opacity-80">{decisionDetails.trustScore.executiveSummary}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-5xl font-bold font-serif">{decisionDetails.trustScore.overallScore}<span className="text-xl opacity-50">/100</span></div>
                              <span className="text-xs font-mono tracking-widest uppercase opacity-70 block mt-1">{t('dashboard.trust_score')}</span>
                            </div>
                          </div>

                          <h3 className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-4">{t('dashboard.validation_findings')}</h3>
                          <div className="space-y-4 mb-8">
                            {decisionDetails.validations.map((v: any) => (
                              <div key={v.id} className="bg-background border border-border p-4 rounded-lg flex gap-4">
                                <div className="flex-shrink-0 pt-1">
                                  {v.riskLevel === 'HIGH' || v.riskLevel === 'ВИСОК' ? <XCircle className="w-5 h-5 text-red-400" /> : <CheckCircle className="w-5 h-5 text-green-400" />}
                                </div>
                                <div>
                                  <div className="flex items-center gap-3 mb-2">
                                    <h4 className="font-bold text-sm">{v.module}</h4>
                                    <span className={`text-[9px] px-2 py-0.5 rounded uppercase font-mono tracking-widest ${v.riskLevel === 'HIGH' || v.riskLevel === 'ВИСОК' ? 'bg-red-500/20 text-red-400' : v.riskLevel === 'MEDIUM' || v.riskLevel === 'СРЕДЕН' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                                      {t('dashboard.risk')} {v.riskLevel}
                                    </span>
                                    <span className="text-[10px] font-mono text-muted-foreground ml-auto">{t('dashboard.confidence')} {v.confidenceScore}%</span>
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
                                {executeMutation.isPending ? t('dashboard.btn_drafting') : t('dashboard.btn_approve_contract')}
                              </Button>
                            </div>
                          )}

                          {decisionDetails.decision.status === 'executed' && (
                            <div className="border-t border-border pt-8">
                              <div className="bg-purple-500/10 border border-purple-500/30 text-purple-400 p-4 rounded-lg flex items-center justify-between">
                                <div className="flex items-center">
                                  <FileSignature className="w-5 h-5 mr-3" />
                                  <span className="font-bold text-sm font-mono uppercase tracking-widest">{t('dashboard.execution_complete')}</span>
                                </div>
                                <span className="text-xs">{t('dashboard.execution_desc')}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  <div className="flex items-center justify-center h-[400px] border border-dashed border-border rounded-xl bg-background/50 text-muted-foreground font-mono text-sm">
                    {t('dashboard.select_decision')}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="audit">
            <div className="flex flex-col items-center">
              {!auditData ? (
                <AuditForm onAuditComplete={(id, data) => { setAuditId(id); setAuditData(data); }} />
              ) : (
                <AuditResult auditId={auditId!} data={auditData} />
              )}
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
