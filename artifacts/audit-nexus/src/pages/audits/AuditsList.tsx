import { useListAudits } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Plus, Search, Filter, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

export function AuditsList() {
  const { data: audits, isLoading } = useListAudits();

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audits</h1>
          <p className="text-muted-foreground mt-1">Manage and track website analysis jobs</p>
        </div>
        <Link href="/audits/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> New Audit
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
                placeholder="Search by URL or client..."
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
                <TableHead>URL</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Scores</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading audits...
                  </TableCell>
                </TableRow>
              ) : !audits || audits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No audits found. Create one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                audits.map((audit) => (
                  <TableRow key={audit.id} className="group cursor-pointer hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium max-w-[200px] truncate" title={audit.url}>
                      {audit.url}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{audit.clientName || "-"}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[150px]">{audit.clientEmail}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={audit.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1.5 text-xs font-medium">
                        {audit.status === "completed" ? (
                          <>
                            <span className="flex items-center justify-center w-8 h-8 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" title="SEO">
                              {audit.seoScore || 0}
                            </span>
                            <span className="flex items-center justify-center w-8 h-8 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" title="GEO">
                              {audit.geoScore || 0}
                            </span>
                            <span className="flex items-center justify-center w-8 h-8 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" title="AEO">
                              {audit.aeoScore || 0}
                            </span>
                          </>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(audit.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/audits/${audit.id}`}>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight className="w-4 h-4" />
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
