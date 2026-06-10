import { useListProposals } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Plus, Search, Filter, ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

export function ProposalsList() {
  const { data: proposals, isLoading } = useListProposals();

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Proposals</h1>
          <p className="text-muted-foreground mt-1">Manage service proposals and quotes</p>
        </div>
        <Link href="/proposals/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> New Proposal
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="py-4 border-b">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search proposals..."
                className="pl-8 bg-background"
              />
            </div>
            <Button variant="outline" size="icon" className="shrink-0">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading proposals...
                  </TableCell>
                </TableRow>
              ) : !proposals || proposals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <FileText className="w-10 h-10 text-muted-foreground/30" />
                      <p>No proposals found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                proposals.map((proposal) => (
                  <TableRow key={proposal.id} className="group cursor-pointer hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium max-w-[250px] truncate" title={proposal.title}>
                      {proposal.title}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{proposal.clientName}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[150px]">{proposal.clientEmail}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      ${proposal.totalPrice?.toLocaleString()} <span className="text-xs text-muted-foreground font-normal">{proposal.currency}</span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={proposal.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {proposal.validUntil ? format(new Date(proposal.validUntil), "MMM d, yyyy") : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/proposals/${proposal.id}`}>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
