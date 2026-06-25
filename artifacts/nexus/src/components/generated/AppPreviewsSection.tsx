import * as React from 'react';
import { motion } from 'framer-motion';
import { Activity, Map as MapIcon, LayoutDashboard, BarChart3, Layers, Package, Users, ArrowRight, TrendingUp, AlertCircle, Globe, Database, Search, Lock, ArrowUpRight, Wifi, Shield, Cpu } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip as RechartsTooltip, AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis } from 'recharts';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AppCardProps {
  id: string;
  tag: string;
  title: string;
  description: string;
  tags: string[];
  accentColor: 'cyan' | 'amber' | 'purple';
  mockup: React.ReactNode;
}

// ─── Chart Data ───────────────────────────────────────────────────────────────

const PERFORMANCE_DATA = [{
  name: 'Jan',
  value: 400
}, {
  name: 'Feb',
  value: 300
}, {
  name: 'Mar',
  value: 600
}, {
  name: 'Apr',
  value: 800
}, {
  name: 'May',
  value: 500
}, {
  name: 'Jun',
  value: 900
}, {
  name: 'Jul',
  value: 700
}];
const TRADING_DATA = [{
  time: '10:00',
  price: 1250
}, {
  time: '10:15',
  price: 1280
}, {
  time: '10:30',
  price: 1265
}, {
  time: '10:45',
  price: 1310
}, {
  time: '11:00',
  price: 1290
}, {
  time: '11:15',
  price: 1345
}, {
  time: '11:30',
  price: 1320
}];
const LEAD_FUNNEL_DATA = [{
  name: 'Total Leads',
  value: 1240,
  fill: '#a855f7'
}, {
  name: 'Qualified',
  value: 820,
  fill: '#9333ea'
}, {
  name: 'Proposals',
  value: 450,
  fill: '#7e22ce'
}, {
  name: 'Converted',
  value: 180,
  fill: '#6b21a8'
}];
const ORDERBOOK_ROWS = [{
  amount: '2,450.00',
  price: '1,322.10',
  total: '$3.2M'
}, {
  amount: '1,820.00',
  price: '1,321.80',
  total: '$2.4M'
}, {
  amount: '3,100.00',
  price: '1,321.50',
  total: '$4.1M'
}, {
  amount: '980.00',
  price: '1,321.20',
  total: '$1.3M'
}];
const KEYWORD_TAGS = [{
  label: 'Enterprise AI',
  accent: false
}, {
  label: 'Supply Chain',
  accent: false
}, {
  label: 'Optimization',
  accent: true
}];

// ─── Mockup: TerraIQ ─────────────────────────────────────────────────────────

const MockupTerraIQ = () => <div className="w-full h-full bg-[#080b10] rounded-t-xl border-x border-t border-white/8 overflow-hidden flex flex-col" style={{
  fontFamily: 'ui-monospace, monospace'
}}>
    {/* Title bar */}
    <div className="h-9 border-b border-white/[0.06] flex items-center px-4 gap-3 shrink-0 bg-[#0a0d13]">
      <div className="flex gap-1.5 shrink-0">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
      </div>
      <div className="flex items-center gap-2 ml-2">
        <div className="w-4 h-4 rounded bg-cyan-500/20 flex items-center justify-center shrink-0">
          <Globe className="w-2.5 h-2.5 text-cyan-400" />
        </div>
        <span className="text-[9px] text-white/35 uppercase tracking-widest truncate">Operations Portal v4.2</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-cyan-500/10 rounded border border-cyan-500/20">
          <div className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[8px] text-cyan-400 uppercase tracking-wider">Live</span>
        </div>
      </div>
    </div>

    <div className="flex flex-1 overflow-hidden min-h-0">
      {/* Sidebar */}
      <div className="w-11 border-r border-white/[0.06] flex flex-col items-center py-3 gap-5 bg-[#070a0f] shrink-0">
        <div className="p-1.5 rounded-md bg-cyan-500/15 border border-cyan-500/20">
          <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <MapIcon className="w-3.5 h-3.5 text-white/25" />
        <Activity className="w-3.5 h-3.5 text-white/25" />
        <Database className="w-3.5 h-3.5 text-white/25" />
        <div className="mt-auto mb-1">
          <Users className="w-3.5 h-3.5 text-white/25" />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-3 flex flex-col gap-3 overflow-hidden min-w-0">
        {/* KPI row */}
        <div className="grid grid-cols-3 gap-2 shrink-0">
          <div className="bg-white/[0.04] rounded-lg p-2.5 border border-white/[0.06]">
            <span className="text-[8px] text-white/35 block mb-1 uppercase tracking-wide">Active Fields</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-white leading-none">142</span>
              <span className="text-[8px] text-cyan-400">+12%</span>
            </div>
          </div>
          <div className="bg-white/[0.04] rounded-lg p-2.5 border border-white/[0.06]">
            <span className="text-[8px] text-white/35 block mb-1 uppercase tracking-wide">Yield</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-white leading-none">+18%</span>
              <TrendingUp className="w-2.5 h-2.5 text-cyan-400" />
            </div>
          </div>
          <div className="bg-white/[0.04] rounded-lg p-2.5 border border-cyan-500/20 ring-1 ring-cyan-500/10">
            <span className="text-[8px] text-cyan-400/80 block mb-1 uppercase tracking-wide font-semibold">Alerts</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-white leading-none">3</span>
              <AlertCircle className="w-2.5 h-2.5 text-red-400" />
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="h-28 bg-[#070a0f] rounded-lg border border-white/[0.06] relative overflow-hidden shrink-0">
          <svg className="w-full h-full opacity-25" viewBox="0 0 400 160" preserveAspectRatio="none">
            <path d="M50,40 L80,40 L90,70 L60,80 Z" fill="#00e5ff" />
            <path d="M120,60 L160,50 L170,90 L130,100 Z" fill="#00e5ff" />
            <path d="M250,80 L290,70 L310,110 L260,120 Z" fill="#00e5ff" />
            <path d="M100,110 L140,118 L130,140 L90,132 Z" fill="white" fillOpacity="0.08" />
            <circle cx="200" cy="90" r="1.5" fill="#00e5ff" />
            <circle cx="155" cy="38" r="1.5" fill="#00e5ff" />
            <circle cx="305" cy="135" r="1.5" fill="#00e5ff" />
            <line x1="200" y1="90" x2="155" y2="38" stroke="#00e5ff" strokeWidth="0.5" strokeOpacity="0.3" />
            <line x1="200" y1="90" x2="305" y2="135" stroke="#00e5ff" strokeWidth="0.5" strokeOpacity="0.3" />
          </svg>
          <div className="absolute top-2 left-2 flex gap-1">
            <div className="px-1.5 py-0.5 bg-[#0a0d13] border border-white/10 rounded text-[7px] text-white/50 uppercase tracking-wider">Satellite</div>
            <div className="px-1.5 py-0.5 bg-cyan-500/15 border border-cyan-500/25 rounded text-[7px] text-cyan-400 uppercase tracking-wider">Infrared</div>
          </div>
          <div className="absolute bottom-2 right-2">
            <span className="text-[7px] text-white/20 uppercase tracking-widest">Geospatial Layer Active</span>
          </div>
        </div>

        {/* Area chart */}
        <div className="flex-1 min-h-0" style={{
        minHeight: 60
      }}>
          <div className="text-[8px] text-white/25 uppercase tracking-widest mb-1">Yield Performance</div>
          <div style={{
          height: 56
        }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PERFORMANCE_DATA} margin={{
              top: 2,
              right: 2,
              left: 0,
              bottom: 0
            }}>
                <defs>
                  <linearGradient id="terraGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#00e5ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#00e5ff" strokeWidth={1.5} fillOpacity={1} fill="url(#terraGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  </div>;

// ─── Mockup: FieldLot ─────────────────────────────────────────────────────────

const MockupFieldLot = () => <div className="w-full h-full bg-[#080b10] rounded-t-xl border-x border-t border-white/8 overflow-hidden flex flex-col" style={{
  fontFamily: 'ui-monospace, monospace'
}}>
    {/* Title bar */}
    <div className="h-9 border-b border-white/[0.06] flex items-center px-4 gap-3 shrink-0 bg-[#0a0d13]">
      <div className="flex gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
      </div>
      <div className="flex items-center gap-1.5 ml-2">
        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        <span className="text-[9px] text-amber-400 uppercase tracking-widest">Live Bidding Active</span>
      </div>
      <div className="ml-auto">
        <span className="px-1.5 py-0.5 bg-white/[0.04] border border-white/[0.08] rounded text-[8px] text-white/40">ID: NX-77291</span>
      </div>
    </div>

    <div className="flex-1 p-3 flex flex-col gap-2.5 overflow-hidden min-h-0">
      {/* Price + Volume */}
      <div className="grid grid-cols-2 gap-2 shrink-0">
        <div className="bg-[#070a0f] border border-white/[0.06] rounded-lg p-2.5">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[8px] text-white/35 uppercase tracking-wide">Last Price</span>
            <span className="text-[8px] text-green-400 flex items-center gap-0.5">
              <ArrowUpRight className="w-2.5 h-2.5" />
              <span>+2.4%</span>
            </span>
          </div>
          <span className="text-[17px] font-bold text-white leading-none">$1,324.50</span>
        </div>
        <div className="bg-[#070a0f] border border-white/[0.06] rounded-lg p-2.5">
          <div className="mb-1">
            <span className="text-[8px] text-white/35 uppercase tracking-wide">24h Volume</span>
          </div>
          <span className="text-[17px] font-bold text-white leading-none">42.8M</span>
        </div>
      </div>

      {/* Line chart */}
      <div className="bg-[#070a0f] rounded-lg border border-white/[0.06] p-2 shrink-0" style={{
      height: 80
    }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={TRADING_DATA} margin={{
          top: 4,
          right: 4,
          left: 0,
          bottom: 0
        }}>
            <Line type="stepAfter" dataKey="price" stroke="#fbbf24" strokeWidth={1.5} dot={false} />
            <RechartsTooltip contentStyle={{
            background: '#0a0d13',
            border: '1px solid rgba(255,255,255,0.1)',
            fontSize: '9px',
            color: '#fff',
            borderRadius: '6px',
            padding: '4px 8px'
          }} itemStyle={{
            color: '#fbbf24'
          }} labelStyle={{
            color: 'rgba(255,255,255,0.4)'
          }} />
          
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Order book */}
      <div className="flex-1 bg-white/[0.03] rounded-lg border border-white/[0.06] overflow-hidden min-h-0 flex flex-col">
        <div className="grid grid-cols-3 text-[7px] text-white/30 uppercase tracking-widest px-2.5 py-1.5 border-b border-white/[0.06] shrink-0">
          <span>Amount</span>
          <span>Price</span>
          <span className="text-right">Total</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          {ORDERBOOK_ROWS.map(row => <div key={row.price} className="grid grid-cols-3 text-[9px] text-white/60 px-2.5 py-1.5 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors">
              <span className="text-amber-300/80">{row.amount}</span>
              <span>${row.price}</span>
              <span className="text-right text-white/40">{row.total}</span>
            </div>)}
        </div>
      </div>
    </div>
  </div>;

// ─── Mockup: AuditNexus ───────────────────────────────────────────────────────

const MockupAuditNexus = () => <div className="w-full h-full bg-[#080b10] rounded-t-xl border-x border-t border-white/8 overflow-hidden flex flex-col" style={{
  fontFamily: 'ui-monospace, monospace'
}}>
    {/* Title bar */}
    <div className="h-9 border-b border-white/[0.06] flex items-center px-4 gap-4 shrink-0 bg-[#0a0d13]">
      <div className="w-5 h-5 rounded-md bg-purple-500/20 flex items-center justify-center shrink-0">
        <BarChart3 className="w-3 h-3 text-purple-400" />
      </div>
      <div className="h-3.5 w-px bg-white/10" />
      <div className="flex gap-4">
        <span className="text-[9px] text-white font-semibold tracking-wide">Dashboard</span>
        <span className="text-[9px] text-white/30">Audits</span>
        <span className="text-[9px] text-white/30">Proposals</span>
      </div>
      <div className="ml-auto">
        <div className="w-5 h-5 rounded-full bg-white/[0.06] border border-white/10" />
      </div>
    </div>

    <div className="flex-1 p-3 grid grid-cols-12 gap-3 overflow-hidden min-h-0">
      {/* Score circles */}
      <div className="col-span-4 flex flex-col gap-2.5">
        <div className="bg-[#070a0f] border border-white/[0.06] rounded-xl p-2.5 flex flex-col items-center">
          <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="24" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
              <circle cx="28" cy="28" r="24" fill="transparent" stroke="#a855f7" strokeWidth="5" strokeDasharray={2 * Math.PI * 24} strokeDashoffset={2 * Math.PI * 24 * 0.13} strokeLinecap="round" />
            
            </svg>
            <span className="absolute text-sm font-bold text-white">87</span>
          </div>
          <span className="text-[7px] text-white/35 mt-1.5 uppercase tracking-widest">SEO Score</span>
        </div>
        <div className="bg-[#070a0f] border border-white/[0.06] rounded-xl p-2.5 flex flex-col items-center">
          <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="24" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
              <circle cx="28" cy="28" r="24" fill="transparent" stroke="#a855f7" strokeWidth="5" strokeDasharray={2 * Math.PI * 24} strokeDashoffset={2 * Math.PI * 24 * 0.08} strokeLinecap="round" />
            
            </svg>
            <span className="absolute text-sm font-bold text-white">92</span>
          </div>
          <span className="text-[7px] text-white/35 mt-1.5 uppercase tracking-widest">GEO Score</span>
        </div>
        {/* AEO mini score */}
        <div className="bg-[#070a0f] border border-white/[0.06] rounded-xl p-2 flex items-center justify-between">
          <span className="text-[7px] text-white/35 uppercase tracking-widest">AEO</span>
          <div className="flex items-center gap-1">
            <div className="h-1 w-12 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-4/5 bg-purple-500/60 rounded-full" />
            </div>
            <span className="text-[9px] text-white font-bold">79</span>
          </div>
        </div>
      </div>

      {/* Pipeline chart + keywords */}
      <div className="col-span-8 flex flex-col gap-2.5 min-h-0">
        <div className="bg-white/[0.04] rounded-xl p-2.5 border border-white/[0.06] flex-1 flex flex-col min-h-0">
          <span className="text-[8px] text-white/40 mb-2 uppercase tracking-widest shrink-0">Lead Pipeline</span>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={LEAD_FUNNEL_DATA} layout="vertical" margin={{
              top: 0,
              right: 4,
              left: 0,
              bottom: 0
            }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" hide />
                <Bar dataKey="value" radius={[0, 3, 3, 0]} barSize={14}>
                  {LEAD_FUNNEL_DATA.map(entry => <Cell key={entry.name} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-3 mt-2 shrink-0">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span className="text-[7px] text-white/35">Leads: 1,240</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-900" />
              <span className="text-[7px] text-white/35">Conv: 14.5%</span>
            </div>
          </div>
        </div>

        <div className="bg-[#070a0f] border border-white/[0.06] rounded-xl p-2.5 shrink-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[8px] text-white/35 uppercase tracking-widest">Keywords</span>
            <Search className="w-3 h-3 text-white/20" />
          </div>
          <div className="flex flex-wrap gap-1">
            {KEYWORD_TAGS.map(kw => <div key={kw.label} className={kw.accent ? 'px-1.5 py-0.5 bg-purple-500/10 border border-purple-500/30 rounded text-[7px] text-purple-400' : 'px-1.5 py-0.5 bg-white/[0.04] rounded text-[7px] text-white/50'}>
            
                {kw.label}
              </div>)}
          </div>
        </div>
      </div>
    </div>
  </div>;

// ─── AppCard ──────────────────────────────────────────────────────────────────

const ACCENT_BUTTON: Record<string, string> = {
  cyan: 'text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/10 hover:border-cyan-400/60',
  amber: 'text-amber-400 border-amber-500/30 hover:bg-amber-500/10 hover:border-amber-400/60',
  purple: 'text-purple-400 border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-400/60'
};
const ACCENT_TAG: Record<string, string> = {
  cyan: 'text-cyan-400',
  amber: 'text-amber-400',
  purple: 'text-purple-400'
};
const AppCard = ({
  id,
  tag,
  title,
  description,
  tags,
  accentColor,
  mockup
}: AppCardProps) => {
  const isWide = id === 'APP 01';
  return <motion.article initial={{
    opacity: 0,
    y: 24
  }} whileInView={{
    opacity: 1,
    y: 0
  }} viewport={{
    once: true,
    margin: '-60px'
  }} transition={{
    duration: 0.5,
    ease: [0.25, 0.46, 0.45, 0.94]
  }} className={['group relative bg-[#0d1117] border border-white/[0.07] rounded-2xl overflow-hidden flex flex-col', 'transition-all duration-200 ease-out', 'hover:border-white/20 hover:shadow-[0_8px_40px_rgba(0,0,0,0.5)]', isWide ? 'lg:col-span-2' : 'lg:col-span-1'].join(' ')}>
      
      {/* Card body */}
      <div className="p-7 pb-6 flex flex-col flex-1">
        {/* Tag */}
        <span className={`text-[10px] font-mono tracking-[0.2em] uppercase mb-5 block ${ACCENT_TAG[accentColor]}`}>
          {tag}
        </span>

        {/* Title */}
        <h3 className="text-[2.2rem] font-bold text-white leading-[1.1] tracking-tight mb-4">
          {title}
        </h3>

        {/* Description */}
        <p className="text-white/55 text-[13px] leading-[1.65] mb-6 max-w-lg">
          {description}
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 mb-7">
          {tags.map(t => <span key={t} className="px-3 py-1 bg-white/[0.05] border border-white/[0.09] rounded-full text-[10px] text-white/45 font-mono tracking-wide leading-none">
            
              {t}
            </span>)}
        </div>

        {/* CTA Button */}
        <div>
          <button className={['group/btn flex items-center gap-2.5 h-9 px-5 border rounded-lg text-[11px] font-bold font-mono tracking-widest uppercase', 'transition-all duration-200 ease-out outline-none', ACCENT_BUTTON[accentColor]].join(' ')}>
            
            <span>Access Portal</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover/btn:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Mockup preview */}
      <div className="px-7 pb-0 flex-none">
        <div className="w-full overflow-hidden rounded-t-xl translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ease-out shadow-[0_-4px_40px_rgba(0,0,0,0.6)]" style={{
        aspectRatio: '16/9'
      }}>
          
          {mockup}
        </div>
      </div>
    </motion.article>;
};

// ─── Main Section ─────────────────────────────────────────────────────────────

const APPS: AppCardProps[] = [{
  id: 'APP 01',
  tag: 'APP 01 // Operations & Intelligence',
  title: 'TerraIQ',
  description: 'Full visibility over physical and digital assets. Monitor fields, logistics, and operational KPIs in real time. Orchestrate complex workflows with precision automation and geospatial awareness.',
  tags: ['Operations', 'Intelligence', 'Asset Management'],
  accentColor: 'cyan',
  mockup: <MockupTerraIQ />
}, {
  id: 'APP 03',
  tag: 'APP 03 // Marketplace & Logistics',
  title: 'FieldLot',
  description: 'Dynamic trading, live bidding, pricing engine, and supply chain execution with escrow protection. A global liquidity layer for industrial commodities.',
  tags: ['Live Bidding', 'Supply Chain', 'Escrow'],
  accentColor: 'amber',
  mockup: <MockupFieldLot />
}, {
  id: 'APP 04',
  tag: 'APP 04 // SEO & Compliance Audit',
  title: 'AuditNexus',
  description: 'SEO, GEO, AEO audits. Automated proposal engine and lead scoring with live analysis. Ensure compliance across international regulatory jurisdictions.',
  tags: ['SEO/GEO/AEO', 'Proposals', 'Lead Scoring'],
  accentColor: 'purple',
  mockup: <MockupAuditNexus />
}];
export const AppPreviewsSection = () => <section className="relative py-28 px-6 bg-[#0a0c10] overflow-hidden min-h-screen">
    {/* Background glows */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/[0.04] rounded-full blur-[140px]" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/[0.04] rounded-full blur-[140px]" />
    </div>

    <div className="max-w-7xl mx-auto relative z-10">
      {/* Section header */}
      <div className="text-center mb-20">
        <motion.div initial={{
        opacity: 0,
        y: -16
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.5
      }} className="flex items-center justify-center gap-4 mb-7">
        
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-white/15" />
          <span className="text-[10px] text-white/35 tracking-[0.35em] font-mono uppercase">Ecosystem Overview</span>
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-white/15" />
        </motion.div>

        <motion.h2 initial={{
        opacity: 0
      }} whileInView={{
        opacity: 1
      }} viewport={{
        once: true
      }} transition={{
        delay: 0.1,
        duration: 0.5
      }} className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.05]">
        
          THE APPLICATIONS
        </motion.h2>

        <motion.p initial={{
        opacity: 0
      }} whileInView={{
        opacity: 1
      }} viewport={{
        once: true
      }} transition={{
        delay: 0.18,
        duration: 0.5
      }} className="text-white/35 font-mono text-[13px] tracking-wider max-w-sm mx-auto leading-relaxed">
        
          Four specialized portals. One unified intelligence core.
        </motion.p>
      </div>

      {/* App cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {APPS.map(app => <AppCard key={app.id} {...app} />)}
      </div>

      {/* Footer meta */}
      <motion.div initial={{
      opacity: 0
    }} whileInView={{
      opacity: 1
    }} viewport={{
      once: true
    }} transition={{
      duration: 0.5
    }} className="mt-20 border-t border-white/[0.06] pt-10 flex flex-col md:flex-row justify-between items-center gap-8">
      
        <div className="flex items-center gap-8">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-white/20 font-mono uppercase tracking-widest">Architecture</span>
            <span className="text-[11px] text-white/55 font-medium">Distributed Intelligence Core</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-white/20 font-mono uppercase tracking-widest">Uptime</span>
            <span className="text-[11px] text-cyan-400 font-medium">99.999% SLA Guaranteed</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-white/20 font-mono uppercase tracking-widest">Security</span>
            <span className="text-[11px] text-white/55 font-medium">SOC 2 Type II</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 border border-white/10 rounded-lg cursor-pointer hover:border-cyan-500/40 transition-all duration-200 group">
            <Layers className="w-4 h-4 text-white/20 group-hover:text-cyan-400 transition-colors duration-200" />
          </div>
          <div className="p-2 border border-white/10 rounded-lg cursor-pointer hover:border-purple-500/40 transition-all duration-200 group">
            <Package className="w-4 h-4 text-white/20 group-hover:text-purple-400 transition-colors duration-200" />
          </div>
          <div className="p-2 border border-white/10 rounded-lg cursor-pointer hover:border-amber-500/40 transition-all duration-200 group">
            <Lock className="w-4 h-4 text-white/20 group-hover:text-amber-400 transition-colors duration-200" />
          </div>
          <div className="p-2 border border-white/10 rounded-lg cursor-pointer hover:border-green-500/40 transition-all duration-200 group">
            <Wifi className="w-4 h-4 text-white/20 group-hover:text-green-400 transition-colors duration-200" />
          </div>
          <div className="p-2 border border-white/10 rounded-lg cursor-pointer hover:border-white/30 transition-all duration-200 group">
            <Shield className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors duration-200" />
          </div>
        </div>
      </motion.div>
    </div>

    {/* Side decoration */}
    <div className="fixed right-6 bottom-1/2 translate-y-1/2 hidden xl:flex flex-col items-center gap-8 z-50">
      <div className="h-20 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      <span className="text-[9px] text-white/20 font-mono -rotate-90 whitespace-nowrap tracking-widest uppercase">nexus-os v1.0.4</span>
      <div className="h-20 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
    </div>
  </section>;
