import React, { useState, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Terminal, Brain, Shield, Zap, ArrowRight, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Types & Constants
 */

interface Step {
  id: number;
  label: string;
  title: string;
  shortDescription: string;
  expandedDescription: string;
  color: string;
  shadowColor: string;
  icon: React.ElementType;
}
const STEPS: Step[] = [{
  id: 1,
  label: '1. APP',
  title: 'CLIENT REQUEST',
  shortDescription: 'TerraIQ requests action',
  expandedDescription: 'The client application (TerraIQ, FieldLot, etc.) initiates a request — trade, document, or analysis — through the secure Nexus API gateway.',
  color: '#00e5ff',
  shadowColor: 'rgba(0, 229, 255, 0.35)',
  icon: Terminal
}, {
  id: 2,
  label: '2. CORE',
  title: 'DECISION ENGINE',
  shortDescription: 'AI models analyze action',
  expandedDescription: 'The Nexus Core processes the request using ML decision models, cross-referencing historical data, market signals, and contextual intelligence.',
  color: '#ec4899',
  shadowColor: 'rgba(236, 72, 153, 0.35)',
  icon: Brain
}, {
  id: 3,
  label: '3. AUDIT',
  title: 'TRUST ENGINE',
  shortDescription: 'Trust Engine validates risk',
  expandedDescription: 'The Audit Engine scores the risk level, validates legal compliance, and either approves, flags, or blocks the transaction based on configured thresholds.',
  color: '#a855f7',
  shadowColor: 'rgba(168, 85, 247, 0.35)',
  icon: Shield
}, {
  id: 4,
  label: '4. EXECUTION',
  title: 'RESULT RETURNED',
  shortDescription: 'App receives result',
  expandedDescription: 'The validated result is returned to the client application with full audit trail, decision metadata, and action confirmation — logged immutably.',
  color: '#f59e0b',
  shadowColor: 'rgba(245, 158, 11, 0.35)',
  icon: Zap
}];
const CONNECTOR_PAIRS = [{
  id: 'c1',
  fromStep: 1,
  toStep: 2
}, {
  id: 'c2',
  fromStep: 2,
  toStep: 3
}, {
  id: 'c3',
  fromStep: 3,
  toStep: 4
}];

/**
 * Connector
 */
const Connector = ({
  active
}: {
  active: boolean;
}) => {
  return <div className="hidden lg:flex items-center justify-center w-full px-1 flex-shrink-0" style={{
    width: '60px'
  }}>
      <div className="h-px flex-1 bg-slate-800 relative overflow-hidden">
        {active && <motion.div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full" style={{
        backgroundColor: '#00e5ff',
        boxShadow: '0 0 6px #00e5ff',
        left: 0
      }} initial={{
        x: '-100%'
      }} animate={{
        x: '600%'
      }} transition={{
        duration: 0.5,
        ease: 'easeInOut'
      }} />}
      </div>
      <ArrowRight className="w-4 h-4 ml-1 flex-shrink-0 transition-colors duration-200" style={{
      color: active ? '#00e5ff' : '#1e293b'
    }} />
      
    </div>;
};

/**
 * StepCard
 */
const StepCard = ({
  step,
  simulationActive
}: {
  step: Step;
  simulationActive: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isActive = simulationActive || isHovered;
  const Icon = step.icon;
  return <motion.article onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="relative w-full flex flex-col p-6 rounded-xl bg-[#0f1117] cursor-default select-none" style={{
    borderTop: `3px solid ${step.color}`,
    boxShadow: isActive ? `0 8px 32px -8px ${step.shadowColor}, 0 0 0 1px rgba(255,255,255,0.04)` : '0 0 0 1px rgba(255,255,255,0.04)',
    transition: 'box-shadow 200ms ease, transform 200ms ease',
    transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
    willChange: 'transform'
  }}>
      
      {/* Background Icon — centered, fixed opacity */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none rounded-xl overflow-hidden" aria-hidden="true">
        
        <Icon className="w-28 h-28" style={{
        color: step.color,
        opacity: 0.1
      }} />
        
      </div>

      {/* Content */}
      <span className="font-mono text-xs font-bold tracking-widest mb-4 relative" style={{
      color: step.color
    }}>
        
        {step.label}
      </span>

      <h3 className="text-white text-lg font-bold mb-2 tracking-tight relative">
        {step.title}
      </h3>

      <p className="text-slate-400 text-sm font-mono leading-relaxed mb-0 relative flex-1">
        {step.shortDescription}
      </p>

      {/* Expanded description — grid-template-rows transition */}
      <div className="relative overflow-hidden" style={{
      display: 'grid',
      gridTemplateRows: isActive ? '1fr' : '0fr',
      transition: 'grid-template-rows 200ms ease'
    }}>
        
        <div className="overflow-hidden">
          <p className="text-slate-500 text-xs leading-relaxed border-l border-slate-800 pl-3 py-1 mt-3">
            {step.expandedDescription}
          </p>
        </div>
      </div>

      {/* Simulation pulse overlay — opacity only, no layout shift */}
      <AnimatePresence>
        {simulationActive && <motion.div className="absolute inset-0 rounded-xl pointer-events-none" initial={{
        opacity: 0
      }} animate={{
        opacity: [0, 0.12, 0]
      }} exit={{
        opacity: 0
      }} transition={{
        duration: 0.6,
        repeat: Infinity
      }} style={{
        backgroundColor: step.color
      }} />}
      </AnimatePresence>
    </motion.article>;
};

/**
 * Main Section Component
 */
export const ValidationLoopSection = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [btnPressed, setBtnPressed] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };
  const startSimulation = useCallback(() => {
    if (isSimulating) return;
    setIsSimulating(true);
    setActiveStep(null);
    clearAllTimeouts();
    STEPS.forEach((step, index) => {
      const t = setTimeout(() => {
        setActiveStep(step.id);
      }, index * 600);
      timeoutsRef.current.push(t);
    });
    const resetTimeout = setTimeout(() => {
      setActiveStep(null);
      setIsSimulating(false);
    }, STEPS.length * 600 + 800);
    timeoutsRef.current.push(resetTimeout);
  }, [isSimulating]);
  return <section className="min-h-screen bg-[#0a0c10] py-24 px-6 md:px-12 lg:px-24 flex flex-col items-center justify-center font-sans overflow-hidden" style={{
    contain: 'paint'
  }}>
      
      {/* Header */}
      <div className="text-center mb-16 md:mb-20 max-w-3xl">
        <motion.h2 initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.7
      }} className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">
          
          THE VALIDATION LOOP
        </motion.h2>
        <motion.p initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.7,
        delay: 0.1
      }} className="font-mono text-slate-500 text-sm md:text-base tracking-normal uppercase">
          
          How a client application communicates with the internal core to execute a safe transaction.
        </motion.p>
      </div>

      {/* Step Cards Row */}
      <div className="w-full max-w-6xl">
        {/* Desktop layout: equal-width cards + connectors */}
        <div className="hidden lg:flex items-stretch gap-0 w-full">
          {STEPS.map((step, index) => <React.Fragment key={step.id}>
              <div className="flex-1 min-w-0">
                <StepCard step={step} simulationActive={activeStep === step.id} />
              
              </div>
              {index < STEPS.length - 1 && <Connector active={activeStep === step.id || activeStep === STEPS[index + 1].id} />}
            </React.Fragment>)}
        </div>

        {/* Mobile layout: stacked */}
        <div className="flex lg:hidden flex-col gap-4">
          {STEPS.map(step => <StepCard key={step.id} step={step} simulationActive={activeStep === step.id} />)}
        </div>
      </div>

      {/* Action area */}
      <div className="flex flex-col items-center gap-8 mt-16">
        <button onClick={() => {
        if (!isSimulating) {
          setBtnPressed(true);
          setTimeout(() => setBtnPressed(false), 150);
          startSimulation();
        }
      }} disabled={isSimulating} aria-label={isSimulating ? 'Validation in progress' : 'Simulate transaction'} className={cn('relative px-8 py-4 rounded-full font-mono text-sm font-bold uppercase tracking-widest select-none', 'transition-all duration-200', isSimulating ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-[#00e5ff] text-[#0a0c10] hover:bg-white cursor-pointer')} style={{
        boxShadow: isSimulating ? 'none' : btnPressed ? '0 0 0 0 rgba(0,229,255,0)' : 'none',
        transform: btnPressed ? 'scale(0.96)' : 'scale(1)',
        transition: 'transform 150ms ease, box-shadow 150ms ease, background-color 200ms ease',
        willChange: 'transform'
      }} onMouseEnter={e => {
        if (!isSimulating) {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 28px rgba(0,229,255,0.4)';
        }
      }} onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
      }}>
          
          <span className="relative flex items-center gap-2">
            <Play className={cn('w-4 h-4 fill-current transition-transform duration-200', !isSimulating && 'group-hover:scale-110')} />
            
            {isSimulating ? 'VALIDATION IN PROGRESS...' : 'SIMULATE TRANSACTION'}
          </span>

          {/* Ping ring — only when idle */}
          {!isSimulating && <span className="absolute inset-0 rounded-full border border-[#00e5ff]/30 animate-ping opacity-20 pointer-events-none" aria-hidden="true" />}
        </button>

        {/* Footer stats */}
        <p className="font-mono text-[10px] md:text-xs text-slate-600 uppercase flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <span>Average validation time: &lt;200ms</span>
          <span className="hidden md:inline" aria-hidden="true">•</span>
          <span>Zero single points of failure</span>
          <span className="hidden md:inline" aria-hidden="true">•</span>
          <span>Full audit trail on every transaction</span>
        </p>
      </div>

      {/* Ambient glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none" style={{
      zIndex: -1
    }} aria-hidden="true">
        
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-[#00e5ff]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-[#a855f7]/5 blur-[120px] rounded-full" />
      </div>

      {/* Reduced-motion global style */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>;
};
