import { useListContracts } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Plus, Search, Filter, FileSignature, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

export function ContractsList() {
  const { data: contracts, isLoading } = useListContracts();

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-widest text-primary mb-1 flex items-center gap-2">
            <FileSignature className="w-5 h-5" /> Contracts
          </h1>
          <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Executed legal agreements</p>
        </div>
      </div>

      <div className="bg-card border border-border shadow-none rounded-none">
        <div className="p-4 border-b border-border flex items-center gap-4 bg-muted/20">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-3 w-3 text-muted-foreground" />
            <Input
              type="search"
              placeholder="QUERY CONTRACTS..."
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
                <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground h-10">Document Name</TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground h-10">Client Entity</TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground h-10">Value</TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground h-10">State</TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground h-10">Init Date</TableHead>
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
              ) : !contracts || contracts.length === 0 ? (
                <TableRow className="border-border hover:bg-transparent">
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-3 font-mono text-sm uppercase">
                      <FileSignature className="w-6 h-6 text-muted-foreground/50" />
                      <p>No records found in database.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                contracts.map((contract) => (
                  <TableRow key={contract.id} className="group cursor-pointer hover:bg-primary/5 transition-colors border-border">
                    <TableCell className="font-mono text-sm font-medium max-w-[250px] truncate text-foreground" title={contract.title}>
                      {contract.title}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-wider text-foreground">{contract.clientName}</span>
                        <span className="font-mono text-[10px] text-muted-foreground truncate max-w-[150px]">{contract.clientEmail}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-primary">
                      ${contract.totalAmount?.toLocaleString() || 0} <span className="text-[10px] text-muted-foreground">{contract.currency}</span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={contract.status} />
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {format(new Date(contract.createdAt), "yyyy-MM-dd")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/contracts/${contract.id}`}>
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
