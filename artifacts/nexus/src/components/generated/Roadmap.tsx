import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, LayoutGrid, MessageSquare, Zap, CreditCard, Server } from 'lucide-react';
import { cn } from '@/lib/utils';
interface RoadmapItem {
  label: string;
  isCompleted?: boolean;
  progress?: number;
}
interface PhaseData {
  id: string;
  number: string;
  status: 'LIVE' | 'IN PROGRESS' | 'COMING SOON' | 'PLANNED';
  title: string;
  items: RoadmapItem[];
  quarter: string;
  color: string;
  dotColor: string;
  icon: React.ReactNode;
}
const PHASES: PhaseData[] = [{
  id: 'p1',
  number: '01',
  status: 'LIVE',
  title: 'CORE LAUNCH',
  quarter: 'Q1 2025',
  color: '#10b981',
  dotColor: '#10b981',
  icon: <LayoutGrid className="w-5 h-5 text-emerald-500" />,
  items: [{
    label: 'TerraIQ v1.0',
    isCompleted: true
  }, {
    label: 'AgriNexus Law v1.0',
    isCompleted: true
  }, {
    label: 'FieldLot v1.0',
    isCompleted: true
  }, {
    label: 'AuditNexus v1.0',
    isCompleted: true
  }, {
    label: 'Nexus Core API',
    isCompleted: true
  }, {
    label: 'Executive Dashboard',
    isCompleted: true
  }]
}, {
  id: 'p2',
  number: '02',
  status: 'IN PROGRESS',
  title: 'INTELLIGENCE EXPANSION',
  quarter: 'Q3 2025',
  color: '#00e5ff',
  dotColor: '#00e5ff',
  icon: <Zap className="w-5 h-5 text-cyan-400" />,
  items: [{
    label: 'AI Decision Engine v2',
    progress: 65
  }, {
    label: 'Multi-language (BG/EN/DE)',
    progress: 40
  }, {
    label: 'Mobile Executive App',
    progress: 80
  }, {
    label: 'Advanced Audit Scoring',
    progress: 25
  }, {
    label: 'API Partner Access',
    progress: 10
  }]
}, {
  id: 'p3',
  number: '03',
  status: 'COMING SOON',
  title: 'APP 05 — NEXUSPAY',
  quarter: 'Q1 2026',
  color: '#a855f7',
  dotColor: '#a855f7',
  icon: <CreditCard className="w-5 h-5 text-purple-500" />,
  items: [{
    label: 'Integrated payment rails'
  }, {
    label: 'Escrow automation'
  }, {
    label: 'Cross-border compliance'
  }, {
    label: 'Crypto settlement layer'
  }]
}, {
  id: 'p4',
  number: '04',
  status: 'PLANNED',
  title: 'SOVEREIGN INFRASTRUCTURE',
  quarter: 'Q3 2026',
  color: '#64748b',
  dotColor: '#64748b',
  icon: <Server className="w-5 h-5 text-slate-400" />,
  items: [{
    label: 'White-label licensing'
  }, {
    label: 'On-premise deployment'
  }, {
    label: 'Custom AI model training'
  }, {
    label: 'Institutional data feeds'
  }]
}];
const STATUS_CONFIG = {
  LIVE: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    pulse: false
  },
  'IN PROGRESS': {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    pulse: true
  },
  'COMING SOON': {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    pulse: false
  },
  PLANNED: {
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/20',
    text: 'text-slate-500',
    pulse: false
  }
};
const METRICS = [{
  label: 'Nodes Online',
  value: '4,281'
}, {
  label: 'Core Uptime',
  value: '99.998%'
}, {
  label: 'Build Speed',
  value: '2.4ms'
}, {
  label: 'Security Grade',
  value: 'L-7 AA+'
}];
const StatusBadge = ({
  status
}: {
  status: PhaseData['status'];
}) => {
  const cfg = STATUS_CONFIG[status];
  return <div className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase border', cfg.bg, cfg.border, cfg.text)}>
      
      {cfg.pulse && <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400" />
        </span>}
      {status}
    </div>;
};
const RoadmapCard = ({
  phase,
  index
}: {
  phase: PhaseData;
  index: number;
}) => {
  const isInProgress = phase.status === 'IN PROGRESS';
  const isComingSoon = phase.status === 'COMING SOON';
  return <motion.article initial={{
    opacity: 0,
    y: 24
  }} whileInView={{
    opacity: 1,
    y: 0
  }} viewport={{
    once: true
  }} transition={{
    delay: index * 0.1,
    duration: 0.4
  }} className="relative flex flex-col group h-full">
      
      {/* Timeline connector dot */}
      <div className="hidden lg:flex absolute -top-[29px] left-1/2 -translate-x-1/2 z-20 items-center justify-center">
        <div className="w-3.5 h-3.5 rounded-full border-[3px] border-[#0a0c10] ring-1 ring-white/10 transition-transform duration-200 group-hover:scale-125" style={{
        backgroundColor: phase.dotColor
      }} />
        
      </div>

      <div className="flex flex-col h-full bg-white/[0.025] border border-white/[0.07] rounded-xl p-6 transition-all duration-200 ease-out hover:bg-white/[0.045] hover:border-white/[0.12] hover:shadow-[0_0_24px_rgba(255,255,255,0.03)]">
        {/* Top row: icon + quarter */}
        <div className="flex items-center justify-between mb-5">
          <div className="p-2.5 bg-white/[0.04] rounded-lg border border-white/[0.06]">
            {phase.icon}
          </div>
          <span className="font-mono text-[11px] text-white/35 tracking-wider">{phase.quarter}</span>
        </div>

        {/* Status badge */}
        <div className="mb-4">
          <StatusBadge status={phase.status} />
        </div>

        {/* Title */}
        <h3 className="text-[17px] font-bold text-white/90 mb-5 tracking-tight leading-tight group-hover:text-white transition-colors duration-200">
          {phase.title}
        </h3>

        {/* Items */}
        <ul className="space-y-3.5 flex-grow">
          {phase.items.map(item => <li key={`${phase.id}-${item.label}`} className="flex items-start gap-2.5">
              {item.isCompleted ? <CheckCircle2 className="w-[15px] h-[15px] text-emerald-500 mt-0.5 shrink-0" /> : isComingSoon ? <Clock className="w-[15px] h-[15px] text-purple-500/50 mt-0.5 shrink-0" /> : isInProgress ? <div className="w-[15px] h-[15px] rounded-full border border-cyan-500/40 flex items-center justify-center mt-0.5 shrink-0 bg-cyan-500/5">
                  <div className="h-[5px] rounded-full bg-cyan-400/70" style={{
              width: `${Math.min(item.progress ?? 0, 100)}%`
            }} />
              
                </div> : <Circle className="w-[15px] h-[15px] text-slate-600 mt-0.5 shrink-0" />}

              <div className="flex flex-col w-full min-w-0">
                <span className={cn('text-[13px] font-mono leading-snug', item.isCompleted ? 'text-white/75' : 'text-white/38')}>
                
                  {item.label}
                </span>

                {isInProgress && item.progress !== undefined && <div className="w-full bg-white/[0.06] h-px mt-2 rounded-full overflow-hidden">
                    <motion.div initial={{
                width: 0
              }} whileInView={{
                width: `${item.progress}%`
              }} viewport={{
                once: true
              }} transition={{
                duration: 0.9,
                ease: 'easeOut',
                delay: 0.4 + phase.items.indexOf(item) * 0.08
              }} className="h-full bg-cyan-500/60 rounded-full" />
                
                  </div>}
              </div>
            </li>)}
        </ul>
      </div>
    </motion.article>;
};
export const Roadmap: React.FC = () => {
  return <section className="relative w-full bg-[#0a0c10] py-24 px-6 overflow-hidden selection:bg-cyan-500/30">
      {/* Background ambience */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/[0.04] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/[0.04] rounded-full blur-[140px] pointer-events-none" />

      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ── Header ── */}
        <div className="text-center mb-20">
          <motion.div initial={{
          opacity: 0,
          y: -16
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.05] border border-white/[0.09] rounded-full mb-7">
            
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[10px] font-mono tracking-widest text-white/55 uppercase">System Status: Active</span>
          </motion.div>

          <motion.h2 initial={{
          opacity: 0,
          y: 10
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: 0.05
        }} className="text-5xl md:text-7xl font-bold text-white mb-5 tracking-tighter leading-none">
            
            THE ROADMAP
          </motion.h2>

          <motion.p initial={{
          opacity: 0,
          y: 10
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: 0.1
        }} className="text-white/38 font-mono text-[13px] tracking-widest max-w-md mx-auto">
            
            WHERE WE ARE. WHERE WE ARE GOING. BUILT IN PUBLIC.
          </motion.p>
        </div>

        {/* ── Timeline ── */}
        <div className="relative">
          {/* Horizontal line — desktop only, sits 24px above card grid */}
          <div className="hidden lg:block absolute top-[-24px] left-0 right-0 h-px z-0 overflow-hidden">
            <div className="absolute inset-0" style={{
            background: 'linear-gradient(to right, #10b98155 0%, #10b98155 12%, #00e5ff55 37%, #a855f755 63%, #64748b33 88%, transparent 100%)'
          }} />
            
            {/* Animated glow pulse */}
            <motion.div className="absolute top-0 h-full w-40" style={{
            background: 'linear-gradient(to right, transparent, rgba(0,229,255,0.5), transparent)',
            filter: 'blur(2px)'
          }} animate={{
            left: ['-10%', '110%']
          }} transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'linear',
            repeatDelay: 1
          }} />
            
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PHASES.map((phase, idx) => <RoadmapCard key={phase.id} phase={phase} index={idx} />)}
          </div>
        </div>

        {/* ── CTA ── */}
        <motion.div initial={{
        opacity: 0,
        y: 16
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        delay: 0.4
      }} className="mt-28 text-center">
          
          <a href="mailto:contact@nexuseco.io?subject=NexusECO%20Feature%20Suggestion" className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-lg border border-white/10 bg-white/[0.03] text-white transition-all duration-200 hover:bg-cyan-500/[0.07] hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(0,229,255,0.08)]">
            <span className="font-bold tracking-widest text-[11px] uppercase">Suggest a Feature</span>
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400 transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>
          <p className="mt-5 text-white/25 text-[11px] font-mono tracking-widest uppercase">
            We build with our clients. Share what you need.
          </p>
        </motion.div>

        {/* ── Bottom metrics ── */}
        <div className="mt-24 pt-7 border-t border-white/[0.06] grid grid-cols-2 md:grid-cols-4 gap-6">
          {METRICS.map(m => <div key={m.label} className="flex flex-col gap-1">
              <span className="text-white/20 text-[10px] font-mono tracking-widest uppercase">{m.label}</span>
              <span className="text-[20px] font-bold text-white leading-none">{m.value}</span>
            </div>)}
        </div>
      </div>
    </section>;
};
