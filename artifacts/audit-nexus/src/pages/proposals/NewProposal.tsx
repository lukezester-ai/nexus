import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateProposal, useGetAudit, getGetAuditQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2, Send, Calendar, FileText } from "lucide-react";
import { Link } from "wouter";
import { format, addDays } from "date-fns";

const serviceSchema = z.object({
  name: z.string().min(1, "Required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Positive"),
  duration: z.string().optional(),
});

const schema = z.object({
  auditId: z.coerce.number().optional(),
  clientName: z.string().min(1, "Required"),
  clientEmail: z.string().email("Valid email required"),
  title: z.string().min(1, "Required"),
  description: z.string().optional(),
  currency: z.string().default("USD"),
  validUntil: z.string().optional(),
  services: z.array(serviceSchema).min(1, "Min. 1 service required"),
});

type FormValues = z.infer<typeof schema>;

export function NewProposal() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const auditIdParam = params.get("auditId");
  const parsedAuditId = auditIdParam ? parseInt(auditIdParam, 10) : undefined;

  const { toast } = useToast();
  const createProposal = useCreateProposal();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: audit } = useGetAudit(parsedAuditId as number, {
    query: { queryKey: getGetAuditQueryKey(parsedAuditId as number), enabled: !!parsedAuditId }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      auditId: parsedAuditId,
      clientName: "",
      clientEmail: "",
      title: "SYSTEM OPTIMIZATION PROPOSAL",
      description: "Proposed directives to rectify identified anomalies and optimize system output.",
      currency: "USD",
      validUntil: format(addDays(new Date(), 14), "yyyy-MM-dd"),
      services: [
        { name: "Technical SEO Fixes", description: "Resolve critical crawler issues", price: 1500, duration: "2w" }
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "services",
  });

  useEffect(() => {
    if (audit) {
      form.setValue("clientName", audit.clientName || "");
      form.setValue("clientEmail", audit.clientEmail || "");
      
      const newServices = [];
      if (audit.seoScore && audit.seoScore < 80) {
        newServices.push({ name: "SEO Optimization", description: "Resolve core index anomalies", price: 2500, duration: "4w" });
      }
      if (audit.geoScore && audit.geoScore < 80) {
        newServices.push({ name: "GEO Graph Expansion", description: "Enhance local presence signals", price: 1200, duration: "3w" });
      }
      if (audit.aeoScore && audit.aeoScore < 80) {
        newServices.push({ name: "AEO Structured Data", description: "Inject schema directives", price: 1800, duration: "2w" });
      }
      
      if (newServices.length > 0) {
        form.setValue("services", newServices);
      }
    }
  }, [audit, form]);

  const watchedServices = form.watch("services");
  const totalPrice = watchedServices.reduce((sum, service) => sum + (Number(service.price) || 0), 0);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const proposal = await createProposal.mutateAsync({
        data: { ...data, totalPrice }
      });
      toast({ title: "RECORD GENERATED", description: "Proposal logged to database." });
      setLocation(`/proposals/${proposal.id}`);
    } catch (error) {
      toast({ title: "SYS ERR", description: "Write failed.", variant: "destructive" });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link href="/proposals" className="inline-flex items-center text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-3 h-3 mr-2" /> Return to Proposals
      </Link>

      <div>
        <h1 className="text-xl font-bold uppercase tracking-widest text-primary mb-1 flex items-center gap-2">
          <FileText className="w-5 h-5" /> Generate Proposal
        </h1>
        <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
          {audit ? `[ SRC: AUDIT-${audit.id.toString().padStart(4,'0')} ]` : '[ MODE: MANUAL ENTRY ]'}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-card border border-border p-6">
                <h2 className="font-mono text-[10px] uppercase tracking-widest text-primary mb-4 border-b border-border pb-2">Target Entity</h2>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="clientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-[10px] uppercase text-muted-foreground">Entity Name</FormLabel>
                        <FormControl><Input className="rounded-none h-8 font-mono text-sm bg-background border-border" {...field} /></FormControl>
                        <FormMessage className="font-mono text-[10px]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="clientEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-[10px] uppercase text-muted-foreground">Comm Vector</FormLabel>
                        <FormControl><Input type="email" className="rounded-none h-8 font-mono text-sm bg-background border-border" {...field} /></FormControl>
                        <FormMessage className="font-mono text-[10px]" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="bg-card border border-border p-6">
                <h2 className="font-mono text-[10px] uppercase tracking-widest text-primary mb-4 border-b border-border pb-2">Meta Data</h2>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-[10px] uppercase text-muted-foreground">Doc Title</FormLabel>
                        <FormControl><Input className="rounded-none h-8 font-mono text-sm bg-background border-border" {...field} /></FormControl>
                        <FormMessage className="font-mono text-[10px]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-[10px] uppercase text-muted-foreground">Abstract</FormLabel>
                        <FormControl><Textarea className="rounded-none min-h-[80px] font-mono text-xs bg-background border-border" {...field} /></FormControl>
                        <FormMessage className="font-mono text-[10px]" />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-mono text-[10px] uppercase text-muted-foreground">Currency</FormLabel>
                          <FormControl><Input className="rounded-none h-8 font-mono text-sm bg-background border-border" {...field} /></FormControl>
                          <FormMessage className="font-mono text-[10px]" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="validUntil"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-mono text-[10px] uppercase text-muted-foreground">Expiry</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
                              <Input type="date" className="pl-8 rounded-none h-8 font-mono text-sm bg-background border-border" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage className="font-mono text-[10px]" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border flex flex-col">
              <div className="p-4 border-b border-border flex items-center justify-between bg-muted/10">
                <h2 className="font-mono text-[10px] uppercase tracking-widest text-primary">Service Modules</h2>
                <Button type="button" variant="outline" size="sm" className="rounded-none h-6 text-[10px] font-mono uppercase px-2 py-0 border-border" onClick={() => append({ name: "", price: 0 })}>
                  <Plus className="w-3 h-3 mr-1" /> Add
                </Button>
              </div>
              <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-3 border border-border bg-background relative group">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-1 right-1 h-6 w-6 rounded-none text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                    
                    <div className="grid grid-cols-1 gap-3 pr-6">
                      <FormField
                        control={form.control}
                        name={`services.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-mono text-[10px] uppercase text-muted-foreground sr-only">Name</FormLabel>
                            <FormControl><Input placeholder="MOD_NAME" className="rounded-none h-7 font-mono text-sm bg-transparent border-0 border-b border-border focus-visible:ring-0 focus-visible:border-primary px-0" {...field} /></FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`services.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl><Input placeholder="DESC (OPT)" className="rounded-none h-6 font-mono text-xs text-muted-foreground bg-transparent border-0 px-0 focus-visible:ring-0" {...field} /></FormControl>
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        <FormField
                          control={form.control}
                          name={`services.${index}.duration`}
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center gap-2 border border-border px-2 h-8">
                                <span className="font-mono text-[10px] text-muted-foreground shrink-0">DUR</span>
                                <FormControl><Input className="rounded-none h-full font-mono text-xs bg-transparent border-0 focus-visible:ring-0 px-0" {...field} /></FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`services.${index}.price`}
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center gap-2 border border-border px-2 h-8 bg-primary/5">
                                <span className="font-mono text-[10px] text-primary font-bold shrink-0">VAL $</span>
                                <FormControl><Input type="number" className="rounded-none h-full font-mono text-sm font-bold bg-transparent border-0 focus-visible:ring-0 px-0 text-right" {...field} /></FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {fields.length === 0 && (
                  <div className="text-center py-6 font-mono text-[10px] uppercase text-muted-foreground border border-dashed border-border">
                    NO MODULES LOADED
                  </div>
                )}
              </div>
              <div className="bg-primary/10 border-t border-border p-4 flex items-center justify-between mt-auto">
                <div className="font-mono text-[10px] uppercase tracking-widest text-primary">Aggregate TX Value</div>
                <div className="font-mono text-xl font-bold text-foreground">${totalPrice.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 border-t border-border pt-6">
            <Link href="/proposals">
              <Button variant="outline" type="button" className="rounded-none font-mono text-[10px] uppercase tracking-widest border-border">Abort</Button>
            </Link>
            <Button type="submit" disabled={isSubmitting} className="rounded-none font-mono text-[10px] uppercase tracking-widest font-bold border border-primary gap-2">
              <Send className="w-3 h-3" /> 
              {isSubmitting ? "[ WRITING ]" : "COMMIT PROPOSAL"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
