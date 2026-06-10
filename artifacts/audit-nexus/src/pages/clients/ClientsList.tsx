import { useListClients } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Plus, Search, Filter, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

export function ClientsList() {
  const { data: clients, isLoading } = useListClients();

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-widest text-primary mb-1 flex items-center gap-2">
            <Users className="w-5 h-5" /> Client Roster
          </h1>
          <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Registered entities and cumulative metrics</p>
        </div>
      </div>

      <div className="bg-card border border-border shadow-none rounded-none">
        <div className="p-4 border-b border-border flex items-center gap-4 bg-muted/20">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-3 w-3 text-muted-foreground" />
            <Input
              type="search"
              placeholder="QUERY ENTITY..."
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
                <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground h-10">Entity Name</TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground h-10">Organization</TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground h-10 text-center">Active PRJ</TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground h-10 text-right">Cum. Revenue</TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground h-10">Reg Date</TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground h-10 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow className="border-border hover:bg-transparent">
                  <TableCell colSpan={6} className="text-center py-8 font-mono text-sm text-primary animate-pulse uppercase">
                    [ Fetching Entities... ]
                  </TableCell>
                </TableRow>
              ) : !clients || clients.length === 0 ? (
                <TableRow className="border-border hover:bg-transparent">
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-3 font-mono text-sm uppercase">
                      <Users className="w-6 h-6 text-muted-foreground/50" />
                      <p>No entities found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((client) => (
                  <TableRow key={client.id} className="group cursor-pointer hover:bg-primary/5 transition-colors border-border">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-wider text-foreground">{client.name}</span>
                        <span className="font-mono text-[10px] text-muted-foreground truncate">{client.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs uppercase">{client.company || "---"}</TableCell>
                    <TableCell className="text-center">
                      <span className="font-mono text-xs text-primary border border-primary/30 bg-primary/10 px-2 py-0.5">
                        {client.totalProjects.toString().padStart(2, '0')}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-foreground text-right font-bold">
                      ${client.totalRevenue?.toLocaleString() || 0}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {format(new Date(client.createdAt), "yyyy-MM-dd")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/clients/${client.id}`}>
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
