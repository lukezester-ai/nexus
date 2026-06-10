import { Link } from "wouter";
import { XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PaymentCancel() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="max-w-md w-full border border-border bg-card rounded-none p-10 text-center space-y-6 relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />

        <div className="flex justify-center">
          <div className="border border-amber-500 rounded-none p-4 bg-amber-500/5">
            <XCircle className="w-10 h-10 text-amber-500" />
          </div>
        </div>

        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-amber-500 mb-2">
            [ PAYMENT CANCELLED ]
          </div>
          <h1 className="font-mono text-xl font-bold uppercase tracking-widest text-foreground">
            Transaction Aborted
          </h1>
        </div>

        <p className="font-mono text-xs text-muted-foreground leading-relaxed">
          The payment was not completed. No charges have been made. You can retry from the contract page.
        </p>

        <Link href="/contracts">
          <Button variant="outline" className="w-full rounded-none font-mono text-[10px] uppercase font-bold border-border gap-2">
            <ArrowLeft className="w-3 h-3" /> Return to Contracts
          </Button>
        </Link>
      </div>
    </div>
  );
}
