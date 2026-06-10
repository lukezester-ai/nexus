import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateProposal, useGetAudit } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2, FileText, Send, Calendar } from "lucide-react";
import { Link } from "wouter";
import { format, addDays } from "date-fns";

const serviceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  duration: z.string().optional(),
});

const schema = z.object({
  auditId: z.coerce.number().optional(),
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.string().email("Valid email required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  currency: z.string().default("USD"),
  validUntil: z.string().optional(),
  services: z.array(serviceSchema).min(1, "At least one service is required"),
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

  const { data: audit, isLoading: isAuditLoading } = useGetAudit(parsedAuditId as number, {
    query: { enabled: !!parsedAuditId }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      auditId: parsedAuditId,
      clientName: "",
      clientEmail: "",
      title: "Comprehensive Digital Audit & Strategy",
      description: "Based on our analysis, we recommend the following services to improve your digital presence.",
      currency: "USD",
      validUntil: format(addDays(new Date(), 14), "yyyy-MM-dd"),
      services: [
        { name: "Technical SEO Fixes", description: "Resolve critical crawler issues", price: 1500, duration: "2 weeks" }
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "services",
  });

  // Pre-fill form from audit if available
  useEffect(() => {
    if (audit) {
      form.setValue("clientName", audit.clientName || "");
      form.setValue("clientEmail", audit.clientEmail || "");
      
      const newServices = [];
      if (audit.seoScore && audit.seoScore < 80) {
        newServices.push({ name: "SEO Optimization Package", description: "Technical and on-page SEO improvements", price: 2500, duration: "1 month" });
      }
      if (audit.geoScore && audit.geoScore < 80) {
        newServices.push({ name: "Local SEO & Citation Building", description: "Improve local map pack presence", price: 1200, duration: "3 weeks" });
      }
      if (audit.aeoScore && audit.aeoScore < 80) {
        newServices.push({ name: "AEO & Structured Data", description: "Schema markup and featured snippet optimization", price: 1800, duration: "2 weeks" });
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
        data: {
          ...data,
          totalPrice,
        }
      });
      
      toast({
        title: "Proposal Created",
        description: "The proposal has been saved successfully.",
      });
      
      setLocation(`/proposals/${proposal.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create proposal.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-4">
        <Link href="/proposals" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Proposals
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Proposal</h1>
        <p className="text-muted-foreground mt-1">
          {audit ? `Generating from audit ${audit.url}` : 'Create a new service proposal'}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl><Input placeholder="Acme Corp" {...field} /></FormControl>
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
                    <FormControl><Input type="email" placeholder="client@example.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Proposal Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proposal Title</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea className="min-h-[100px]" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="validUntil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valid Until</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input type="date" className="pl-9" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Services & Pricing</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={() => append({ name: "", price: 0 })}>
                <Plus className="w-4 h-4 mr-2" /> Add Service
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="p-4 border border-border rounded-lg bg-muted/20 relative">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pr-8">
                    <div className="md:col-span-5 space-y-4">
                      <FormField
                        control={form.control}
                        name={`services.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Service Name</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`services.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Details (Optional)</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="md:col-span-4 space-y-4">
                      <FormField
                        control={form.control}
                        name={`services.${index}.duration`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Duration (Optional)</FormLabel>
                            <FormControl><Input placeholder="e.g. 2 weeks" {...field} /></FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="md:col-span-3 space-y-4">
                      <FormField
                        control={form.control}
                        name={`services.${index}.price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Price</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                <Input type="number" className="pl-7" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {fields.length === 0 && (
                <div className="text-center py-6 text-muted-foreground bg-muted/10 rounded-lg border border-dashed">
                  No services added. Click "Add Service" to include pricing.
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-muted/30 border-t border-border px-6 py-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground font-medium">Total Value</div>
              <div className="text-2xl font-bold">${totalPrice.toLocaleString()}</div>
            </CardFooter>
          </Card>

          <div className="flex justify-end gap-4">
            <Link href="/proposals">
              <Button variant="outline" type="button">Cancel</Button>
            </Link>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              <Send className="w-4 h-4" /> 
              {isSubmitting ? "Creating..." : "Create Proposal"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
