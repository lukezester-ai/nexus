import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, Zap, Shield, Globe, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';
interface PricingTier {
  tierLabel: string;
  name: string;
  price: {
    monthly: string;
    annual: string;
  };
  subtitle: string;
  features: string[];
  cta: string;
  featured?: boolean;
  accentColor: 'cyan' | 'purple' | 'white';
}
const pricingData: PricingTier[] = [{
  tierLabel: 'TIER 01',
  name: 'CORE',
  price: {
    monthly: '€299',
    annual: '€239'
  },
  subtitle: 'For growing operations',
  features: ['Access to 1 Application', 'Nexus Core: Data Cloud', 'Decision Engine (Basic)', '10 Users', 'Email Support'],
  cta: 'GET STARTED',
  accentColor: 'white'
}, {
  tierLabel: 'TIER 02',
  name: 'ENTERPRISE',
  price: {
    monthly: '€899',
    annual: '€719'
  },
  subtitle: 'Full platform access',
  features: ['Access to ALL 4 Applications', 'Full Nexus Core Suite', 'Decision + Audit + Strategy Engine', 'Unlimited Users', 'Priority Support', 'Executive Dashboard', 'Custom Integrations'],
  cta: 'LAUNCH NEXUS',
  featured: true,
  accentColor: 'cyan'
}, {
  tierLabel: 'TIER 03',
  name: 'SOVEREIGN',
  price: {
    monthly: 'CUSTOM',
    annual: 'CUSTOM'
  },
  subtitle: 'For institutional clients',
  features: ['White-label Deployment', 'Dedicated Infrastructure', 'Custom AI Model Training', 'SLA Guarantee', 'Dedicated Account Manager', 'On-premise Option'],
  cta: 'CONTACT SALES',
  accentColor: 'purple'
}];
const trustItems = [{
  icon: <Zap size={12} />,
  label: '99.9% uptime SLA'
}, {
  icon: <Shield size={12} />,
  label: 'End-to-end encryption'
}, {
  icon: <Globe size={12} />,
  label: 'GDPR compliant'
}, {
  icon: <Cpu size={12} />,
  label: 'BG/EN support'
}];
export const NexusPricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  return <div className="min-h-screen bg-[#080b12] text-white selection:bg-cyan-500/30 selection:text-cyan-200 py-24 px-6 relative overflow-hidden">

      {/* Background ambient glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-cyan-500/4 to-transparent pointer-events-none" />
      <div className="absolute top-[15%] right-[-8%] w-[450px] h-[450px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[8%] left-[-4%] w-[350px] h-[350px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-16 relative z-10">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        ease: 'easeOut'
      }}>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 uppercase leading-none">
            Choose Your Plan
          </h1>
          <p className="text-[#8b929e] font-mono text-base tracking-wide max-w-xl mx-auto mb-12">
            Scalable intelligence. One core. Unlimited potential.
          </p>
        </motion.div>

        {/* Toggle */}
        <div className="inline-flex items-center gap-5 bg-[#0f1520] border border-[#1e2638] rounded-full px-5 py-3">
          <span className={cn('text-xs font-mono font-semibold tracking-[0.2em] uppercase transition-colors duration-150', !isAnnual ? 'text-white' : 'text-[#4a5568]')}>
            
            Monthly
          </span>

          <button onClick={() => setIsAnnual(!isAnnual)} className="w-12 h-6 rounded-full bg-[#1a2235] border border-[#2a3348] relative flex items-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080b12]" aria-label="Toggle annual or monthly billing" role="switch" aria-checked={isAnnual}>
            
            <motion.div className="w-5 h-5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)] absolute left-0.5" animate={{
            x: isAnnual ? 24 : 0
          }} transition={{
            type: 'spring',
            stiffness: 600,
            damping: 35
          }} />
            
          </button>

          <div className="flex items-center gap-2.5">
            <span className={cn('text-xs font-mono font-semibold tracking-[0.2em] uppercase transition-colors duration-150', isAnnual ? 'text-white' : 'text-[#4a5568]')}>
              
              Annual
            </span>
            <span className="bg-cyan-500/10 text-cyan-400 text-[10px] px-2 py-0.5 rounded-full border border-cyan-500/20 font-bold font-mono tracking-wider">
              −20%
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 items-stretch">
        {pricingData.map((tier, idx) => <motion.div key={tier.name} initial={{
        opacity: 0,
        y: 28
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.55,
        delay: idx * 0.08,
        ease: 'easeOut'
      }} className={cn('relative flex flex-col rounded-2xl bg-[#0c1118] border border-[#1a2235] transition-all duration-300 hover:-translate-y-1.5', tier.featured ? 'shadow-[0_0_0_1px_rgba(34,211,238,0.12),0_0_32px_rgba(34,211,238,0.08),0_8px_40px_rgba(0,0,0,0.4)] border-[#1e3040]' : 'hover:border-[#263045] shadow-[0_4px_24px_rgba(0,0,0,0.3)]')}>
          
            {/* Most Popular Badge */}
            {tier.featured && <div className="absolute -top-px left-1/2 -translate-x-1/2 px-4 py-1 bg-cyan-400 text-[#080b12] text-[10px] font-black font-mono rounded-b-lg uppercase tracking-[0.15em] whitespace-nowrap">
                Most Popular
              </div>}

            <div className="flex flex-col flex-1 p-8 pt-10">
              {/* Tier label + name */}
              <div className="mb-8">
                <span className={cn('text-[10px] font-mono font-bold tracking-[0.35em] uppercase mb-2 block', tier.accentColor === 'cyan' && 'text-cyan-400/70', tier.accentColor === 'purple' && 'text-purple-400/70', tier.accentColor === 'white' && 'text-[#5a6478]')}>
                
                  {tier.tierLabel}
                </span>
                <h2 className="text-2xl font-black tracking-tight uppercase text-white mb-1.5">
                  {tier.name}
                </h2>
                <p className="text-[#5a6478] font-mono text-xs">{tier.subtitle}</p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-1.5">
                  <span className={cn('text-[2.75rem] font-black tracking-tighter leading-none', tier.accentColor === 'cyan' && 'text-cyan-400', tier.accentColor === 'purple' && 'text-purple-400', tier.accentColor === 'white' && 'text-white')}>
                  
                    {tier.price.monthly === 'CUSTOM' ? 'CUSTOM' : isAnnual ? tier.price.annual : tier.price.monthly}
                  </span>
                  {tier.price.monthly !== 'CUSTOM' && <span className="text-[#3d4a5e] font-mono text-sm">/ mo</span>}
                </div>
                <div className="h-5 mt-1">
                  <AnimatePresence mode="wait">
                    {isAnnual && tier.price.monthly !== 'CUSTOM' && <motion.p key="annual-note" initial={{
                  opacity: 0,
                  y: 4
                }} animate={{
                  opacity: 1,
                  y: 0
                }} exit={{
                  opacity: 0,
                  y: -4
                }} transition={{
                  duration: 0.15
                }} className="text-[11px] text-cyan-400/50 font-mono">
                    
                        Billed annually
                      </motion.p>}
                  </AnimatePresence>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-[#1e2a3a] to-transparent mb-8" />

              {/* Features */}
              <ul className="space-y-3.5 flex-1 mb-10">
                {tier.features.map(feature => <li key={feature} className="flex items-start gap-3">
                    <div className={cn('mt-0.5 flex-shrink-0', tier.accentColor === 'purple' ? 'text-purple-400' : 'text-cyan-400')}>
                  
                      <Check size={14} strokeWidth={2.5} />
                    </div>
                    <span className="text-[#8b929e] font-mono text-sm leading-snug">
                      {feature}
                    </span>
                  </li>)}
              </ul>

              {/* CTA */}
              <a href="mailto:contact@nexuseco.io?subject=NexusECO%20Plan" className={cn('w-full py-3.5 px-6 rounded-xl font-black text-xs uppercase tracking-[0.18em] flex items-center justify-center gap-2 transition-all ease-out', 'duration-150', tier.accentColor === 'cyan' ? 'bg-cyan-400 text-[#080b12] hover:bg-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.25)] active:scale-[0.98]' : tier.accentColor === 'purple' ? 'bg-transparent border border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:border-purple-400 active:scale-[0.98]' : 'bg-transparent border border-[#2a3448] text-[#c4cdd8] hover:bg-[#151c2a] hover:border-[#3a4560] hover:text-white active:scale-[0.98]')}>
              
                <span>{tier.cta}</span>
                <ArrowRight size={14} className="transition-transform duration-150 group-hover:translate-x-0.5" />
              </a>
            </div>
          </motion.div>)}
      </div>

      {/* Footer Trust Bar */}
      <div className="max-w-6xl mx-auto mt-20 pt-10 border-t border-[#1a2235] text-center relative z-10">
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
          {trustItems.map(item => <div key={item.label} className="flex items-center gap-2 text-[#3d4a5e]">
              <span className="text-cyan-400/40">{item.icon}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em]">{item.label}</span>
            </div>)}
        </div>
        <p className="mt-10 text-[#283040] font-mono text-[10px] tracking-[0.2em] uppercase">
          © 2024 NexusECO Intelligence Systems. All rights reserved.
        </p>
      </div>

      {/* Subtle scanline overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.025] z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_2px]" />
    </div>;
};
export default NexusPricing;
