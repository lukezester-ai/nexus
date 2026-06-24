import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Brain,
  Check,
  CheckCircle2,
  Circle,
  Clock,
  CreditCard,
  Database,
  Github,
  Globe,
  LayoutDashboard,
  LayoutGrid,
  Linkedin,
  Mail,
  Map as MapIcon,
  MapPin,
  Menu,
  MessageSquare,
  Play,
  RefreshCcw,
  Search,
  Server,
  Shield,
  ShieldCheck,
  Star,
  Terminal,
  TrendingUp,
  Twitter,
  Users,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import { Link } from "wouter";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(media.matches);
    const onChange = () => setReduced(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

function TickerNumber({ value, className }: { value: string; className?: string }) {
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = React.useState(value);

  React.useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }

    const prefix = value.startsWith("<") ? "<" : "";
    const clean = value.replace(/^</, "");
    const numeric = Number.parseFloat(clean.replace(/[^0-9.]/g, ""));
    const suffix = clean.replace(/[0-9.]/g, "");
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / 1200, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = (Number.isNaN(numeric) ? 0 : numeric) * eased;
      const formatted = value.includes(".") || suffix.includes("%") ? current.toFixed(1) : String(Math.floor(current));
      setDisplay(`${prefix}${formatted}${suffix}`);
      if (progress < 1) frame = requestAnimationFrame(tick);
      else setDisplay(value);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced, value]);

  return <span className={cn("text-2xl font-bold tabular-nums leading-none", className)}>{display}</span>;
}

export function NexusHero() {
  const [isOpen, setIsOpen] = React.useState(false);
  const links = ["TerraIQ", "AgriNexus", "FieldLot", "AuditNexus"];

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0a0c10] text-white">
      <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle,#fff_1px,transparent_1px)] bg-[length:40px_40px]" />
      <div className="absolute left-1/4 top-0 h-[520px] w-[520px] rounded-full bg-cyan-500/[0.07] blur-[130px]" />
      <div className="absolute bottom-0 right-1/4 h-[620px] w-[620px] rounded-full bg-purple-500/[0.07] blur-[150px]" />

      <nav className="relative z-20 border-b border-white/[0.06] bg-[#0a0c10]/75 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded border border-cyan-500/30 bg-cyan-500/10">
              <Activity className="h-4 w-4 text-cyan-400" />
            </span>
            <span className="text-lg font-black tracking-tight">
              NEXUS<span className="font-light text-gray-400">ECO</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {links.map((label, index) => (
              <a key={label} href={`#${label.toLowerCase()}`} className="font-mono text-[11px] text-gray-500 transition-colors hover:text-white">
                <span className="text-cyan-500/50">0{index + 1}.</span> {label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-5 lg:flex">
            <button className="font-mono text-[11px] text-gray-500 transition-colors hover:text-white">
              <Globe className="mr-1 inline h-4 w-4" />
              BG
            </button>
            <Link href="/hub" className="font-mono text-[11px] text-cyan-400">
              HUB
            </Link>
            <Link href="/dashboard" className="flex h-9 items-center gap-2 rounded-[3px] bg-cyan-500 px-5 font-mono text-[11px] font-black tracking-wider text-[#0a0c10] shadow-[0_0_20px_rgba(6,182,212,0.25)]">
              EXECUTIVE DASHBOARD <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <button className="lg:hidden" onClick={() => setIsOpen((value) => !value)} aria-label="Toggle menu">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute left-0 top-full z-30 flex w-full flex-col gap-5 border-b border-white/[0.06] bg-[#0a0c10] p-6 lg:hidden">
              {links.map((label, index) => (
                <a key={label} href={`#${label.toLowerCase()}`} className="font-mono text-sm text-gray-400">
                  <span className="text-cyan-500">0{index + 1}.</span> {label}
                </a>
              ))}
              <Link href="/dashboard" className="flex h-11 items-center justify-center gap-2 bg-cyan-500 font-mono text-xs font-black tracking-wider text-[#0a0c10]">
                EXECUTIVE DASHBOARD <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-72px)] max-w-6xl flex-col items-center justify-center px-6 py-24 text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="flex flex-col items-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.04] px-3.5 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
              <span className="relative h-2 w-2 rounded-full bg-green-400" />
            </span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-white/75">Core Systems Online</span>
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-x-8 gap-y-2 font-mono text-[10px] text-gray-500">
            {["92 active functions", "3 live markets", "127 audits today", "99.9% uptime"].map((item) => (
              <span key={item} className="uppercase tracking-wider">
                {item}
              </span>
            ))}
          </div>
          <h1 className="mt-14 text-[52px] font-black uppercase leading-[0.95] tracking-tight sm:text-[68px] md:text-[88px] lg:text-[104px]">
            Enterprise
            <br />
            Intelligence
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-purple-400 bg-clip-text text-transparent">Operating System.</span>
          </h1>
          <p className="mt-8 max-w-3xl font-mono text-sm leading-7 text-gray-400 sm:text-[15px]">
            A unified core powering independent applications. One central intelligence engine orchestrating operations, legal compliance, and market execution.
          </p>
          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <Link href="/dashboard" className="flex h-12 items-center justify-center gap-3 rounded-[3px] bg-cyan-500 px-8 font-mono text-xs font-black tracking-wider text-[#0a0c10] transition-colors hover:bg-cyan-400">
              EXECUTIVE DASHBOARD <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#pricing" className="flex h-12 items-center justify-center rounded-[3px] border border-white/20 px-8 font-mono text-xs font-bold tracking-wider text-white transition-all hover:bg-white hover:text-[#0a0c10]">
              REQUEST DEMO
            </a>
          </div>
        </motion.div>
      </main>
    </section>
  );
}

const metricData = [
  ["92", "ACTIVE FUNCTIONS", "text-cyan-400", TrendingUp],
  ["3", "LIVE MARKETS", "text-amber-400", Activity],
  ["127", "AUDITS TODAY", "text-white", ShieldCheck],
  ["99.9%", "SYSTEM UPTIME", "text-green-500", Wifi],
  ["4", "APPLICATIONS ONLINE", "text-purple-400", LayoutGrid],
  ["<200ms", "VALIDATION TIME", "text-cyan-400", Zap],
] as const;

export function LiveMetricsStrip() {
  return (
    <section className="border-y border-[#1e2330] bg-[#131720]">
      <div className="mx-auto flex max-w-[1600px] items-center gap-5 overflow-x-auto px-6 py-4">
        <div className="flex shrink-0 items-center gap-2 rounded-full border border-[#1e2330] bg-[#1e2330]/40 px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.7)]" />
          <span className="font-mono text-[10px] font-semibold tracking-wider text-slate-300">LIVE DATA</span>
        </div>
        <div className="flex min-w-[860px] flex-1 items-center justify-between lg:min-w-0">
          {metricData.map(([value, label, color, Icon], index) => (
            <React.Fragment key={label}>
              <div className="flex flex-1 flex-col items-start gap-1.5 px-5">
                <div className="flex items-center gap-1.5">
                  <TickerNumber value={value} className={color} />
                  <Icon className={cn("h-3.5 w-3.5", color)} />
                </div>
                <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-wider text-slate-500">{label}</span>
              </div>
              {index < metricData.length - 1 && <div className="h-10 w-px bg-[#1e2330]" />}
            </React.Fragment>
          ))}
        </div>
        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <RefreshCcw className="h-3 w-3 animate-spin text-slate-600 [animation-duration:8s]" />
          <span className="font-mono text-[10px] text-slate-500">
            LAST UPDATED
            <br />
            <b>JUST NOW</b>
          </span>
        </div>
      </div>
    </section>
  );
}

const performanceData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 500 },
  { name: "Jun", value: 900 },
];
const tradingData = [
  { time: "10:00", price: 1250 },
  { time: "10:15", price: 1280 },
  { time: "10:30", price: 1265 },
  { time: "10:45", price: 1310 },
  { time: "11:00", price: 1290 },
];
const funnelData = [
  { name: "Leads", value: 1240, fill: "#a855f7" },
  { name: "Qualified", value: 820, fill: "#9333ea" },
  { name: "Proposals", value: 450, fill: "#7e22ce" },
  { name: "Converted", value: 180, fill: "#6b21a8" },
];

function TerraMockup() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-t-xl border-x border-t border-white/10 bg-[#080b10] font-mono">
      <div className="flex h-9 items-center gap-3 border-b border-white/[0.06] bg-[#0a0d13] px-4">
        <Globe className="h-4 w-4 text-cyan-400" />
        <span className="text-[9px] uppercase tracking-widest text-white/35">Operations Portal v4.2</span>
        <span className="ml-auto rounded border border-cyan-500/20 bg-cyan-500/10 px-1.5 py-0.5 text-[8px] uppercase text-cyan-400">Live</span>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex w-11 flex-col items-center gap-5 border-r border-white/[0.06] bg-[#070a0f] py-3">
          <LayoutDashboard className="h-3.5 w-3.5 text-cyan-400" />
          <MapIcon className="h-3.5 w-3.5 text-white/25" />
          <Database className="h-3.5 w-3.5 text-white/25" />
          <Users className="mt-auto h-3.5 w-3.5 text-white/25" />
        </div>
        <div className="flex flex-1 flex-col gap-3 p-3">
          <div className="grid grid-cols-3 gap-2">
            {["142 Fields", "+18% Yield", "3 Alerts"].map((item) => (
              <div key={item} className="rounded-lg border border-white/[0.06] bg-white/[0.04] p-2.5 text-sm font-bold text-white">
                {item}
              </div>
            ))}
          </div>
          <div className="relative h-28 overflow-hidden rounded-lg border border-white/[0.06] bg-[#070a0f]">
            <svg className="h-full w-full opacity-30" viewBox="0 0 400 160">
              <path d="M50,40 L80,40 L90,70 L60,80 ZM120,60 L160,50 L170,90 L130,100 ZM250,80 L290,70 L310,110 L260,120 Z" fill="#00e5ff" />
            </svg>
          </div>
          <ResponsiveContainer width="100%" height={58}>
            <AreaChart data={performanceData}>
              <Area type="monotone" dataKey="value" stroke="#00e5ff" fill="#00e5ff22" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function FieldMockup() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-t-xl border-x border-t border-white/10 bg-[#080b10] font-mono">
      <div className="flex h-9 items-center gap-3 border-b border-white/[0.06] bg-[#0a0d13] px-4">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
        <span className="text-[9px] uppercase tracking-widest text-amber-400">Live Bidding Active</span>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-white/[0.06] bg-[#070a0f] p-2.5">
            <span className="text-[8px] text-white/35">LAST PRICE</span>
            <p className="text-lg font-bold">$1,324.50</p>
          </div>
          <div className="rounded-lg border border-white/[0.06] bg-[#070a0f] p-2.5">
            <span className="text-[8px] text-white/35">24H VOLUME</span>
            <p className="text-lg font-bold">42.8M</p>
          </div>
        </div>
        <div className="h-20 rounded-lg border border-white/[0.06] bg-[#070a0f] p-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={tradingData}>
              <Line type="stepAfter" dataKey="price" stroke="#fbbf24" strokeWidth={1.5} dot={false} />
              <RechartsTooltip contentStyle={{ background: "#0a0d13", border: "1px solid rgba(255,255,255,0.1)", fontSize: 9 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 rounded-lg border border-white/[0.06] bg-white/[0.03] p-2 text-[9px] text-white/55">
          <span>2,450</span>
          <span>$1,322</span>
          <span className="text-right">$3.2M</span>
          <span>1,820</span>
          <span>$1,321</span>
          <span className="text-right">$2.4M</span>
        </div>
      </div>
    </div>
  );
}

function AuditMockup() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-t-xl border-x border-t border-white/10 bg-[#080b10] font-mono">
      <div className="flex h-9 items-center gap-4 border-b border-white/[0.06] bg-[#0a0d13] px-4">
        <BarChart3 className="h-4 w-4 text-purple-400" />
        <span className="text-[9px] font-semibold text-white">Dashboard</span>
        <span className="text-[9px] text-white/30">Audits</span>
      </div>
      <div className="grid flex-1 grid-cols-12 gap-3 p-3">
        <div className="col-span-4 flex flex-col gap-2">
          {["87 SEO", "92 GEO", "79 AEO"].map((score) => (
            <div key={score} className="rounded-xl border border-white/[0.06] bg-[#070a0f] p-3 text-center text-sm font-bold text-white">
              {score}
            </div>
          ))}
        </div>
        <div className="col-span-8 flex flex-col gap-2">
          <div className="min-h-0 flex-1 rounded-xl border border-white/[0.06] bg-white/[0.04] p-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" hide />
                <Bar dataKey="value" radius={[0, 3, 3, 0]}>
                  {funnelData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-[#070a0f] p-2 text-[8px] uppercase text-white/35">
            <Search className="mr-2 inline h-3 w-3" /> Enterprise AI / Supply Chain
          </div>
        </div>
      </div>
    </div>
  );
}

const apps = [
  { id: "terraiq", tag: "APP 01 // Operations & Intelligence", title: "TerraIQ", description: "Monitor fields, logistics, operational KPIs and complex workflows with geospatial awareness.", tags: ["Operations", "Intelligence", "Assets"], color: "cyan", mockup: <TerraMockup /> },
  { id: "fieldlot", tag: "APP 03 // Marketplace & Logistics", title: "FieldLot", description: "Dynamic trading, live bidding, pricing intelligence and supply chain execution with escrow protection.", tags: ["Live Bidding", "Supply Chain", "Escrow"], color: "amber", mockup: <FieldMockup /> },
  { id: "auditnexus", tag: "APP 04 // SEO & Compliance Audit", title: "AuditNexus", description: "SEO, GEO and AEO audits with automated proposal generation and lead scoring.", tags: ["SEO/GEO/AEO", "Proposals", "Scoring"], color: "purple", mockup: <AuditMockup /> },
] as const;

export function AppPreviewsSection() {
  return (
    <section id="terraiq" className="relative min-h-screen overflow-hidden bg-[#0a0c10] px-6 py-28">
      <div className="absolute left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-cyan-500/[0.04] blur-[140px]" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div {...fadeUp} className="mb-20 text-center">
          <p className="mb-7 font-mono text-[10px] uppercase tracking-[0.35em] text-white/35">Ecosystem Overview</p>
          <h2 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-7xl">THE APPLICATIONS</h2>
          <p className="mx-auto max-w-sm font-mono text-[13px] leading-relaxed tracking-wider text-white/35">Four specialized portals. One unified intelligence core.</p>
        </motion.div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {apps.map((app, index) => (
            <motion.article key={app.id} id={app.id} {...fadeUp} transition={{ duration: 0.5, delay: index * 0.08 }} className={cn("group flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d1117] transition-all hover:border-white/20 hover:shadow-[0_8px_40px_rgba(0,0,0,0.5)]", index === 0 && "lg:col-span-2")}>
              <div className="flex flex-1 flex-col p-7 pb-6">
                <span className={cn("mb-5 block font-mono text-[10px] uppercase tracking-[0.2em]", app.color === "cyan" && "text-cyan-400", app.color === "amber" && "text-amber-400", app.color === "purple" && "text-purple-400")}>{app.tag}</span>
                <h3 className="mb-4 text-[2.2rem] font-bold leading-tight tracking-tight text-white">{app.title}</h3>
                <p className="mb-6 max-w-lg text-[13px] leading-relaxed text-white/55">{app.description}</p>
                <div className="mb-7 flex flex-wrap gap-2">{app.tags.map((tag) => <span key={tag} className="rounded-full border border-white/[0.09] bg-white/[0.05] px-3 py-1 font-mono text-[10px] text-white/45">{tag}</span>)}</div>
                <button className="flex h-9 w-fit items-center gap-2.5 rounded-lg border border-cyan-500/30 px-5 font-mono text-[11px] font-bold uppercase tracking-widest text-cyan-400 transition-colors hover:bg-cyan-500/10">Access Portal <ArrowRight className="h-3.5 w-3.5" /></button>
              </div>
              <div className="px-7"><div className="aspect-video translate-y-2 overflow-hidden rounded-t-xl shadow-[0_-4px_40px_rgba(0,0,0,0.6)] transition-transform group-hover:translate-y-0">{app.mockup}</div></div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  { id: 1, label: "1. APP", title: "CLIENT REQUEST", short: "TerraIQ requests action", text: "The client application initiates a request through the secure Nexus API gateway.", color: "#00e5ff", icon: Terminal },
  { id: 2, label: "2. CORE", title: "DECISION ENGINE", short: "AI models analyze action", text: "Nexus Core processes the request using market signals, history and contextual intelligence.", color: "#ec4899", icon: Brain },
  { id: 3, label: "3. AUDIT", title: "TRUST ENGINE", short: "Trust Engine validates risk", text: "Audit Engine scores risk, validates compliance and approves, flags or blocks the transaction.", color: "#a855f7", icon: Shield },
  { id: 4, label: "4. EXECUTION", title: "RESULT RETURNED", short: "App receives result", text: "The result returns with audit trail, decision metadata and action confirmation.", color: "#f59e0b", icon: Zap },
];

export function ValidationLoopSection() {
  const [activeStep, setActiveStep] = React.useState<number | null>(null);
  const [isSimulating, setIsSimulating] = React.useState(false);

  const startSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    steps.forEach((step, index) => window.setTimeout(() => setActiveStep(step.id), index * 600));
    window.setTimeout(() => {
      setActiveStep(null);
      setIsSimulating(false);
    }, steps.length * 600 + 800);
  };

  return (
    <section className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0a0c10] px-6 py-24">
      <motion.div {...fadeUp} className="mb-16 max-w-3xl text-center">
        <h2 className="mb-4 text-4xl font-black uppercase tracking-tight text-white md:text-6xl">THE VALIDATION LOOP</h2>
        <p className="font-mono text-sm uppercase text-slate-500 md:text-base">How a client application communicates with the internal core to execute a safe transaction.</p>
      </motion.div>
      <div className="grid w-full max-w-6xl grid-cols-1 gap-4 lg:grid-cols-4">
        {steps.map((step) => {
          const Icon = step.icon;
          const active = activeStep === step.id;
          return (
            <article key={step.id} className="relative rounded-xl bg-[#0f1117] p-6 transition-transform" style={{ borderTop: `3px solid ${step.color}`, boxShadow: active ? `0 8px 32px -8px ${step.color}` : "0 0 0 1px rgba(255,255,255,0.04)" }}>
              <Icon className="absolute right-6 top-6 h-20 w-20 opacity-10" style={{ color: step.color }} />
              <span className="relative mb-4 block font-mono text-xs font-bold tracking-widest" style={{ color: step.color }}>{step.label}</span>
              <h3 className="relative mb-2 text-lg font-bold text-white">{step.title}</h3>
              <p className="relative mb-3 font-mono text-sm text-slate-400">{step.short}</p>
              <p className="relative border-l border-slate-800 pl-3 text-xs leading-relaxed text-slate-500">{step.text}</p>
            </article>
          );
        })}
      </div>
      <button onClick={startSimulation} disabled={isSimulating} className={cn("mt-16 flex items-center gap-2 rounded-full px-8 py-4 font-mono text-sm font-bold uppercase tracking-widest transition-colors", isSimulating ? "bg-slate-800 text-slate-500" : "bg-cyan-400 text-[#0a0c10] hover:bg-white")}>
        <Play className="h-4 w-4 fill-current" /> {isSimulating ? "VALIDATION IN PROGRESS..." : "SIMULATE TRANSACTION"}
      </button>
    </section>
  );
}

export function NexusEcoSocialProof() {
  const testimonials = [
    ["NexusECO cut our compliance overhead by 60%. AuditNexus alone paid for itself in the first quarter.", "IVAN PETROV", "COO, Terra Group", "IP"],
    ["FieldLot transformed how we execute commodity trades. The validation loop gives us confidence in every transaction.", "ELENA GEORGIEVA", "Head of Operations, Balkan Trade Co.", "EG"],
    ["Having TerraIQ, AgriNexus Law and FieldLot under one core is a game changer for enterprise agriculture.", "MARTIN STOYANOV", "CEO, EuroAgri", "MS"],
  ];

  return (
    <section className="min-h-screen overflow-hidden bg-[#0a0c10] px-4 py-20 text-white md:px-8">
      <div className="mx-auto max-w-7xl space-y-20">
        <motion.div {...fadeUp} className="space-y-4 text-center">
          <h2 className="text-4xl font-black uppercase leading-none tracking-tight md:text-6xl">Trusted by <span className="text-cyan-400">Industry Leaders</span></h2>
          <p className="mx-auto max-w-2xl font-mono text-sm uppercase tracking-widest text-gray-500">From precision agriculture to enterprise compliance - built for scale.</p>
        </motion.div>
        <div className="flex flex-wrap items-center justify-center gap-8 font-mono text-sm font-bold tracking-widest text-white/35">{["AGROHOLDING", "TERRA GROUP", "NEXUS VENTURES", "BALKAN TRADE CO.", "EUROAGRI", "DIGITAL FIELDS"].map((logo) => <span key={logo}>{logo}</span>)}</div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map(([quote, name, title, initials], index) => (
            <motion.article key={name} {...fadeUp} transition={{ duration: 0.4, delay: index * 0.1 }} className={cn("flex flex-col border bg-[#0f1117] p-8", index === 1 ? "border-cyan-400/30 shadow-[0_0_40px_-8px_rgba(0,229,255,0.12)]" : "border-[#1e2330]")}>
              <div className="mb-6 flex gap-1">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-cyan-400 text-cyan-400" />)}</div>
              <blockquote className="mb-8 flex-1 text-base font-light leading-relaxed text-gray-300">"{quote}"</blockquote>
              <div className="flex items-center gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-400/40 bg-[#0a0c10] font-mono text-sm font-bold text-cyan-400">{initials}</span><div><h4 className="font-mono text-sm font-bold uppercase tracking-wider">{name}</h4><p className="font-mono text-[10px] uppercase tracking-widest text-cyan-400/75">{title}</p></div></div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function NexusPricing() {
  const [isAnnual, setIsAnnual] = React.useState(false);
  const tiers = [
    { label: "TIER 01", name: "CORE", monthly: "EUR299", annual: "EUR239", subtitle: "For growing operations", features: ["Access to 1 Application", "Nexus Core: Data Cloud", "Decision Engine Basic", "10 Users", "Email Support"], cta: "GET STARTED", color: "white" },
    { label: "TIER 02", name: "ENTERPRISE", monthly: "EUR899", annual: "EUR719", subtitle: "Full platform access", features: ["Access to all 4 Applications", "Full Nexus Core Suite", "Decision + Audit + Strategy Engine", "Unlimited Users", "Priority Support"], cta: "LAUNCH NEXUS", color: "cyan", featured: true },
    { label: "TIER 03", name: "SOVEREIGN", monthly: "CUSTOM", annual: "CUSTOM", subtitle: "For institutional clients", features: ["White-label Deployment", "Dedicated Infrastructure", "Custom AI Model Training", "SLA Guarantee", "On-premise Option"], cta: "CONTACT SALES", color: "purple" },
  ];

  return (
    <section id="pricing" className="relative min-h-screen overflow-hidden bg-[#080b12] px-6 py-24 text-white">
      <div className="relative z-10 mx-auto mb-16 max-w-6xl text-center">
        <motion.h2 {...fadeUp} className="mb-4 text-5xl font-black uppercase leading-none tracking-tight md:text-7xl">Choose Your Plan</motion.h2>
        <p className="mx-auto mb-12 max-w-xl font-mono text-base text-[#8b929e]">Scalable intelligence. One core. Unlimited potential.</p>
        <button onClick={() => setIsAnnual((value) => !value)} className="inline-flex items-center gap-5 rounded-full border border-[#1e2638] bg-[#0f1520] px-5 py-3 font-mono text-xs font-semibold uppercase tracking-[0.2em]">
          <span className={!isAnnual ? "text-white" : "text-[#4a5568]"}>Monthly</span><span className="relative h-6 w-12 rounded-full border border-[#2a3348] bg-[#1a2235]"><motion.span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-cyan-400" animate={{ x: isAnnual ? 24 : 0 }} /></span><span className={isAnnual ? "text-white" : "text-[#4a5568]"}>Annual -20%</span>
        </button>
      </div>
      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
        {tiers.map((tier, index) => (
          <motion.article key={tier.name} {...fadeUp} transition={{ duration: 0.45, delay: index * 0.08 }} className={cn("relative flex flex-col rounded-2xl border border-[#1a2235] bg-[#0c1118] p-8 pt-10", tier.featured && "border-cyan-400/30 shadow-[0_0_32px_rgba(34,211,238,0.08)]")}>
            {tier.featured && <span className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-lg bg-cyan-400 px-4 py-1 font-mono text-[10px] font-black uppercase tracking-wider text-[#080b12]">Most Popular</span>}
            <span className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.35em] text-[#5a6478]">{tier.label}</span>
            <h3 className="mb-1.5 text-2xl font-black uppercase tracking-tight">{tier.name}</h3>
            <p className="mb-8 font-mono text-xs text-[#5a6478]">{tier.subtitle}</p>
            <p className={cn("mb-8 text-[2.75rem] font-black leading-none tracking-tight", tier.color === "cyan" && "text-cyan-400", tier.color === "purple" && "text-purple-400")}>{isAnnual ? tier.annual : tier.monthly}<span className="ml-1 font-mono text-sm text-[#3d4a5e]">{tier.monthly !== "CUSTOM" && "/ mo"}</span></p>
            <ul className="mb-10 flex-1 space-y-3.5">{tier.features.map((feature) => <li key={feature} className="flex gap-3 font-mono text-sm text-[#8b929e]"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400" />{feature}</li>)}</ul>
            <button className={cn("flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-mono text-xs font-black uppercase tracking-[0.18em]", tier.featured ? "bg-cyan-400 text-[#080b12]" : "border border-[#2a3448] text-[#c4cdd8]")}>{tier.cta}<ArrowRight className="h-3.5 w-3.5" /></button>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export function Roadmap() {
  const phases = [
    ["01", "LIVE", "CORE LAUNCH", "Q1 2025", LayoutGrid, ["TerraIQ v1.0", "AgriNexus Law v1.0", "FieldLot v1.0", "AuditNexus v1.0"]],
    ["02", "IN PROGRESS", "INTELLIGENCE EXPANSION", "Q3 2025", Zap, ["AI Decision Engine v2", "Multi-language BG/EN/DE", "Mobile Executive App", "Advanced Audit Scoring"]],
    ["03", "COMING SOON", "APP 05 - NEXUSPAY", "Q1 2026", CreditCard, ["Integrated payment rails", "Escrow automation", "Cross-border compliance", "Crypto settlement layer"]],
    ["04", "PLANNED", "SOVEREIGN INFRASTRUCTURE", "Q3 2026", Server, ["White-label licensing", "On-premise deployment", "Custom AI model training", "Institutional data feeds"]],
  ] as const;

  return (
    <section className="relative overflow-hidden bg-[#0a0c10] px-6 py-24 text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div {...fadeUp} className="mb-20 text-center">
          <span className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.05] px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white/55"><span className="h-2 w-2 rounded-full bg-emerald-500" />System Status: Active</span>
          <h2 className="mb-5 text-5xl font-bold leading-none tracking-tight md:text-7xl">THE ROADMAP</h2>
          <p className="font-mono text-[13px] tracking-widest text-white/40">WHERE WE ARE. WHERE WE ARE GOING. BUILT IN PUBLIC.</p>
        </motion.div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {phases.map(([number, status, title, quarter, Icon, items], index) => <motion.article key={number} {...fadeUp} transition={{ duration: 0.4, delay: index * 0.1 }} className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-6">
            <div className="mb-5 flex items-center justify-between"><span className="rounded-lg border border-white/[0.06] bg-white/[0.04] p-2.5"><Icon className="h-5 w-5 text-cyan-400" /></span><span className="font-mono text-[11px] text-white/35">{quarter}</span></div>
            <span className="mb-4 inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-cyan-400">{status}</span>
            <h3 className="mb-5 text-[17px] font-bold leading-tight">{title}</h3>
            <ul className="space-y-3.5">{items.map((item, itemIndex) => <li key={item} className="flex gap-2.5 font-mono text-[13px] text-white/65">{status === "LIVE" ? <CheckCircle2 className="h-[15px] w-[15px] shrink-0 text-emerald-500" /> : itemIndex < 2 ? <Clock className="h-[15px] w-[15px] shrink-0 text-cyan-400" /> : <Circle className="h-[15px] w-[15px] shrink-0 text-slate-600" />}{item}</li>)}</ul>
          </motion.article>)}
        </div>
        <div className="mt-28 text-center"><button className="inline-flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] px-8 py-3.5 text-[11px] font-bold uppercase tracking-widest transition-all hover:border-cyan-500/40 hover:bg-cyan-500/[0.07]">Suggest a Feature <MessageSquare className="h-3.5 w-3.5 text-cyan-400" /></button></div>
      </div>
    </section>
  );
}

export function NexusFooter() {
  const [email, setEmail] = React.useState("");
  const linkGroups: Array<[string, string[]]> = [
    ["APPLICATIONS", ["01. TerraIQ", "02. AgriNexus Law", "03. FieldLot", "04. AuditNexus"]],
    ["PLATFORM", ["Nexus Core", "Decision Engine", "Audit Engine", "Strategy Engine", "HUB"]],
    ["COMPANY", ["About", "Roadmap", "Careers", "Press", "Contact"]],
  ];

  return (
    <footer className="bg-[#0a0c10] text-white">
      <div className="h-px bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400" />
      <div className="px-8 pb-10 pt-16 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="flex flex-col gap-7">
            <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-sm border border-cyan-500/30 bg-[#0a0c10]"><Activity className="h-5 w-5 text-cyan-400" /></span><span className="text-xl font-bold tracking-tight">NEXUSECO</span></div>
            <p className="font-mono text-xs leading-relaxed text-gray-400">A unified core powering independent applications for operations, legal compliance and market execution.</p>
            <div className="flex gap-2.5">{[Linkedin, Twitter, Github].map((Icon, index) => <a key={index} href="#" className="flex h-8 w-8 items-center justify-center border border-white/10 bg-[#111318]"><Icon className="h-4 w-4 text-gray-400" /></a>)}</div>
            <span className="w-fit rounded-full border border-white/5 bg-[#111318] px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-wider text-gray-400">Core systems online</span>
          </div>
          {linkGroups.map(([heading, links]) => <div key={heading}><h4 className="mb-6 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-400">{heading}</h4><ul className="space-y-[14px]">{links.map((link) => <li key={link}><a href="#" className="font-mono text-[13px] text-white/60 transition-colors hover:text-cyan-400">{link}</a></li>)}</ul></div>)}
          <div className="flex flex-col gap-7">
            <div><h4 className="mb-6 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-400">STAY UPDATED</h4><p className="mb-4 text-[11px] leading-relaxed text-gray-500">Get platform updates and intelligence reports.</p><form onSubmit={(e) => { e.preventDefault(); setEmail(""); }} className="flex flex-col gap-2"><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="ENTER EMAIL" className="border border-white/10 bg-[#111318] px-4 py-2.5 font-mono text-[11px] text-white outline-none focus:border-cyan-400" /><button className="bg-cyan-400 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#0a0c10]">SUBSCRIBE</button></form></div>
            <ul className="space-y-3 font-mono text-[11px] text-gray-500"><li><MapPin className="mr-2 inline h-3.5 w-3.5" />Sofia, Bulgaria</li><li><Mail className="mr-2 inline h-3.5 w-3.5" />contact@nexuseco.io</li><li><Globe className="mr-2 inline h-3.5 w-3.5" />nexuseco.io</li></ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-6 md:flex-row">
          <p className="font-mono text-[10px] uppercase tracking-wider text-gray-500">Copyright 2026 NEXUSECO. All rights reserved.</p>
          <div className="flex gap-5 font-mono text-[10px] uppercase tracking-wider text-gray-500"><a href="#">Privacy Policy</a><a href="#">Terms of Service</a><a href="#">GDPR</a></div>
        </div>
      </div>
    </footer>
  );
}
