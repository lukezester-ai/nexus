import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, ArrowUpRight, Box, BarChart2, Scale, Truck, Activity, Cpu, Network, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/images/hero.png";
import terraIqImg from "@/assets/images/terraiq.png";
import agriNexusImg from "@/assets/images/agrinexus-law.png";
import fieldLotImg from "@/assets/images/fieldlot.png";
import auditNexusImg from "@/assets/images/auditnexus.png";

// Animation Variants
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  },
};

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-primary/30 selection:text-primary-foreground overflow-x-hidden" ref={containerRef}>
      <Navbar />
      
      {/* Background Noise/Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20" style={{ 
        backgroundImage: 'radial-gradient(circle at center, hsl(var(--border)) 1px, transparent 1px)',
        backgroundSize: '32px 32px' 
      }} />
      <div className="fixed inset-0 pointer-events-none z-0 mix-blend-overlay opacity-40 bg-noise" />

      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-background/80 z-10" />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-background to-transparent z-10" />
          <motion.div 
            className="w-full h-full"
            style={{ 
              y: useTransform(scrollYProgress, [0, 1], ["0%", "50%"]),
              opacity: useTransform(scrollYProgress, [0, 0.5], [1, 0])
            }}
          >
            <img src={heroImg} alt="Mission Control" className="w-full h-full object-cover object-center opacity-40" />
          </motion.div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center flex flex-col items-center"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-mono tracking-widest text-primary uppercase">Ecosystem Online</span>
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight mb-8 leading-[1.1]">
              COMMAND <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[hsl(var(--chart-4))]">EVERYTHING.</span><br />
              MISS NOTHING.
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted-foreground font-mono max-w-2xl mx-auto mb-10 leading-relaxed">
              The unified intelligence platform for enterprise. Four specialized engines powering agriculture, law, commerce, and growth. Built for decision-makers who move fast.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4">
              <Button size="lg" onClick={() => document.getElementById('terraiq')?.scrollIntoView({ behavior: 'smooth' })} className="h-14 px-8 font-mono text-sm tracking-widest uppercase bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_-5px_hsl(var(--primary))] w-full sm:w-auto">
                Initialize Nexus <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => document.getElementById('auditnexus')?.scrollIntoView({ behavior: 'smooth' })} className="h-14 px-8 font-mono text-sm tracking-widest uppercase border-border hover:bg-card w-full sm:w-auto">
                Explore Architecture
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Ecosystem Overview */}
      <section className="py-32 relative z-10 bg-card/50 border-y border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">ONE CORE.<br/>FOUR ENGINES.</h2>
            <p className="text-muted-foreground font-mono">
              The NEXUS Ecosystem operates as a cohesive unit. Data flows seamlessly between intelligence, legal, commerce, and growth layers, providing a singular source of truth.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { id: "01", name: "TerraIQ", desc: "Intelligence & Autonomous Agents", icon: Cpu, color: "var(--chart-1)" },
              { id: "02", name: "AgriNexus Law", desc: "Compliance & Legal Infrastructure", icon: Scale, color: "var(--chart-2)" },
              { id: "03", name: "FieldLot", desc: "Marketplace & Logistics", icon: Truck, color: "var(--chart-3)" },
              { id: "04", name: "AuditNexus", desc: "Growth & Digital Auditing", icon: Target, color: "var(--chart-4)" }
            ].map((module, i) => (
              <motion.div 
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group relative p-6 bg-background border border-border rounded-xl overflow-hidden hover:border-[hsl(var(--chart-1))]/50 transition-colors"
                style={{ '--accent-color': module.color } as any}
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                  <module.icon className="w-24 h-24" style={{ color: "hsl(var(--accent-color))" }} />
                </div>
                <div className="relative z-10">
                  <span className="text-xs font-mono tracking-widest text-muted-foreground mb-4 block">{module.id} // MODULE</span>
                  <h3 className="text-xl font-bold font-serif mb-2 group-hover:text-[hsl(var(--accent-color))] transition-colors">{module.name}</h3>
                  <p className="text-sm text-muted-foreground font-mono mb-6">{module.desc}</p>
                  <div className="w-8 h-1 bg-border group-hover:bg-[hsl(var(--accent-color))] transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product 01: TerraIQ */}
      <section id="terraiq" className="py-32 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="font-mono text-sm tracking-widest text-[hsl(var(--chart-1))] border border-[hsl(var(--chart-1))]/30 px-2 py-1 rounded bg-[hsl(var(--chart-1))]/10">01</span>
                <span className="font-mono tracking-widest uppercase text-muted-foreground text-sm">Intelligence Engine</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6">TerraIQ</h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed font-sans">
                The central nervous system. TerraIQ handles massive data analysis, predictive modeling, and deploys autonomous agents to automate complex workflows across your enterprise.
              </p>
              <ul className="space-y-4 mb-10 font-mono text-sm">
                <li className="flex items-start gap-3">
                  <Activity className="w-5 h-5 text-[hsl(var(--chart-1))] shrink-0" />
                  <span className="text-muted-foreground">Real-time business intelligence dashboards</span>
                </li>
                <li className="flex items-start gap-3">
                  <Activity className="w-5 h-5 text-[hsl(var(--chart-1))] shrink-0" />
                  <span className="text-muted-foreground">Autonomous agents for continuous optimization</span>
                </li>
                <li className="flex items-start gap-3">
                  <Activity className="w-5 h-5 text-[hsl(var(--chart-1))] shrink-0" />
                  <span className="text-muted-foreground">Predictive modeling for market movements</span>
                </li>
              </ul>
              <Button asChild variant="outline" className="font-mono text-xs uppercase tracking-widest border-[hsl(var(--chart-1))]/50 text-[hsl(var(--chart-1))] hover:bg-[hsl(var(--chart-1))]/10">
                <a href="https://terraiq.me" target="_blank" rel="noopener noreferrer">Access TerraIQ <ArrowUpRight className="w-3 h-3 ml-2" /></a>
              </Button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-card shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[hsl(var(--chart-1))]/20 to-transparent mix-blend-overlay z-10" />
              <img src={terraIqImg} alt="TerraIQ Dashboard" className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[hsl(var(--chart-1))] shadow-[0_0_10px_hsl(var(--chart-1))]" />
                <span className="text-xs font-mono bg-background/80 backdrop-blur px-2 py-1 rounded border border-border">SYSTEM.ACTIVE</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product 02: AgriNexus Law */}
      <section id="agrinexus" className="py-32 relative z-10 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="order-2 lg:order-1 relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-card shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[hsl(var(--chart-2))]/20 to-transparent mix-blend-overlay z-10" />
              <img src={agriNexusImg} alt="AgriNexus Law" className="w-full h-full object-cover" />
              <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 bg-background/90 backdrop-blur px-3 py-2 rounded-lg border border-border">
                <Scale className="w-4 h-4 text-[hsl(var(--chart-2))]" />
                <span className="text-xs font-mono">COMPLIANCE: 100%</span>
              </div>
            </motion.div>

            <motion.div 
              className="order-1 lg:order-2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="font-mono text-sm tracking-widest text-[hsl(var(--chart-2))] border border-[hsl(var(--chart-2))]/30 px-2 py-1 rounded bg-[hsl(var(--chart-2))]/10">02</span>
                <span className="font-mono tracking-widest uppercase text-muted-foreground text-sm">Legal Infrastructure</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6">AgriNexus Law</h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed font-sans">
                The shield and the sword. Manage complex agricultural contracts, automate regulatory compliance, and execute AI-powered legal research in seconds, not weeks.
              </p>
              <ul className="space-y-4 mb-10 font-mono text-sm">
                <li className="flex items-start gap-3">
                  <Activity className="w-5 h-5 text-[hsl(var(--chart-2))] shrink-0" />
                  <span className="text-muted-foreground">Automated contract generation and review</span>
                </li>
                <li className="flex items-start gap-3">
                  <Activity className="w-5 h-5 text-[hsl(var(--chart-2))] shrink-0" />
                  <span className="text-muted-foreground">Multi-jurisdictional compliance tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <Activity className="w-5 h-5 text-[hsl(var(--chart-2))] shrink-0" />
                  <span className="text-muted-foreground">AI-assisted legal precedent analysis</span>
                </li>
              </ul>
              <Button asChild variant="outline" className="font-mono text-xs uppercase tracking-widest border-[hsl(var(--chart-2))]/50 text-[hsl(var(--chart-2))] hover:bg-[hsl(var(--chart-2))]/10">
                <a href="https://agrinexuslaw.com" target="_blank" rel="noopener noreferrer">Access AgriNexus <ArrowUpRight className="w-3 h-3 ml-2" /></a>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product 03: FieldLot */}
      <section id="fieldlot" className="py-32 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="font-mono text-sm tracking-widest text-[hsl(var(--chart-3))] border border-[hsl(var(--chart-3))]/30 px-2 py-1 rounded bg-[hsl(var(--chart-3))]/10">03</span>
                <span className="font-mono tracking-widest uppercase text-muted-foreground text-sm">Commerce Layer</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6">FieldLot</h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed font-sans">
                The global marketplace. FieldLot connects buyers, sellers, and logistics providers in real-time. Execute trades, run bidding wars, and trace supply chains globally.
              </p>
              <ul className="space-y-4 mb-10 font-mono text-sm">
                <li className="flex items-start gap-3">
                  <Activity className="w-5 h-5 text-[hsl(var(--chart-3))] shrink-0" />
                  <span className="text-muted-foreground">Live bid/ask matching engine</span>
                </li>
                <li className="flex items-start gap-3">
                  <Activity className="w-5 h-5 text-[hsl(var(--chart-3))] shrink-0" />
                  <span className="text-muted-foreground">End-to-end supply chain visibility</span>
                </li>
                <li className="flex items-start gap-3">
                  <Activity className="w-5 h-5 text-[hsl(var(--chart-3))] shrink-0" />
                  <span className="text-muted-foreground">Integrated secure payment & escrow</span>
                </li>
              </ul>
              <Button asChild variant="outline" className="font-mono text-xs uppercase tracking-widest border-[hsl(var(--chart-3))]/50 text-[hsl(var(--chart-3))] hover:bg-[hsl(var(--chart-3))]/10">
                <a href="https://fieldlot.io" target="_blank" rel="noopener noreferrer">Access FieldLot <ArrowUpRight className="w-3 h-3 ml-2" /></a>
              </Button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-card shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[hsl(var(--chart-3))]/20 to-transparent mix-blend-overlay z-10" />
              <img src={fieldLotImg} alt="FieldLot Trading" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay z-10" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-32 h-32 rounded-full border-2 border-[hsl(var(--chart-3))]/30 flex items-center justify-center animate-[spin_10s_linear_infinite]">
                <div className="w-24 h-24 rounded-full border border-[hsl(var(--chart-3))]/50 flex items-center justify-center animate-[spin_15s_linear_infinite_reverse]">
                   <Network className="w-8 h-8 text-[hsl(var(--chart-3))] animate-none" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product 04: AuditNexus */}
      <section id="auditnexus" className="py-32 relative z-10 bg-card/30 border-b border-border/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="order-2 lg:order-1 relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-card shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[hsl(var(--chart-4))]/20 to-transparent mix-blend-overlay z-10" />
              <img src={auditNexusImg} alt="AuditNexus Growth" className="w-full h-full object-cover" />
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-transparent to-background/90 z-10 flex items-end p-6">
                <div className="w-full">
                  <div className="flex justify-between text-xs font-mono mb-2 text-muted-foreground">
                    <span>INDEXING</span>
                    <span className="text-[hsl(var(--chart-4))]">99.8%</span>
                  </div>
                  <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-[hsl(var(--chart-4))] w-[99.8%]" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="order-1 lg:order-2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="font-mono text-sm tracking-widest text-[hsl(var(--chart-4))] border border-[hsl(var(--chart-4))]/30 px-2 py-1 rounded bg-[hsl(var(--chart-4))]/10">04</span>
                <span className="font-mono tracking-widest uppercase text-muted-foreground text-sm">Growth Engine</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6">AuditNexus</h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed font-sans">
                Weaponized digital auditing. Analyze your digital presence across SEO, GEO, and AEO. Generate instant proposals, identify structural vulnerabilities, and drive high-intent leads.
              </p>
              <ul className="space-y-4 mb-10 font-mono text-sm">
                <li className="flex items-start gap-3">
                  <Activity className="w-5 h-5 text-[hsl(var(--chart-4))] shrink-0" />
                  <span className="text-muted-foreground">Deep technical SEO/AEO/GEO auditing</span>
                </li>
                <li className="flex items-start gap-3">
                  <Activity className="w-5 h-5 text-[hsl(var(--chart-4))] shrink-0" />
                  <span className="text-muted-foreground">Automated proposal generation engine</span>
                </li>
                <li className="flex items-start gap-3">
                  <Activity className="w-5 h-5 text-[hsl(var(--chart-4))] shrink-0" />
                  <span className="text-muted-foreground">Predictive lead scoring</span>
                </li>
              </ul>
              <Button asChild variant="outline" className="font-mono text-xs uppercase tracking-widest border-[hsl(var(--chart-4))]/50 text-[hsl(var(--chart-4))] hover:bg-[hsl(var(--chart-4))]/10">
                <a href="/audit-nexus/">Access AuditNexus <ArrowUpRight className="w-3 h-3 ml-2" /></a>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Architecture / How it connects */}
      <section className="py-32 relative z-10 overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">THE SYNAPSE NETWORK</h2>
            <p className="text-muted-foreground font-mono">
              The true power of NEXUS isn't in individual tools—it's in the cross-communication. A contract generated in AgriNexus updates inventory in FieldLot, tracked by TerraIQ, optimized by AuditNexus.
            </p>
          </motion.div>

          <div className="relative max-w-5xl mx-auto">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-border hidden md:block" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-[1px] bg-border hidden md:block" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-32 relative z-10">
              {/* Top Left */}
              <motion.div 
                initial={{ opacity: 0, x: -20, y: -20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                className="bg-background border border-border p-6 rounded-xl flex items-center gap-4 relative"
              >
                <div className="w-12 h-12 rounded bg-[hsl(var(--chart-1))]/10 flex items-center justify-center shrink-0 border border-[hsl(var(--chart-1))]/30">
                  <Cpu className="w-6 h-6 text-[hsl(var(--chart-1))]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-lg">TerraIQ</h4>
                  <p className="text-xs font-mono text-muted-foreground">Data processing & delegation</p>
                </div>
              </motion.div>
              
              {/* Top Right */}
              <motion.div 
                initial={{ opacity: 0, x: 20, y: -20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                className="bg-background border border-border p-6 rounded-xl flex items-center gap-4 relative"
              >
                <div className="w-12 h-12 rounded bg-[hsl(var(--chart-2))]/10 flex items-center justify-center shrink-0 border border-[hsl(var(--chart-2))]/30">
                  <Scale className="w-6 h-6 text-[hsl(var(--chart-2))]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-lg">AgriNexus Law</h4>
                  <p className="text-xs font-mono text-muted-foreground">Compliance guardrails</p>
                </div>
              </motion.div>

              {/* Bottom Left */}
              <motion.div 
                initial={{ opacity: 0, x: -20, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                className="bg-background border border-border p-6 rounded-xl flex items-center gap-4 relative"
              >
                <div className="w-12 h-12 rounded bg-[hsl(var(--chart-3))]/10 flex items-center justify-center shrink-0 border border-[hsl(var(--chart-3))]/30">
                  <Truck className="w-6 h-6 text-[hsl(var(--chart-3))]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-lg">FieldLot</h4>
                  <p className="text-xs font-mono text-muted-foreground">Execution & physical routing</p>
                </div>
              </motion.div>

              {/* Bottom Right */}
              <motion.div 
                initial={{ opacity: 0, x: 20, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                className="bg-background border border-border p-6 rounded-xl flex items-center gap-4 relative"
              >
                <div className="w-12 h-12 rounded bg-[hsl(var(--chart-4))]/10 flex items-center justify-center shrink-0 border border-[hsl(var(--chart-4))]/30">
                  <Target className="w-6 h-6 text-[hsl(var(--chart-4))]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-lg">AuditNexus</h4>
                  <p className="text-xs font-mono text-muted-foreground">Market feedback loop</p>
                </div>
              </motion.div>
            </div>
            
            {/* Center Node */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-24 h-24 rounded-full bg-card border-2 border-primary/50 shadow-[0_0_40px_hsl(var(--primary))] flex items-center justify-center hidden md:flex">
              <Zap className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative z-10 border-t border-border">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto bg-card border border-border p-8 md:p-16 rounded-2xl text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
            
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">INITIATE SEQUENCE</h2>
            <p className="text-muted-foreground font-mono mb-10 max-w-2xl mx-auto">
              Ready to deploy the NEXUS ecosystem in your enterprise? Request highly classified access and connect with an architecture specialist.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="h-14 px-8 font-mono text-sm tracking-widest uppercase bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto shadow-[0_0_20px_-5px_hsl(var(--primary))]">
                <a href="/audit-nexus/">Request Clearance <ArrowUpRight className="w-4 h-4 ml-2" /></a>
              </Button>
              <Button size="lg" variant="outline" onClick={() => document.getElementById('terraiq')?.scrollIntoView({ behavior: 'smooth' })} className="h-14 px-8 font-mono text-sm tracking-widest uppercase border-border hover:bg-background w-full sm:w-auto">
                View Products
              </Button>
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-4 text-xs font-mono text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-primary" /> SOC2 Compliant
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-primary" /> End-to-End Encryption
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
