import { useListProjects } from "@workspace/api-client-react";
import { Search, Filter, Briefcase, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";

export function ProjectsList() {
  const { data: projects, isLoading } = useListProjects();

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-widest text-primary mb-1 flex items-center gap-2">
            <Terminal className="w-5 h-5" /> Active Projects
          </h1>
          <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Tracking vectors and deliverables</p>
        </div>
      </div>

      <div className="bg-card border border-border shadow-none rounded-none">
        <div className="p-4 border-b border-border flex items-center gap-4 bg-muted/20">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-3 w-3 text-muted-foreground" />
            <Input
              type="search"
              placeholder="QUERY PRJ NAME..."
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
                <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground h-10">PRJ Name</TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground h-10">Entity</TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground h-10">State</TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground h-10 w-[200px]">Velocity</TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground h-10">Term Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow className="border-border hover:bg-transparent">
                  <TableCell colSpan={5} className="text-center py-8 font-mono text-sm text-primary animate-pulse uppercase">
                    [ Fetching Streams... ]
                  </TableCell>
                </TableRow>
              ) : !projects || projects.length === 0 ? (
                <TableRow className="border-border hover:bg-transparent">
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-3 font-mono text-sm uppercase">
                      <Briefcase className="w-6 h-6 text-muted-foreground/50" />
                      <p>No streams found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project) => (
                  <TableRow key={project.id} className="group hover:bg-primary/5 transition-colors border-border">
                    <TableCell className="font-mono text-sm font-bold uppercase tracking-wider max-w-[200px] truncate text-foreground" title={project.name}>
                      {project.name}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs uppercase text-foreground">{project.clientName}</span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={project.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Progress value={project.progress} className="h-1 flex-1 rounded-none bg-border" indicatorClassName="bg-primary" />
                        <span className="font-mono text-[10px] text-muted-foreground w-8 text-right">[{String(project.progress).padStart(3,'0')}%]</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {project.endDate ? format(new Date(project.endDate), "yyyy-MM-dd") : "---"}
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
