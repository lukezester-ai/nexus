import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, LayoutGrid, Zap, RefreshCcw, ShieldCheck } from 'lucide-react';

/**
 * Hook that checks if the user prefers reduced motion.
 */
function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setPrefersReduced(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);
  return prefersReduced;
}

/**
 * Parses a display value string into its numeric and non-numeric parts.
 */
function parseValue(value: string): {
  prefix: string;
  numeric: number;
  suffix: string;
} {
  const prefix = value.startsWith('<') ? '<' : '';
  const clean = value.replace(/^</, '');
  const numeric = parseFloat(clean.replace(/[^0-9.]/g, ''));
  const suffix = clean.replace(/[0-9.]/g, '');
  return {
    prefix,
    numeric: isNaN(numeric) ? 0 : numeric,
    suffix
  };
}

/**
 * TickerNumber — smooth count-up using requestAnimationFrame with ease-out deceleration.
 * Respects prefers-reduced-motion by skipping animation.
 */
interface TickerNumberProps {
  value: string;
  accentClass: string;
}
const TickerNumber: React.FC<TickerNumberProps> = ({
  value,
  accentClass
}) => {
  const prefersReduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState<string>(() => prefersReduced ? value : '0');
  const rafRef = useRef<number | null>(null);
  useEffect(() => {
    if (prefersReduced) {
      setDisplay(value);
      return;
    }
    const {
      prefix,
      numeric,
      suffix
    } = parseValue(value);
    const isDecimal = value.includes('.');
    const hasPercent = suffix.includes('%');
    const duration = 1800; // ms
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      const current = eased * numeric;
      let formatted: string;
      if (isDecimal || hasPercent) {
        formatted = current.toFixed(1);
      } else {
        formatted = String(Math.floor(current));
      }
      setDisplay(`${prefix}${formatted}${suffix}`);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(value);
      }
    };

    // Initial set to prevent layout shift — use "0" with correct suffix width
    const {
      prefix: p,
      suffix: s
    } = parseValue(value);
    const isDecimalInit = value.includes('.');
    setDisplay(`${p}${isDecimalInit ? '0.0' : '0'}${s}`);
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [value, prefersReduced]);
  return <span className={`text-2xl font-bold tracking-tight tabular-nums leading-none ${accentClass}`} aria-label={value}>
      
      {display}
    </span>;
};

/**
 * Metric data type
 */
interface MetricDatum {
  id: string;
  value: string;
  label: string;
  accentClass: string;
  indicator: 'arrow-up' | 'pulse-dot' | 'activity' | 'grid' | 'zap' | 'shield';
}
const METRICS: MetricDatum[] = [{
  id: 'active-functions',
  value: '92',
  label: 'ACTIVE FUNCTIONS',
  accentClass: 'text-[#00e5ff]',
  indicator: 'arrow-up'
}, {
  id: 'live-markets',
  value: '3',
  label: 'LIVE MARKETS',
  accentClass: 'text-[#f59e0b]',
  indicator: 'activity'
}, {
  id: 'audits-today',
  value: '127',
  label: 'AUDITS TODAY',
  accentClass: 'text-white',
  indicator: 'shield'
}, {
  id: 'system-uptime',
  value: '99.9%',
  label: 'SYSTEM UPTIME',
  accentClass: 'text-[#22c55e]',
  indicator: 'pulse-dot'
}, {
  id: 'apps-online',
  value: '4',
  label: 'APPLICATIONS ONLINE',
  accentClass: 'text-[#a855f7]',
  indicator: 'grid'
}, {
  id: 'validation-time',
  value: '<200ms',
  label: 'VALIDATION TIME',
  accentClass: 'text-[#00e5ff]',
  indicator: 'zap'
}];

/**
 * Indicator icons — optically aligned to sit beside the number baseline.
 */
interface IndicatorProps {
  type: MetricDatum['indicator'];
  accentClass: string;
}
const Indicator: React.FC<IndicatorProps> = ({
  type,
  accentClass
}) => {
  if (type === 'arrow-up') {
    return <TrendingUp className="w-3.5 h-3.5 text-[#22c55e] flex-shrink-0" aria-hidden="true" />;
  }
  if (type === 'activity') {
    return <motion.span animate={{
      opacity: [1, 0.4, 1]
    }} transition={{
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }} className="flex-shrink-0 flex items-center">
        
        <Activity className="w-3.5 h-3.5 text-[#22c55e]" aria-hidden="true" />
      </motion.span>;
  }
  if (type === 'pulse-dot') {
    return <span className="relative flex-shrink-0 flex h-2.5 w-2.5 items-center justify-center" aria-hidden="true">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-50" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]" />
      </span>;
  }
  if (type === 'grid') {
    return <LayoutGrid className="w-3.5 h-3.5 text-[#a855f7] flex-shrink-0" aria-hidden="true" />;
  }
  if (type === 'zap') {
    return <Zap className="w-3.5 h-3.5 text-[#00e5ff] flex-shrink-0 fill-[#00e5ff]/10" aria-hidden="true" />;
  }
  if (type === 'shield') {
    return <ShieldCheck className="w-3.5 h-3.5 text-[#94a3b8] flex-shrink-0" aria-hidden="true" />;
  }
  return null;
};

/**
 * Single metric cell — flex column, number row + label row.
 */
interface MetricCellProps {
  datum: MetricDatum;
}
const MetricCell: React.FC<MetricCellProps> = ({
  datum
}) => {
  return <div className="flex flex-col gap-1.5 items-start justify-center px-6 first:pl-0 last:pr-0">
      <div className="flex items-center gap-1.5">
        <TickerNumber value={datum.value} accentClass={datum.accentClass} />
        <span className="flex items-center" style={{
        marginTop: '1px'
      }}>
          <Indicator type={datum.indicator} accentClass={datum.accentClass} />
        </span>
      </div>
      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.12em] whitespace-nowrap leading-none">
        
        {datum.label}
      </span>
    </div>;
};

/**
 * Vertical divider between metric cells.
 */
const MetricDivider: React.FC = () => <div className="w-px self-stretch flex-shrink-0" style={{
  background: 'rgba(30, 35, 48, 0.9)',
  height: '40px',
  alignSelf: 'center'
}} aria-hidden="true" />;

/**
 * LIVE DATA badge — clean pill, smooth green pulse.
 */
const LiveBadge: React.FC = () => {
  const prefersReduced = usePrefersReducedMotion();
  return <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1e2330] bg-[#1e2330]/40 flex-shrink-0" aria-label="Live data">
      
      <span className="relative flex h-2 w-2 flex-shrink-0" aria-hidden="true">
        {!prefersReduced && <motion.span className="absolute inset-0 rounded-full bg-[#22c55e]" animate={{
        scale: [1, 1.8, 1],
        opacity: [0.8, 0, 0.8]
      }} transition={{
        duration: 2.4,
        repeat: Infinity,
        ease: 'easeOut'
      }} />}
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e] shadow-[0_0_6px_rgba(34,197,94,0.7)]" />
      </span>
      <span className="text-[10px] font-mono font-semibold text-slate-300 tracking-[0.1em] whitespace-nowrap">
        LIVE DATA
      </span>
    </div>;
};

/**
 * LAST UPDATED indicator — right side, subtle.
 */
interface LastUpdatedProps {
  text: string;
}
const LastUpdated: React.FC<LastUpdatedProps> = ({
  text
}) => {
  const prefersReduced = usePrefersReducedMotion();
  return <div className="inline-flex items-center gap-2 flex-shrink-0" aria-label={`Last updated: ${text}`}>
      <motion.span animate={prefersReduced ? {} : {
      rotate: 360
    }} transition={{
      duration: 8,
      repeat: Infinity,
      ease: 'linear'
    }} className="flex-shrink-0">
        
        <RefreshCcw className="w-3 h-3 text-slate-600" aria-hidden="true" />
      </motion.span>
      <div className="flex flex-col items-start">
        <span className="text-[9px] font-mono text-slate-600 uppercase tracking-[0.12em] leading-none">
          LAST UPDATED
        </span>
        <span className="text-[10px] font-mono text-slate-500 font-medium leading-tight mt-0.5">
          {text}
        </span>
      </div>
    </div>;
};

/**
 * The main LiveMetricsStrip component.
 */
export const LiveMetricsStrip: React.FC = () => {
  const [lastUpdated] = useState<string>('JUST NOW');
  return <section className="w-full overflow-hidden" style={{
    background: '#131720',
    borderTop: '1px solid rgba(30, 35, 48, 0.9)',
    borderBottom: '1px solid rgba(30, 35, 48, 0.9)'
  }} aria-label="Live system metrics">
      
      <div className="max-w-[1600px] mx-auto px-6 py-4">
        {/* Single row layout */}
        <div className="flex items-center gap-5">

          {/* Left: LIVE badge */}
          <LiveBadge />

          {/* Separator */}
          <div className="w-px flex-shrink-0" style={{
          height: '40px',
          background: 'rgba(30, 35, 48, 0.9)'
        }} aria-hidden="true" />
          

          {/* Metrics — evenly distributed */}
          <div className="flex-1 flex items-center justify-between min-w-0 overflow-x-auto no-scrollbar">
            <div className="flex items-center w-full min-w-[720px] lg:min-w-0">
              {METRICS.map((datum, idx) => <React.Fragment key={datum.id}>
                  <div className="flex-1 flex items-center justify-center py-1">
                    <MetricCell datum={datum} />
                  </div>
                  {idx < METRICS.length - 1 && <MetricDivider />}
                </React.Fragment>)}
            </div>
          </div>

          {/* Separator */}
          <div className="w-px flex-shrink-0" style={{
          height: '40px',
          background: 'rgba(30, 35, 48, 0.9)'
        }} aria-hidden="true" />
          

          {/* Right: Last updated */}
          <LastUpdated text={lastUpdated} />

        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>;
};
