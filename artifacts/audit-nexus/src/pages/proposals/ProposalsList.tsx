import { useListProposals } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Plus, Search, Filter, ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

export function ProposalsList() {
  const { data: proposals, isLoading } = useListProposals();

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-widest text-primary mb-1 flex items-center gap-2">
            <FileText className="w-5 h-5" /> Proposals
          </h1>
          <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Active commercial offers pipeline</p>
        </div>
        <Link href="/proposals/new">
          <Button className="rounded-none uppercase tracking-widest text-xs font-bold border border-primary gap-2 h-8">
            <Plus className="w-3 h-3" /> Gen Proposal
          </Button>
        </Link>
      </div>

      <div className="bg-card border border-border shadow-none rounded-none">
        <div className="p-4 border-b border-border flex items-center gap-4 bg-muted/20">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-3 w-3 text-muted-foreground" />
            <Input
              type="search"
              placeholder="QUERY TITLE OR CLIENT..."
              className="pl-8 bg-background border-border rounded-none h-8 text-xs font-mono uppercase focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary"
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0 h-8 w-8 rounded-none border-border">
            <Filter className="w-3 h-3 text-primary" />
          </Button>
        </div>
        
        <div className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground h-10">Document Title</TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground h-10">Target Entity</TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground h-10">Tx Value</TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground h-10">Status</TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground h-10">Exp. Date</TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground h-10 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow className="border-border hover:bg-transparent">
                  <TableCell colSpan={6} className="text-center py-8 font-mono text-sm text-primary animate-pulse uppercase">
                    [ Fetching Records... ]
                  </TableCell>
                </TableRow>
              ) : !proposals || proposals.length === 0 ? (
                <TableRow className="border-border hover:bg-transparent">
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-3 font-mono text-sm uppercase">
                      <FileText className="w-6 h-6 text-muted-foreground/50" />
                      <p>No records found in database.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                proposals.map((proposal) => (
                  <TableRow key={proposal.id} className="group cursor-pointer hover:bg-primary/5 transition-colors border-border">
                    <TableCell className="font-mono text-sm font-medium max-w-[250px] truncate text-foreground" title={proposal.title}>
                      {proposal.title}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-wider text-foreground">{proposal.clientName}</span>
                        <span className="font-mono text-[10px] text-muted-foreground truncate max-w-[150px]">{proposal.clientEmail}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-primary">
                      ${proposal.totalPrice?.toLocaleString()} <span className="text-[10px] text-muted-foreground">{proposal.currency}</span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={proposal.status} />
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {proposal.validUntil ? format(new Date(proposal.validUntil), "yyyy-MM-dd") : "---"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/proposals/${proposal.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:text-primary hover:bg-primary/20">
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
