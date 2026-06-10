import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateAudit, useRunAudit } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Globe, User, Mail, Sparkles, Terminal } from "lucide-react";
import { Link } from "wouter";

const schema = z.object({
  url: z.string().url("Valid URL required (e.g., https://example.com)"),
  clientName: z.string().min(1, "Client name required"),
  clientEmail: z.string().email("Valid email required"),
});

type FormValues = z.infer<typeof schema>;

export function NewAudit() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createAudit = useCreateAudit();
  const runAudit = useRunAudit();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      url: "",
      clientName: "",
      clientEmail: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const audit = await createAudit.mutateAsync({ data });
      runAudit.mutate({ id: audit.id });
      
      toast({
        title: "SEQUENCE INITIATED",
        description: `Analysis protocol running for ${data.url}`,
      });
      
      setLocation(`/audits/${audit.id}`);
    } catch (error) {
      toast({
        title: "SYSTEM ERROR",
        description: "Failed to initialize protocol. Check logs.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Link href="/audits" className="inline-flex items-center text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-3 h-3 mr-2" /> Return to Database
      </Link>

      <div>
        <h1 className="text-xl font-bold uppercase tracking-widest text-primary mb-1 flex items-center gap-2">
          <Terminal className="w-5 h-5" /> Initialize Scan Protocol
        </h1>
        <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Input target vector and client identifiers</p>
      </div>

      <div className="bg-card border border-border rounded-none shadow-none relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-6 space-y-6 border-b border-border">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Target URL</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Globe className="absolute left-3 top-2.5 h-4 w-4 text-primary" />
                        <Input 
                          placeholder="https://target-domain.com" 
                          className="pl-10 h-10 rounded-none border-border bg-background font-mono text-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="font-mono text-[10px] uppercase" />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Client Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-4 w-4 text-primary" />
                          <Input 
                            placeholder="ENTITY NAME" 
                            className="pl-10 h-10 rounded-none border-border bg-background font-mono text-sm uppercase focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="font-mono text-[10px] uppercase" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="clientEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Client Comm Channel (Email)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-primary" />
                          <Input 
                            placeholder="COMM@DOMAIN.COM" 
                            type="email" 
                            className="pl-10 h-10 rounded-none border-border bg-background font-mono text-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="font-mono text-[10px] uppercase" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="bg-muted/10 p-4 flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse inline-block" />
                Est. computation time: 30-60s
              </p>
              <Button 
                type="submit" 
                className="h-10 rounded-none uppercase tracking-widest font-bold border border-primary text-xs gap-2" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="font-mono">[ EXECUTING ]</span>
                ) : (
                  <><Sparkles className="w-4 h-4" /> EXECUTE PROTOCOL</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
