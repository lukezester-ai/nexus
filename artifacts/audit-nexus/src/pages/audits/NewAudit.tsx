import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateAudit, useRunAudit } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Globe, User, Mail, Sparkles } from "lucide-react";
import { Link } from "wouter";

const schema = z.object({
  url: z.string().url("Please enter a valid URL (e.g., https://example.com)"),
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.string().email("Please enter a valid email address"),
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
      // 1. Create the audit record
      const audit = await createAudit.mutateAsync({ data });
      
      // 2. Trigger the audit run asynchronously
      runAudit.mutate({ id: audit.id });
      
      toast({
        title: "Audit Started",
        description: `Analysis for ${data.url} has begun.`,
      });
      
      setLocation(`/audits/${audit.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start the audit. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <Link href="/audits" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Audits
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Audit</h1>
        <p className="text-muted-foreground mt-1">Start a comprehensive SEO, GEO, and AEO analysis.</p>
      </div>

      <Card className="border-2 border-primary/10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Audit Target</CardTitle>
              <CardDescription>Enter the target URL and client details to begin the scan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target URL</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Globe className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="https://example.com" className="pl-10 h-12 text-lg" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Acme Corp" className="pl-9" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="clientEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="hello@example.com" type="email" className="pl-9" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 border-t border-border px-6 py-4 mt-6">
              <div className="flex items-center justify-between w-full">
                <p className="text-sm text-muted-foreground">Analysis typically takes 30-60 seconds.</p>
                <Button type="submit" size="lg" className="gap-2 px-8" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>Running Analysis...</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> Start Audit</>
                  )}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
