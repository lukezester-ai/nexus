import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      status: {
        // Audit
        pending: "bg-muted text-muted-foreground border-transparent",
        running: "bg-blue-100 text-blue-800 border-transparent dark:bg-blue-900/30 dark:text-blue-400",
        completed: "bg-green-100 text-green-800 border-transparent dark:bg-green-900/30 dark:text-green-400",
        failed: "bg-red-100 text-red-800 border-transparent dark:bg-red-900/30 dark:text-red-400",
        
        // Proposal & Contract
        draft: "bg-muted text-muted-foreground border-transparent",
        sent: "bg-yellow-100 text-yellow-800 border-transparent dark:bg-yellow-900/30 dark:text-yellow-400",
        accepted: "bg-green-100 text-green-800 border-transparent dark:bg-green-900/30 dark:text-green-400",
        rejected: "bg-red-100 text-red-800 border-transparent dark:bg-red-900/30 dark:text-red-400",
        signed: "bg-green-100 text-green-800 border-transparent dark:bg-green-900/30 dark:text-green-400",
        
        // Project & Contract
        active: "bg-blue-100 text-blue-800 border-transparent dark:bg-blue-900/30 dark:text-blue-400",
        paused: "bg-yellow-100 text-yellow-800 border-transparent dark:bg-yellow-900/30 dark:text-yellow-400",
        cancelled: "bg-red-100 text-red-800 border-transparent dark:bg-red-900/30 dark:text-red-400",
      },
    },
    defaultVariants: {
      status: "pending",
    },
  }
);

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof statusBadgeVariants> {
  status: any;
}

export function StatusBadge({ className, status, ...props }: StatusBadgeProps) {
  // Map incoming string status to our known variants
  const mappedStatus = (typeof status === 'string' ? status.toLowerCase() : "pending") as any;
  
  return (
    <div className={cn(statusBadgeVariants({ status: mappedStatus }), className)} {...props}>
      {status ? String(status).charAt(0).toUpperCase() + String(status).slice(1) : "Unknown"}
    </div>
  );
}
