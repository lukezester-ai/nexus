import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { ArrowUpRight, Cpu, Scale, Truck, Target, Network, Activity, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  },
};

export default function Hub() {
  const products = [
    {
      id: "terraiq",
      name: "TerraIQ",
      tagline: "AI Agents, Business Intelligence, Automation",
      url: "https://www.terraiq.me",
      status: "ONLINE",
      color: "hsl(var(--primary))",
      icon: Cpu,
      features: ["Predictive Modeling", "Autonomous Agents", "Data Analysis"],
      metrics: "128 Core Functions",
    },
    {
      id: "agrinexus",
      name: "AgriNexus Law",
      tagline: "Contracts, Compliance, Legal AI",
      url: "https://www.agrinexuslaw.com",
      status: "ONLINE",
      color: "#10b981", // emerald-500
      icon: Scale,
      features: ["Contract Gen", "Compliance", "Legal Research"],
      metrics: "64 Core Functions",
    },
    {
      id: "fieldlot",
      name: "FieldLot",
      tagline: "Marketplace, Trading, Logistics",
      url: "https://www.fieldlot.io",
      status: "ONLINE",
      color: "#f59e0b", // amber-500
      icon: Truck,
      features: ["Live Bidding", "Supply Chain", "Escrow"],
      metrics: "92 Core Functions",
    },
    {
      id: "auditnexus",
      name: "AuditNexus",
      tagline: "SEO Audit, GEO Audit, AEO Audit, Proposal Engine, Lead Generation",
      url: "/dashboard",
      status: "ONLINE",
      color: "#8b5cf6", // purple-500
      icon: Target,
      features: ["SEO/GEO/AEO", "Proposals", "Lead Scoring"],
      metrics: "Live Analysis",
    }
  ];

  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-primary/30 selection:text-primary-foreground overflow-x-hidden">
      <Navbar />
      
      {/* Background Noise/Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20" style={{ 
        backgroundImage: 'radial-gradient(circle at center, hsl(var(--border)) 1px, transparent 1px)',
        backgroundSize: '32px 32px' 
      }} />
      <div className="fixed inset-0 pointer-events-none z-0 mix-blend-overlay opacity-40 bg-noise" />

      {/* Header Section */}
      <section className="relative pt-40 pb-20 px-6 z-10">
        <motion.div 
          className="container mx-auto max-w-6xl text-center flex flex-col items-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-primary uppercase">4 Systems Online</span>
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-serif font-bold tracking-tight mb-6 leading-tight">
            NEXUS <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">HUB</span>
          </motion.h1>
          
          <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted-foreground font-mono max-w-2xl mx-auto tracking-widest uppercase">
            Ecosystem Control Center
          </motion.p>
        </motion.div>
      </section>

      {/* Products Grid */}
      <section className="py-10 relative z-10">
        <div className="container mx-auto max-w-6xl px-6">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {products.map((product) => {
              const isDev = product.status === "IN DEVELOPMENT";
              return (
                <motion.div 
                  key={product.id}
                  variants={fadeUp}
                  className={`group relative p-8 bg-card border border-border rounded-xl overflow-hidden transition-all duration-500 ${isDev ? 'opacity-80' : 'hover:-translate-y-1'}`}
                  style={{ '--card-accent': product.color } as any}
                >
                  {/* Hover Glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(circle at center, var(--card-accent) 0%, transparent 70%)` }} />
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--card-accent)]/30 rounded-xl transition-colors duration-500 pointer-events-none" />

                  {isDev && <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] z-10 pointer-events-none" />}

                  <div className="relative z-20 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-lg bg-background border border-border flex items-center justify-center shadow-lg">
                        <product.icon className="w-6 h-6" style={{ color: product.color }} />
                      </div>
                      <div className={`text-xs font-mono px-3 py-1 rounded border ${isDev ? 'border-purple-500/30 text-purple-400 bg-purple-500/10' : 'border-primary/30 text-primary bg-primary/10'}`}>
                        {product.status}
                      </div>
                    </div>

                    <h3 className="text-2xl font-serif font-bold mb-2 group-hover:text-[var(--card-accent)] transition-colors">{product.name}</h3>
                    <p className="text-sm text-muted-foreground font-sans mb-6 h-10">{product.tagline}</p>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {product.features.map(f => (
                        <span key={f} className="text-xs font-mono bg-background border border-border px-2 py-1 rounded text-muted-foreground">
                          {f}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto pt-6 border-t border-border flex items-center justify-between">
                      <span className="text-xs font-mono text-muted-foreground flex items-center gap-2">
                        <Activity className="w-3 h-3" /> {product.metrics}
                      </span>
                      
                      {isDev ? (
                        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
                          <Lock className="w-3 h-3" /> Coming Soon
                        </div>
                      ) : (
                        <Button asChild variant="outline" className="font-mono text-xs uppercase tracking-widest border-[var(--card-accent)]/50 text-[var(--card-accent)] hover:bg-[var(--card-accent)]/10 hover:text-[var(--card-accent)]">
                          <a href={product.url} target="_blank" rel="noopener noreferrer">
                            Launch <ArrowUpRight className="w-4 h-4 ml-2" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Ecosystem Diagram */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-sm font-mono tracking-widest uppercase text-muted-foreground mb-4">Architecture</h2>
            <h3 className="text-3xl font-serif font-bold">SYNAPSE NETWORK</h3>
          </motion.div>

          <div className="relative h-[400px] flex items-center justify-center">
            {/* Center Node */}
            <motion.div 
              className="absolute z-20 w-32 h-32 rounded-full border border-primary/50 bg-background flex flex-col items-center justify-center shadow-[0_0_50px_-10px_hsl(var(--primary))]"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              <Network className="w-8 h-8 text-primary mb-2" />
              <span className="text-xs font-mono font-bold tracking-widest">NEXUS</span>
            </motion.div>

            {/* Orbiting Nodes Lines */}
            <div className="absolute inset-0 border border-border rounded-full opacity-20" style={{ transform: 'scale(0.8)' }} />
            <div className="absolute inset-0 border border-border rounded-full opacity-10" style={{ transform: 'scale(1.2)' }} />

            {/* 4 Nodes */}
            {[
              { label: "TerraIQ", angle: 0, color: "hsl(var(--primary))" },
              { label: "AgriNexus", angle: 90, color: "#10b981" },
              { label: "FieldLot", angle: 180, color: "#f59e0b" },
              { label: "AuditNexus", angle: 270, color: "#8b5cf6" },
            ].map((node, i) => (
              <motion.div
                key={node.label}
                className="absolute z-10 w-24 h-24 rounded-full border bg-card flex items-center justify-center"
                style={{
                  borderColor: `${node.color}50`,
                  boxShadow: `0 0 20px -5px ${node.color}`,
                  top: '50%',
                  left: '50%',
                  marginTop: '-3rem',
                  marginLeft: '-3rem',
                }}
                initial={{ opacity: 0, x: 0, y: 0 }}
                whileInView={{ opacity: 1, 
                  x: Math.cos(node.angle * (Math.PI / 180)) * 160,
                  y: Math.sin(node.angle * (Math.PI / 180)) * 160 
                }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 + 0.5 }}
              >
                <span className="text-xs font-mono" style={{ color: node.color }}>{node.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative z-10 border-t border-border/50 bg-card/30">
        <div className="container mx-auto max-w-2xl px-6 text-center">
          <Network className="w-12 h-12 text-muted-foreground mx-auto mb-6 opacity-50" />
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Request Full Access</h2>
          <p className="text-muted-foreground font-mono text-sm mb-10 leading-relaxed">
            Enterprise deployments require validation. Submit your credentials to initiate the onboarding sequence for the complete ecosystem.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                type="email" 
                placeholder="ENTERPRISE EMAIL" 
                className="pl-10 font-mono text-sm h-12 bg-background border-border focus-visible:ring-primary"
              />
            </div>
            <Button type="submit" className="h-12 px-8 font-mono text-xs tracking-widest uppercase bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_-5px_hsl(var(--primary))] shrink-0">
              Initialize
            </Button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}