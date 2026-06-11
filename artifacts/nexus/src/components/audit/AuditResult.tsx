import { useState, useEffect } from 'react';
import { Loader2, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AuditResult({ auditId, data }: { auditId: string, data: any }) {
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Re-fetch the full audit from DB to get the saved tasks/proposal
    fetch(`/api/audit/${auditId}`)
      .then(res => res.json())
      .then(d => {
        setProposal(d.tasks);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [auditId]);

  const scores = data.scored;
  
  return (
    <div className="max-w-5xl">
      <div className="flex justify-between items-end mb-6">
        <div>
          <span className="text-xs font-mono tracking-widest text-muted-foreground uppercase">Audit Results for</span>
          <h2 className="text-3xl font-serif font-bold text-purple-400">{data.url}</h2>
        </div>
        <Button variant="outline" className="border-purple-500/30 text-purple-400">
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
                  <tr key={i} className="group hover:bg-muted/30 transition-colors">
                    <td className="py-4">
                      <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs">{t.phase}</span>
                    </td>
                    <td className="py-4 font-sans text-base">{t.name}</td>
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
                ))}
              </tbody>
            </table>
            
            <div className="mt-8 flex justify-end">
              <Button className="bg-green-600 hover:bg-green-700 text-white font-bold h-12 px-8">
                Approve Proposal
              </Button>
            </div>
          </div>
        ) : (
           <p className="text-muted-foreground font-mono text-sm">No tasks generated.</p>
        )}
      </div>
    </div>
  );
}
