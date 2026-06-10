import { useEffect, useState } from "react";
import { Link, useSearch } from "wouter";
import { CheckCircle2, ArrowRight, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PaymentSuccess() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const sessionId = params.get("session_id");
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) { setLoading(false); return; }
    fetch(`/api/stripe/session/${sessionId}`)
      .then((r) => r.json())
      .then((data) => { setSession(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [sessionId]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="max-w-md w-full border border-border bg-card rounded-none p-10 text-center space-y-6 relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />

        <div className="flex justify-center">
          <div className="border border-green-500 rounded-none p-4 bg-green-500/5">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-green-500 mb-2">
            [ PAYMENT CONFIRMED ]
          </div>
          <h1 className="font-mono text-xl font-bold uppercase tracking-widest text-foreground">
            Transaction Complete
          </h1>
        </div>

        {loading ? (
          <div className="font-mono text-xs text-muted-foreground animate-pulse">
            [ Verifying... ]
          </div>
        ) : session ? (
          <div className="bg-muted/10 border border-border p-4 text-left space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Transaction Record
            </div>
            <div className="font-mono text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="text-green-500 uppercase">{session.status}</span>
              </div>
              {session.amountTotal && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="text-foreground font-bold">
                    ${(session.amountTotal / 100).toLocaleString()} {session.currency?.toUpperCase()}
                  </span>
                </div>
              )}
              {session.customerEmail && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Client:</span>
                  <span className="text-foreground">{session.customerEmail}</span>
                </div>
              )}
            </div>
          </div>
        ) : null}

        <p className="font-mono text-xs text-muted-foreground leading-relaxed">
          Your project has been activated. The team has been notified and will begin execution per contract terms.
        </p>

        <div className="flex flex-col gap-2">
          <Link href="/projects">
            <Button className="w-full rounded-none font-mono text-[10px] uppercase font-bold gap-2">
              <Terminal className="w-3 h-3" /> View Projects
              <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
          <Link href="/contracts">
            <Button variant="outline" className="w-full rounded-none font-mono text-[10px] uppercase font-bold border-border">
              Return to Contracts
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
