import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { AppLayout } from "@/components/layout/AppLayout";
import { Dashboard } from "@/pages/Dashboard";
import { AuditsList } from "@/pages/audits/AuditsList";
import { NewAudit } from "@/pages/audits/NewAudit";
import { AuditDetail } from "@/pages/audits/AuditDetail";
import { ProposalsList } from "@/pages/proposals/ProposalsList";
import { NewProposal } from "@/pages/proposals/NewProposal";
import { ProposalDetail } from "@/pages/proposals/ProposalDetail";
import { ContractsList } from "@/pages/contracts/ContractsList";
import { ContractDetail } from "@/pages/contracts/ContractDetail";
import { ClientsList } from "@/pages/clients/ClientsList";
import { ClientDetail } from "@/pages/clients/ClientDetail";
import { ProjectsList } from "@/pages/projects/ProjectsList";
import { PaymentSuccess } from "@/pages/payment/PaymentSuccess";
import { PaymentCancel } from "@/pages/payment/PaymentCancel";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        
        <Route path="/audits" component={AuditsList} />
        <Route path="/audits/new" component={NewAudit} />
        <Route path="/audits/:id" component={AuditDetail} />
        
        <Route path="/proposals" component={ProposalsList} />
        <Route path="/proposals/new" component={NewProposal} />
        <Route path="/proposals/:id" component={ProposalDetail} />
        
        <Route path="/contracts" component={ContractsList} />
        <Route path="/contracts/:id" component={ContractDetail} />
        
        <Route path="/clients" component={ClientsList} />
        <Route path="/clients/:id" component={ClientDetail} />
        
        <Route path="/projects" component={ProjectsList} />

        <Route path="/payment/success" component={PaymentSuccess} />
        <Route path="/payment/cancel" component={PaymentCancel} />
        
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
