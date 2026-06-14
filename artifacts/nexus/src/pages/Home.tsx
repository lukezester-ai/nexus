import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, ArrowUpRight, Cpu, Scale, Truck, Target, Landmark, Database, Zap, Activity, Network, ShieldCheck, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/images/hero.png";
import terraIqImg from "@/assets/images/terraiq.png";
import agriNexusImg from "@/assets/images/agrinexus-law.png";
import fieldLotImg from "@/assets/images/fieldlot.png";
import auditNexusImg from "@/assets/images/auditnexus.png";

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

import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  return (
    <div className="bg-background min-h-screen text-foreground selection:bg-primary/30 selection:text-primary-foreground overflow-x-hidden" ref={containerRef}>
      <Navbar />
      
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20" style={{ 
        backgroundImage: 'radial-gradient(circle at center, hsl(var(--border)) 1px, transparent 1px)',
        backgroundSize: '32px 32px' 
      }} />
      <div className="fixed inset-0 pointer-events-none z-0 mix-blend-overlay opacity-40 bg-noise" />

      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-background/85 z-10" />
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
            className="max-w-5xl mx-auto text-center flex flex-col items-center"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-mono tracking-widest text-primary uppercase">{t('home.core_online')}</span>
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight mb-8 leading-[1.1]">
              {t('home.title_enterprise')} <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[hsl(var(--chart-4))]">{t('home.title_os')}</span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted-foreground font-mono max-w-3xl mx-auto mb-10 leading-relaxed">
              {t('home.subtitle')}
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4">
              <Button size="lg" onClick={() => document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' })} className="h-14 px-8 font-mono text-sm tracking-widest uppercase bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_-5px_hsl(var(--primary))] w-full sm:w-auto">
                {t('home.explore_architecture')} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Core vs Apps Architecture */}
      <section id="architecture" className="py-32 relative z-10 bg-card/50 border-y border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl mx-auto mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">{t('home.nexus_core')}</h2>
            <p className="text-muted-foreground font-mono text-lg">
              {t('home.nexus_core_desc')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24 max-w-6xl mx-auto">
            {[
              { id: "DATA", name: t('home.data_cloud'), desc: t('home.data_cloud_desc'), icon: Database, color: "var(--chart-1)" },
              { id: "LOGIC", name: t('home.decision_engine'), desc: t('home.decision_engine_desc'), icon: Cpu, color: "var(--chart-5)" },
              { id: "TRUST", name: t('home.audit_engine'), desc: t('home.audit_engine_desc'), icon: ShieldCheck, color: "var(--chart-4)" },
              { id: "FINANCE", name: t('home.strategy_engine'), desc: t('home.strategy_engine_desc'), icon: Landmark, color: "var(--chart-2)" }
            ].map((module, i) => (
              <motion.div 
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group relative p-6 bg-background border border-border rounded-xl overflow-hidden hover:border-[hsl(var(--accent-color))]/50 transition-colors"
                style={{ '--accent-color': module.color } as any}
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                  <module.icon className="w-24 h-24" style={{ color: "hsl(var(--accent-color))" }} />
                </div>
                <div className="relative z-10">
                  <span className="text-xs font-mono tracking-widest text-muted-foreground mb-4 block">{module.id} // {t('home.internal_layer')}</span>
                  <h3 className="text-xl font-bold font-serif mb-2 text-foreground">{module.name}</h3>
                  <p className="text-sm text-muted-foreground font-mono leading-relaxed">{module.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <Layers className="w-12 h-12 text-muted-foreground/30 mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">{t('home.applications')}</h2>
            <p className="text-muted-foreground font-mono text-lg">
              {t('home.applications_desc')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
             {[
              { id: "APP 01", name: "TerraIQ", desc: t('home.app_terraiq'), icon: Activity, color: "var(--chart-1)", url: "https://www.terraiq.me" },
              { id: "APP 02", name: "Agrinexus Law", desc: t('home.app_agrinexus'), icon: Scale, color: "var(--chart-2)", url: "https://www.agrinexuslaw.com" },
              { id: "APP 03", name: "FieldLot", desc: t('home.app_fieldlot'), icon: Truck, color: "var(--chart-3)", url: "https://www.fieldlot.io" },
            ].map((module, i) => (
              <motion.div 
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group relative p-8 bg-background border border-border rounded-xl overflow-hidden hover:border-[hsl(var(--accent-color))]/50 transition-colors shadow-lg"
                style={{ '--accent-color': module.color } as any}
              >
                <div className="absolute -top-10 -right-10 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                  <module.icon className="w-40 h-40" style={{ color: "hsl(var(--accent-color))" }} />
                </div>
                <div className="relative z-10">
                  <span className="text-xs font-mono tracking-widest text-muted-foreground mb-4 block">{module.id}</span>
                  <h3 className="text-3xl font-bold font-serif mb-4 group-hover:text-[hsl(var(--accent-color))] transition-colors">{module.name}</h3>
                  <p className="text-sm text-muted-foreground font-mono mb-8 leading-relaxed">{module.desc}</p>
                  <Button asChild variant="outline" className="font-mono text-xs tracking-widest uppercase border-[hsl(var(--accent-color))]/30 hover:bg-[hsl(var(--accent-color))]/10 text-foreground">
                    <a href={module.url} target="_blank" rel="noopener noreferrer">
                      {t('home.access_portal')} <ArrowRight className="w-3 h-3 ml-2" />
                    </a>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Decision Workflow Workflow */}
      <section className="py-32 relative z-10 overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">{t('home.validation_loop')}</h2>
            <p className="text-muted-foreground font-mono">
              {t('home.validation_loop_desc')}
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-sm uppercase tracking-widest max-w-5xl mx-auto">
             <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} className="bg-card border border-border p-6 rounded-lg text-center flex-1 w-full">
                <span className="text-[hsl(var(--chart-1))] block mb-2 font-bold">{t('home.step_1')}</span>
                <span className="text-xs text-muted-foreground">{t('home.step_1_desc')}</span>
             </motion.div>
             <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90 md:rotate-0" />
             <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} transition={{delay: 0.1}} className="bg-card border border-border p-6 rounded-lg text-center flex-1 w-full border-[hsl(var(--chart-5))]/50">
                <span className="text-[hsl(var(--chart-5))] block mb-2 font-bold">{t('home.step_2')}</span>
                <span className="text-xs text-muted-foreground">{t('home.step_2_desc')}</span>
             </motion.div>
             <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90 md:rotate-0" />
             <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} transition={{delay: 0.2}} className="bg-card border border-border p-6 rounded-lg text-center flex-1 w-full border-[hsl(var(--chart-4))]/50 shadow-[0_0_15px_hsl(var(--chart-4))/20]">
                <span className="text-[hsl(var(--chart-4))] block mb-2 font-bold">{t('home.step_3')}</span>
                <span className="text-xs text-muted-foreground">{t('home.step_3_desc')}</span>
             </motion.div>
             <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90 md:rotate-0" />
             <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} transition={{delay: 0.3}} className="bg-card border border-border p-6 rounded-lg text-center flex-1 w-full">
                <span className="text-[hsl(var(--chart-3))] block mb-2 font-bold">{t('home.step_4')}</span>
                <span className="text-xs text-muted-foreground">{t('home.step_4_desc')}</span>
             </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
