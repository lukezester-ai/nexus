import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Search, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AuditFormProps {
  onAuditComplete: (id: string, data: any) => void;
}

export function AuditForm({ onAuditComplete }: AuditFormProps) {
  const { t } = useTranslation();
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
    <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-card border border-border p-6 rounded-xl shadow-lg sm:p-8">
      <h2 className="text-3xl font-serif font-bold mb-4 flex items-center justify-center">
        <Search className="w-8 h-8 mr-3 text-primary" />
        {t('audit.new_audit')}
      </h2>
      <p className="text-muted-foreground font-mono text-sm mb-8 text-center">
        {t('audit.audit_desc')}
      </p>

      <div className="flex flex-col gap-4 sm:flex-row">
        <input
          type="url"
          required
          placeholder={t('audit.input_placeholder')}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="min-w-0 flex-1 bg-background border border-border rounded-lg px-4 py-4 font-mono text-sm focus:outline-none focus:border-primary transition-colors text-center sm:text-lg"
          disabled={loading}
        />
        <Button 
          type="submit" 
          disabled={loading || !url} 
          className="h-auto bg-purple-600 px-8 text-white hover:bg-purple-700"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 mr-2" />}
          {loading ? t('audit.btn_auditing') : t('audit.btn_run_audit')}
        </Button>
      </div>
    </form>
  );
}
