import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ArrowRight, Lock, Zap, Languages, Menu, X } from 'lucide-react';

// --- Types ---

interface NavItem {
  id: string;
  label: string;
  href: string;
}
interface StatItem {
  label: string;
  value: string;
}
interface BadgeItem {
  icon: React.ReactNode;
  text: string;
}

// --- Constants & Mock Data ---

const NAV_LINKS: NavItem[] = [{
  id: '01',
  label: 'TerraIQ',
  href: '#apps'
}, {
  id: '02',
  label: 'AgriNexus',
  href: '#apps'
}, {
  id: '03',
  label: 'FieldLot',
  href: '#apps'
}, {
  id: '04',
  label: 'AuditNexus',
  href: '#apps'
}];
const STATS: StatItem[] = [{
  label: 'ACTIVE FUNCTIONS',
  value: '92'
}, {
  label: 'LIVE MARKETS',
  value: '3'
}, {
  label: 'AUDITS TODAY',
  value: '127'
}, {
  label: 'UPTIME',
  value: '99.9%'
}];
const TRUST_BADGES: BadgeItem[] = [{
  icon: <Lock className="w-[18px] h-[18px]" />,
  text: 'Enterprise Security'
}, {
  icon: <Zap className="w-[18px] h-[18px]" />,
  text: '<200ms Validation'
}, {
  icon: <Languages className="w-[18px] h-[18px]" />,
  text: 'BG/EN Support'
}];

// --- Sub-components ---

const BackgroundPattern = () => <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    {/* Dot grid — very subtle, 6% opacity */}
    <div className="absolute inset-0" style={{
    opacity: 0.06,
    backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
    backgroundSize: '40px 40px'
  }} />
  

    {/* Circuit-like animated paths */}
    <svg className="absolute inset-0 w-full h-full" style={{
    opacity: 0.055
  }} xmlns="http://www.w3.org/2000/svg">
    
      <motion.path d="M -100 100 L 200 100 L 250 150 L 500 150 M 800 50 L 900 150 L 1200 150" fill="none" stroke="#00e5ff" strokeWidth="1" initial={{
      pathLength: 0
    }} animate={{
      pathLength: 1
    }} transition={{
      duration: 10,
      repeat: Infinity,
      ease: 'linear'
    }} />
    
      <motion.path d="M 1500 300 L 1400 400 L 1000 400 L 950 450" fill="none" stroke="#a855f7" strokeWidth="1" initial={{
      pathLength: 0
    }} animate={{
      pathLength: 1
    }} transition={{
      duration: 12,
      repeat: Infinity,
      ease: 'linear',
      delay: 2
    }} />
    
    </svg>

    {/* Ambient glow blobs */}
    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/[0.07] blur-[120px] rounded-full" />
    <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/[0.07] blur-[150px] rounded-full" />
  </div>;
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return <nav className="relative z-50 w-full border-b border-white/[0.06] bg-[#0a0c10]/80 backdrop-blur-md">
      <div className="container mx-auto px-6 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center rounded">
            <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 text-cyan-400 fill-current">
              <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" />
            </svg>
          </div>
          <span className="text-[18px] font-black tracking-[-0.03em] text-white leading-none">
            NEXUS<span className="text-gray-400 font-light">ECO</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map(link => <a key={link.id} href={link.href} className="flex items-center gap-1.5 text-[11px] font-mono text-gray-500 hover:text-white transition-colors duration-150 group" style={{
          transitionProperty: 'color'
        }}>
            
              <span className="text-cyan-500/40 group-hover:text-cyan-400 transition-colors duration-150">
                {link.id}.
              </span>
              {link.label}
            </a>)}
        </div>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-5">
            <button className="flex items-center gap-1.5 text-gray-500 hover:text-white transition-colors duration-150">
              <Globe className="w-4 h-4" />
              <span className="text-[11px] font-mono">BG</span>
            </button>
            <a href="/hub" className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors duration-150">
              HUB
            </a>
            <a href="/hub" className="text-[11px] font-bold tracking-wide text-white/80 hover:text-white transition-colors duration-150">
              SIGN IN
            </a>
          </div>
          <a href="/dashboard" className="h-9 px-5 bg-cyan-500 hover:bg-cyan-600 text-[#0a0c10] text-[11px] font-black font-mono tracking-[0.08em] rounded-[3px] transition-colors duration-150 flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
            <span>EXECUTIVE DASHBOARD</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden text-white p-1" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && <motion.div initial={{
        opacity: 0,
        y: -10
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: -10
      }} transition={{
        duration: 0.15
      }} className="absolute top-full left-0 w-full bg-[#0a0c10] border-b border-white/[0.06] p-6 lg:hidden flex flex-col gap-5">
          
            {NAV_LINKS.map(link => <a key={link.id} href={link.href} className="text-[13px] font-mono text-gray-400 hover:text-white transition-colors duration-150">
            
                <span className="text-cyan-500 mr-2">{link.id}.</span>
                {link.label}
              </a>)}
            <div className="pt-5 border-t border-white/[0.06] flex flex-col gap-4">
              <a href="/hub" className="text-[13px] font-mono text-cyan-400 text-left">HUB</a>
              <a href="/hub" className="text-[13px] font-bold text-white text-left">SIGN IN</a>
              <a href="/dashboard" className="w-full h-11 bg-cyan-500 hover:bg-cyan-600 text-[#0a0c10] text-[11px] font-black font-mono tracking-[0.08em] rounded-[3px] flex items-center justify-center gap-2 transition-colors duration-150">
                <span>EXECUTIVE DASHBOARD</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>}
      </AnimatePresence>
    </nav>;
};
const StatusBadge = () => <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/[0.04] border border-white/[0.09] rounded-full">
    <span className="relative flex items-center justify-center w-2 h-2">
      <span className="absolute inline-flex w-full h-full rounded-full bg-green-500 opacity-60 animate-ping" style={{
      animationDuration: '2.4s'
    }} />
      <span className="relative inline-flex rounded-full w-2 h-2 bg-green-400" />
    </span>
    <span className="text-[10px] font-mono font-bold tracking-[0.12em] text-white/75 uppercase">
      Core Systems Online
    </span>
  </div>;
const MetricsBar = () => <div className="flex flex-wrap items-center justify-center gap-x-0 gap-y-2 mt-5">
    {STATS.map((stat, idx) => <div key={stat.label} className="flex items-center">
        <div className="flex items-center gap-2 px-4">
          <span className="text-[13px] font-mono font-bold text-cyan-400 tabular-nums">
            {stat.value}
          </span>
          <span className="text-[10px] font-mono text-gray-500 tracking-[0.06em]">
            {stat.label}
          </span>
        </div>
        {idx < STATS.length - 1 && <span className="text-gray-700 text-xs hidden sm:block select-none">|</span>}
      </div>)}
  </div>;

// --- Main Component ---

export const NexusHero: React.FC = () => {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);
  return <div className="relative min-h-screen w-full bg-[#0a0c10] text-white selection:bg-cyan-500/30 selection:text-cyan-200 flex flex-col font-sans">
      <BackgroundPattern />

      <Navbar />

      <main className="flex-grow flex flex-col items-center justify-center relative z-10 px-6 pt-20 pb-24 text-center">
        <motion.div initial={{
        opacity: 0,
        y: 24
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.75,
        ease: [0.25, 0.46, 0.45, 0.94]
      }} className="flex flex-col items-center w-full max-w-5xl">
          
          {/* Status Badge */}
          <StatusBadge />

          {/* Metrics Bar */}
          <MetricsBar />

          {/* Title */}
          <div className="mt-14 space-y-1">
            <h1 className="text-[52px] sm:text-[68px] md:text-[80px] lg:text-[96px] font-black leading-[0.93] uppercase text-white" style={{
            letterSpacing: '-0.03em'
          }}>
              
              Enterprise
            </h1>
            <h1 className="text-[52px] sm:text-[68px] md:text-[80px] lg:text-[96px] font-black leading-[0.93] uppercase text-white" style={{
            letterSpacing: '-0.03em'
          }}>
              
              Intelligence
            </h1>
            <h1 className="text-[52px] sm:text-[68px] md:text-[80px] lg:text-[96px] font-black leading-[0.93] uppercase" style={{
            letterSpacing: '-0.03em',
            background: 'linear-gradient(90deg, #22d3ee 0%, #a78bfa 50%, #c084fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent',
            // Force GPU layer to prevent banding
            transform: 'translateZ(0)'
          }}>
              
              Operating System.
            </h1>
          </div>

          {/* Subtitle */}
          <p className="mt-8 text-gray-400 font-mono text-[14px] sm:text-[15px] mx-auto" style={{
          maxWidth: '65ch',
          lineHeight: '1.7'
        }}>
            
            A unified core powering independent applications. One central intelligence engine
            orchestrating operations, legal compliance, and market execution.
          </p>

          {/* Dual CTA */}
          <div className="mt-12 flex flex-col items-center gap-5">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <a href="/dashboard" className="group w-full sm:w-auto h-12 px-8 bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 text-[#0a0c10] text-[12px] font-black font-mono tracking-[0.1em] rounded-[3px] flex items-center justify-center gap-3 shadow-[0_0_28px_rgba(6,182,212,0.2)] transition-colors duration-150">
                
                <span>EXECUTIVE DASHBOARD</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
              </a>

              <a href="#pricing" className="w-full sm:w-auto h-12 px-8 bg-transparent hover:bg-white text-white hover:text-[#0a0c10] border border-white/20 hover:border-white text-[12px] font-bold font-mono tracking-[0.1em] rounded-[3px] flex items-center justify-center transition-all duration-150">
                
                REQUEST DEMO
              </a>
            </div>

            <span className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.15em]">
              No commitment. 30-min live walkthrough with our team.
            </span>
          </div>

          {/* Trust Badges */}
          <div className="mt-20 pt-10 border-t border-white/[0.06] w-full flex flex-wrap justify-center gap-x-10 gap-y-5">
            {TRUST_BADGES.map(badge => <div key={badge.text} className="flex items-center gap-2.5 text-gray-400 hover:text-white transition-colors duration-150 cursor-default group">
              
                <div className="w-8 h-8 flex items-center justify-center rounded-[3px] bg-white/[0.04] border border-white/[0.08] group-hover:border-cyan-500/40 transition-colors duration-150 shrink-0">
                  {badge.icon}
                </div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-[0.1em]">
                  {badge.text}
                </span>
              </div>)}
          </div>
        </motion.div>
      </main>

      {/* Side decorations */}
      <div className="absolute left-6 bottom-8 hidden md:flex flex-col items-center gap-3 opacity-25 z-20">
        <div className="w-px h-12 bg-gradient-to-b from-cyan-500 to-transparent" />
        <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/60" style={{
        writingMode: 'vertical-rl',
        transform: 'rotate(180deg)'
      }}>
          
          System.v4.0.2
        </span>
      </div>

      <div className="absolute right-6 bottom-8 hidden md:flex flex-col items-center gap-3 opacity-25 z-20">
        <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/60" style={{
        writingMode: 'vertical-rl'
      }}>
          
          Nexus.Active
        </span>
        <div className="w-px h-12 bg-gradient-to-t from-purple-500 to-transparent" />
      </div>
    </div>;
};
