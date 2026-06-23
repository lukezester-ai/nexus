import React, { useState, useEffect } from 'react';
import { Loader2, FileDown, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const fallbackTasks = [
  {
    phase: "SEO",
    name: "Add FAQ schema and answer blocks",
    priority: "HIGH",
    hours: 6,
    details: "Create structured FAQ markup and concise answer sections for high-intent queries.",
  },
  {
    phase: "Content",
    name: "Simplify key landing page copy",
    priority: "MEDIUM",
    hours: 4,
    details: "Reduce sentence complexity and improve scannability on the most important pages.",
  },
  {
    phase: "Authority",
    name: "Improve citations and trust signals",
    priority: "HIGH",
    hours: 5,
    details: "Add stronger external references, author details, and privacy/compliance links.",
  },
];

export function AuditResult({ auditId, data }: { auditId: string, data: any }) {
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [showPricing, setShowPricing] = useState(false);

  const totalHours = proposal ? proposal.reduce((sum: number, t: any) => sum + (Number(t.hours) || 0), 0) : 0;
  const hourlyRate = 49;
  const fullPrice = totalHours * hourlyRate;
  const scores = data.scored ?? {
    readability: { score: data.scores?.readability ?? 0, potential: 8 },
    answerReady: { score: data.scores?.answerReady ?? 0, potential: 12 },
    trust: { score: data.scores?.trust ?? 0, potential: 5 },
    platform: { score: data.scores?.llmPresence ?? data.scores?.platform ?? 0, potential: 15 },
  };
  const targetUrl = data.url ?? data.targetUrl ?? "Unknown URL";

  useEffect(() => {
    // Re-fetch the full audit from DB to get the saved tasks/proposal
    fetch(`/api/audit/${auditId}`)
      .then(res => {
        if (!res.ok) throw new Error("Audit API unavailable");
        return res.json();
      })
      .then(d => {
        setProposal(d.tasks?.length ? d.tasks : fallbackTasks);
        setLoading(false);
      })
      .catch(() => {
        setProposal(fallbackTasks);
        setLoading(false);
      });
  }, [auditId]);
  
  return (
    <div className="max-w-5xl">
      <div className="flex justify-between items-end mb-6">
        <div>
          <span className="text-xs font-mono tracking-widest text-muted-foreground uppercase">Audit Results for</span>
          <h2 className="text-3xl font-serif font-bold text-purple-400">{targetUrl}</h2>
        </div>
        <Button variant="outline" className="border-purple-500/30 text-purple-400" onClick={() => window.print()}>
          <FileDown className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { key: 'readability', label: 'AI Readability' },
          { key: 'answerReady', label: 'Answer-Ready' },
          { key: 'trust', label: 'Trust & Auth' },
          { key: 'platform', label: 'Platform Presence' }
        ].map(({ key, label }) => {
          const val = scores[key];
          return (
            <div key={key} className="bg-card border border-border p-6 rounded-xl shadow-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
              <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-4 h-8">{label}</h3>
              <div className="flex items-baseline gap-1">
                <div className="text-4xl font-serif font-bold text-foreground">{val.score}</div>
                <div className="text-sm text-muted-foreground">/100</div>
              </div>
              <div className="mt-4 text-xs font-mono font-bold text-green-400 bg-green-500/10 inline-block px-2 py-1 rounded">
                ↑ +{val.potential} pts potential
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-serif font-bold mb-6 flex items-center">
          Proposal & Task Timeline
        </h2>
        
        {loading ? (
          <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-purple-500" /></div>
        ) : proposal && proposal.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-muted-foreground font-normal tracking-widest uppercase text-xs">Phase</th>
                  <th className="pb-3 text-muted-foreground font-normal tracking-widest uppercase text-xs">Task Name</th>
                  <th className="pb-3 text-muted-foreground font-normal tracking-widest uppercase text-xs">Priority</th>
                  <th className="pb-3 text-muted-foreground font-normal tracking-widest uppercase text-xs text-right">Est. Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {proposal.map((t: any, i: number) => (
                  <React.Fragment key={i}>
                    <tr 
                      className="group hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => setExpandedRow(expandedRow === i ? null : i)}
                    >
                      <td className="py-4">
                        <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs">{t.phase}</span>
                      </td>
                      <td className="py-4 font-sans text-base font-semibold flex items-center gap-2">
                        {t.name}
                        {expandedRow === i ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded text-xs uppercase tracking-widest ${
                          t.priority === 'DONE' ? 'bg-green-500/20 text-green-400' : 
                          t.priority === 'HIGH' ? 'bg-red-500/20 text-red-400' : 
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-4 text-right text-muted-foreground">{t.hours}h</td>
                    </tr>
                    {expandedRow === i && (
                      <tr className="bg-muted/10">
                        <td colSpan={4} className="p-4 border-b border-border/50">
                          <div className="bg-card border border-border p-4 rounded-lg">
                            <h4 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">Detailed Instructions</h4>
                            <p className="text-sm font-sans text-card-foreground leading-relaxed">
                              {t.details || "No details provided for this task."}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
            
            <div className="mt-8 flex justify-end">
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white font-bold h-12 px-8"
                onClick={() => setShowPricing(true)}
              >
                Approve Proposal
              </Button>
            </div>
          </div>
        ) : (
           <p className="text-muted-foreground font-mono text-sm">No tasks generated.</p>
        )}
      </div>

      <Dialog open={showPricing} onOpenChange={setShowPricing}>
        <DialogContent className="max-w-3xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-foreground">Изберете план за изпълнение</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Изкуственият интелект изчисли, че за пълното изпълнение на задачите са необходими <strong>{totalHours} часа</strong> (по 49 EUR/час). 
              Изберете най-удобния за вас модел:
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Option 1: One-time payment */}
            <div className="border border-purple-500/30 bg-purple-500/5 p-6 rounded-xl flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Пълно Изпълнение</h3>
                <p className="text-sm text-muted-foreground mb-4">Екипът ни започва работа веднага по всички задачи от плана.</p>
                <div className="text-3xl font-bold text-purple-400 mb-6">
                  €{fullPrice} <span className="text-sm text-muted-foreground font-normal">еднократно</span>
                </div>
                <ul className="text-sm space-y-2 mb-8">
                  <li className="flex items-center gap-2">✓ Приоритетно изпълнение</li>
                  <li className="flex items-center gap-2">✓ {totalHours} часа експертен труд</li>
                  <li className="flex items-center gap-2">✓ Всички задачи наведнъж</li>
                </ul>
              </div>
              <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={async () => {
                    const res = await fetch('/api/stripe/checkout', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        contractAmount: fullPrice * 100, // cents
                        contractTitle: `Nexus Execution Plan (${totalHours}h)`
                      })
                    });
                    const data = await res.json();
                    if (data.url) window.location.href = data.url;
                  }}
              >Продължи към Плащане</Button>
            </div>

            {/* Option 2: Subscription */}
            <div className="border border-green-500/30 bg-green-500/5 p-6 rounded-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-4 right-[-30px] bg-green-500 text-white text-xs font-bold px-8 py-1 rotate-45">ХИТ</div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">AuditNexus Pro</h3>
                <p className="text-sm text-muted-foreground mb-4">Разсрочено дългосрочно изпълнение + постоянен мониторинг.</p>
                <div className="text-3xl font-bold text-green-400 mb-6">
                  €199 <span className="text-sm text-muted-foreground font-normal">/ месец</span>
                </div>
                <ul className="text-sm space-y-2 mb-8">
                  <li className="flex items-center gap-2">✓ 5 часа гарантирана работа/месец</li>
                  <li className="flex items-center gap-2">✓ Постоянен 24/7 SEO мониторинг</li>
                  <li className="flex items-center gap-2">✓ Премиум достъп до FieldLot</li>
                </ul>
              </div>
              <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => alert('Месечните абонаменти ще бъдат активни скоро!')}
              >Абонирай ме (Pro)</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
