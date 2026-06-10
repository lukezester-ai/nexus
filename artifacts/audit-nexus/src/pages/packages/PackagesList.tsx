import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Package, Zap, Shield, Cpu, ArrowRight, ExternalLink, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface StripePrice {
  id: string;
  unitAmount: number | null;
  currency: string;
  recurring: unknown;
  active: boolean;
}

interface StripeProduct {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  metadata: Record<string, string>;
  prices: StripePrice[];
}

const TIER_ORDER = ["basic", "pro", "enterprise", "custom"];

const TIER_CONFIG: Record<string, {
  icon: React.ElementType;
  label: string;
  accent: string;
  headerBg: string;
  badgeBg: string;
  borderColor: string;
  btnClass: string;
  featured: boolean;
  description: string;
  features: string[];
}> = {
  basic: {
    icon: Package,
    label: "SEO BASIC",
    accent: "text-amber-400",
    headerBg: "bg-amber-400/5",
    badgeBg: "bg-amber-400/10 text-amber-400 border-amber-400/30",
    borderColor: "border-amber-400/20",
    btnClass: "border-amber-400/40 text-amber-400 hover:bg-amber-400/10",
    featured: false,
    description: "Foundation audit for small business websites",
    features: [
      "Technical SEO crawl (up to 500 URLs)",
      "On-page optimisation report",
      "Core Web Vitals analysis",
      "Structured data audit",
      "PDF delivery within 5 business days",
    ],
  },
  pro: {
    icon: Zap,
    label: "SEO PROFESSIONAL",
    accent: "text-primary",
    headerBg: "bg-primary/5",
    badgeBg: "bg-primary/10 text-primary border-primary/30",
    borderColor: "border-primary/30",
    btnClass: "border-primary text-primary hover:bg-primary/10",
    featured: false,
    description: "Full-spectrum SEO + competitor intelligence",
    features: [
      "Technical SEO crawl (up to 5 000 URLs)",
      "Competitor gap analysis (3 domains)",
      "Backlink profile audit",
      "GEO / AI-search readiness check",
      "Priority delivery within 3 business days",
    ],
  },
  enterprise: {
    icon: Shield,
    label: "ENTERPRISE",
    accent: "text-emerald-400",
    headerBg: "bg-emerald-400/5",
    badgeBg: "bg-emerald-400/10 text-emerald-400 border-emerald-400/30",
    borderColor: "border-emerald-400/30",
    btnClass: "border-emerald-400/40 text-emerald-400 hover:bg-emerald-400/10",
    featured: true,
    description: "Complete audit suite with dedicated analyst support",
    features: [
      "Unlimited URL crawl",
      "Full SEO + GEO + AEO audit",
      "Competitor analysis (up to 10 domains)",
      "Monthly monitoring & re-audit",
      "Dedicated Slack channel & calls",
    ],
  },
  custom: {
    icon: Cpu,
    label: "CUSTOM PROJECT",
    accent: "text-violet-400",
    headerBg: "bg-violet-400/5",
    badgeBg: "bg-violet-400/10 text-violet-400 border-violet-400/30",
    borderColor: "border-violet-400/20",
    btnClass: "border-violet-400/40 text-violet-400 hover:bg-violet-400/10",
    featured: false,
    description: "Scoped engagement priced to your exact requirements",
    features: [
      "Fully custom scope of work",
      "Any audit type or combination",
      "White-label deliverables available",
      "API access to audit results",
      "SLA-backed delivery timeline",
    ],
  },
};

function formatAmount(cents: number | null) {
  if (!cents) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);
}

async function fetchProducts(): Promise<StripeProduct[]> {
  const res = await fetch("/api/stripe/products");
  if (!res.ok) throw new Error("Failed to load packages");
  const json = await res.json();
  return json.data as StripeProduct[];
}

function deduplicateByTier(products: StripeProduct[]): StripeProduct[] {
  const seen = new Set<string>();
  const result: StripeProduct[] = [];
  for (const p of products) {
    const tier = p.metadata?.tier ?? "unknown";
    if (!seen.has(tier)) {
      seen.add(tier);
      result.push(p);
    }
  }
  return result;
}

export function PackagesList() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [checkingOut, setCheckingOut] = useState<string | null>(null);

  const { data: products, isLoading, isError } = useQuery<StripeProduct[]>({
    queryKey: ["stripe-products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 10,
  });

  const displayProducts = products ? deduplicateByTier(products) : [];
  const sorted = [...displayProducts].sort((a, b) => {
    const ai = TIER_ORDER.indexOf(a.metadata?.tier ?? "");
    const bi = TIER_ORDER.indexOf(b.metadata?.tier ?? "");
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  async function handleCheckout(product: StripeProduct) {
    const price = product.prices[0];
    if (!price) return;
    setCheckingOut(product.id);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: price.id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Checkout failed");
      window.location.href = json.url;
    } catch (err: any) {
      toast({ title: "Checkout error", description: err.message, variant: "destructive" });
      setCheckingOut(null);
    }
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-widest text-primary mb-1 flex items-center gap-2">
            <Package className="w-5 h-5" /> Packages
          </h1>
          <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
            Service tiers &amp; pricing — live from Stripe
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-emerald-400">
            ● LIVE PRICING
          </div>
          <div className="bg-card border border-border px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            {isLoading ? "LOADING..." : `${sorted.length} TIERS`}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border">
        {[
          { label: "Entry Price", value: isLoading ? "…" : formatAmount(sorted.find(p => p.metadata?.tier === "basic")?.prices[0]?.unitAmount ?? null), accent: "text-amber-400" },
          { label: "Pro Price", value: isLoading ? "…" : formatAmount(sorted.find(p => p.metadata?.tier === "pro")?.prices[0]?.unitAmount ?? null), accent: "text-primary" },
          { label: "Enterprise", value: isLoading ? "…" : formatAmount(sorted.find(p => p.metadata?.tier === "enterprise")?.prices[0]?.unitAmount ?? null), accent: "text-emerald-400" },
          { label: "Custom from", value: isLoading ? "…" : formatAmount(sorted.find(p => p.metadata?.tier === "custom")?.prices[0]?.unitAmount ?? null), accent: "text-violet-400" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card px-4 py-3">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
            <p className={`text-lg font-bold font-mono ${stat.accent}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="bg-card border border-border py-20 flex items-center justify-center gap-3 text-primary font-mono text-sm uppercase tracking-widest animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading Packages...
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="bg-destructive/10 border border-destructive/30 px-6 py-10 text-center font-mono text-sm text-destructive uppercase tracking-wider">
          ✗ Failed to load packages. Check Stripe connection.
        </div>
      )}

      {/* Package cards grid */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-px bg-border">
          {sorted.map((product) => {
            const tier = product.metadata?.tier ?? "basic";
            const cfg = TIER_CONFIG[tier] ?? TIER_CONFIG.basic;
            const price = product.prices[0];
            const Icon = cfg.icon;
            const isProcessing = checkingOut === product.id;

            return (
              <div
                key={product.id}
                className={`bg-card flex flex-col ${cfg.featured ? "ring-1 ring-emerald-400/40 relative" : ""}`}
              >
                {cfg.featured && (
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
                )}

                {/* Card header */}
                <div className={`${cfg.headerBg} border-b border-border px-5 pt-5 pb-4`}>
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-[10px] font-mono uppercase tracking-widest border px-2 py-0.5 ${cfg.badgeBg}`}>
                      {cfg.label}
                    </span>
                    {cfg.featured && (
                      <span className="text-[10px] font-mono uppercase tracking-widest bg-emerald-400/20 border border-emerald-400/40 text-emerald-400 px-2 py-0.5">
                        RECOMMENDED
                      </span>
                    )}
                  </div>
                  <div className={`flex items-center gap-2 mb-2 ${cfg.accent}`}>
                    <Icon className="w-5 h-5" />
                    <span className="text-2xl font-bold font-mono">
                      {price ? formatAmount(price.unitAmount) : "—"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono uppercase tracking-wide leading-relaxed">
                    {cfg.description}
                  </p>
                </div>

                {/* Features */}
                <div className="flex-1 px-5 py-4 space-y-2.5">
                  {cfg.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2.5 group">
                      <CheckCircle2 className={`w-3 h-3 mt-0.5 shrink-0 ${cfg.accent} opacity-70`} />
                      <span className="text-xs font-mono text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Stripe price ID */}
                <div className="px-5 pb-2">
                  <p className="text-[10px] font-mono text-muted-foreground/40 truncate" title={price?.id}>
                    {price ? `▸ ${price.id}` : "NO PRICE CONFIGURED"}
                  </p>
                </div>

                {/* CTA */}
                <div className="px-5 pb-5">
                  <Button
                    variant="outline"
                    className={`w-full rounded-none uppercase tracking-widest text-xs font-bold h-9 gap-2 ${cfg.btnClass}`}
                    disabled={!price || isProcessing}
                    onClick={() => handleCheckout(product)}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" /> Connecting...
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-3 h-3" /> Initialize Checkout
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer note */}
      {!isLoading && !isError && sorted.length > 0 && (
        <div className="bg-muted/10 border border-border px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              ▸ All transactions processed via Stripe — test mode active
            </p>
            <p className="text-[10px] font-mono text-muted-foreground/50">
              Use card 4242 4242 4242 4242 · Exp 12/34 · CVC 123 for test payments
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-none text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground gap-1.5 h-7 px-3"
            onClick={() => setLocation("/contracts")}
          >
            <ArrowRight className="w-3 h-3" /> Pay via Contract
          </Button>
        </div>
      )}
    </div>
  );
}
