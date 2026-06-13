import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";

export function AuditForm({ onAuditComplete }: { onAuditComplete: (id: string, data: any) => void }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 2500));
      const data = {
        auditId: "aud_" + Date.now(),
        targetUrl: url,
        scores: { overall: 85, readability: 90, answerReady: 80, trust: 95, llmPresence: 75 },
        readability: { level: "9th Grade", wordCount: 1250, sentenceComplexity: "Medium", jargonDensity: "Low" },
        answerReady: { hasFAQ: true, structuredData: true, conciseAnswers: "Partial", queryMatch: "High" },
        trust: { https: true, authorBio: true, citations: "Excellent", privacyPolicy: true },
        llmPresence: { perplexityMentions: 12, chatgptReferences: 5, claudeCitations: 2 },
        recommendations: [
          "Add structured schema markup for FAQs to improve AEO.",
          "Simplify sentence structures in the 'Solutions' section.",
          "Increase citations from authoritative industry journals."
        ]
      };
      onAuditComplete(data.auditId, data);
    } catch (err: any) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="max-w-2xl bg-card border border-border p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-serif font-bold mb-4 flex items-center">
        <Search className="w-6 h-6 mr-3 text-purple-500" />
        New SEO/AEO Audit
      </h2>
      <p className="text-muted-foreground font-mono text-sm mb-6">
        Enter a target URL. The AuditNexus Engine will launch 4 concurrent agents to analyze Readability, Answer-Ready Content, Trust, and LLM Platform Presence.
      </p>

      <div className="flex gap-4">
        <input
          type="url"
          required
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 bg-background border border-border rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-purple-500 transition-colors"
          disabled={loading}
        />
        <Button 
          type="submit" 
          disabled={loading || !url} 
          className="bg-purple-600 text-white hover:bg-purple-700 h-auto px-8"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {loading ? 'Auditing...' : 'Run Audit'}
        </Button>
      </div>
    </form>
  );
}
