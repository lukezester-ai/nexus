import * as React from 'react';
import { motion } from 'framer-motion';
import { Activity, Linkedin, Twitter, Github, MapPin, Mail, Globe, ArrowRight } from 'lucide-react';

/**
 * NexusFooter — polished pass.
 * Fixed: grid alignment, heading consistency, hover transitions,
 * social icons, badge pulse, newsletter form, gradient border, bottom bar.
 */

const SOCIAL_LINKS = [{
  icon: Linkedin,
  href: '#',
  label: 'LinkedIn'
}, {
  icon: Twitter,
  href: '#',
  label: 'X (Twitter)'
}, {
  icon: Github,
  href: '#',
  label: 'GitHub'
}];
const APPLICATION_LINKS = [{
  name: '01. TerraIQ',
  href: '#'
}, {
  name: '02. AgriNexus Law',
  href: '#'
}, {
  name: '03. FieldLot',
  href: '#'
}, {
  name: '04. AuditNexus',
  href: '#'
}];
const PLATFORM_LINKS = [{
  name: 'Nexus Core',
  href: '#'
}, {
  name: 'Decision Engine',
  href: '#'
}, {
  name: 'Audit Engine',
  href: '#'
}, {
  name: 'Strategy Engine',
  href: '#'
}, {
  name: 'Executive Dashboard',
  href: '#'
}, {
  name: 'HUB',
  href: '#'
}];
const COMPANY_LINKS = [{
  name: 'About',
  href: '#'
}, {
  name: 'Roadmap',
  href: '#'
}, {
  name: 'Careers',
  href: '#'
}, {
  name: 'Press',
  href: '#'
}, {
  name: 'Contact',
  href: '#'
}];
const CONTACT_INFO = [{
  icon: MapPin,
  text: 'Sofia, Bulgaria'
}, {
  icon: Mail,
  text: 'contact@nexuseco.io'
}, {
  icon: Globe,
  text: 'nexuseco.io'
}];
const LEGAL_LINKS = [{
  name: 'PRIVACY POLICY',
  href: '#'
}, {
  name: 'TERMS OF SERVICE',
  href: '#'
}, {
  name: 'GDPR',
  href: '#'
}];
const COLUMN_HEADING_CLASS = 'text-[10px] font-bold text-[#00e5ff] tracking-[0.22em] uppercase font-mono leading-none mb-6';
const NAV_LINK_CLASS = 'text-[13px] text-white/60 font-mono leading-[1.6] hover:text-[#00e5ff] hover:translate-x-1 transition-all duration-150 ease-out inline-block whitespace-nowrap';
export const NexusFooter = () => {
  const [email, setEmail] = React.useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail('');
  };
  return <footer className="w-full bg-[#0a0c10] text-white font-mono selection:bg-[#00e5ff] selection:text-[#0a0c10]">

      {/* Top gradient border — full-width, 1px */}
      <div className="h-px w-full bg-gradient-to-r from-[#00e5ff] via-[#a855f7] to-[#00e5ff]" />

      <div className="w-full px-8 md:px-12 lg:px-16 pt-16 pb-10">

        {/* 5-column grid — equal columns, no overflow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 items-start">

          {/* Column 1 — Brand */}
          <div className="flex flex-col gap-7 lg:col-span-1 min-w-0">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0 flex items-center justify-center w-9 h-9 border border-[#00e5ff]/30 rounded-sm bg-[#0a0c10]">
                <Activity className="w-5 h-5 text-[#00e5ff]" />
                <motion.div className="absolute inset-0 border border-[#00e5ff] rounded-sm" animate={{
                opacity: [0.08, 0.35, 0.08]
              }} transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: 'easeInOut'
              }} />
                
              </div>
              <span className="text-xl font-bold tracking-tighter whitespace-nowrap">NEXUSECO</span>
            </div>

            {/* Descriptor */}
            <div className="space-y-3">
              <p className="text-[9px] text-gray-500 uppercase tracking-[0.2em] leading-none">
                Enterprise Intelligence Operating System
              </p>
              <p className="text-[12px] text-gray-400 leading-relaxed">
                A unified core powering independent applications. One central intelligence engine orchestrating operations, legal compliance, and market execution.
              </p>
            </div>

            {/* Social icons — 32×32 */}
            <div className="flex items-center gap-2.5">
              {SOCIAL_LINKS.map(social => {
              const Icon = social.icon;
              return <motion.a key={social.label} href={social.href} aria-label={social.label} whileHover={{
                boxShadow: '0 0 14px rgba(0, 229, 255, 0.25)'
              }} className="flex-shrink-0 flex items-center justify-center w-8 h-8 border border-white/10 rounded-sm bg-[#111318] transition-colors duration-150 ease-out hover:border-[#00e5ff]/50 group">
                    
                    <Icon className="w-4 h-4 text-gray-400 group-hover:text-[#00e5ff] transition-colors duration-150 ease-out" />
                  </motion.a>;
            })}
            </div>

            {/* Status badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 w-fit border border-white/5 bg-[#111318] rounded-full">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <motion.span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400" animate={{
                opacity: [0.6, 0, 0.6],
                scale: [1, 1.8, 1]
              }} transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }} />
                
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[9px] text-gray-400 font-bold tracking-[0.18em] whitespace-nowrap">CORE SYSTEMS ONLINE</span>
            </div>
          </div>

          {/* Column 2 — Applications */}
          <div className="min-w-0">
            <h4 className={COLUMN_HEADING_CLASS}>APPLICATIONS</h4>
            <ul className="space-y-[14px]">
              {APPLICATION_LINKS.map(link => <li key={link.name}>
                  <a href={link.href} className={NAV_LINK_CLASS}>{link.name}</a>
                </li>)}
            </ul>
          </div>

          {/* Column 3 — Platform */}
          <div className="min-w-0">
            <h4 className={COLUMN_HEADING_CLASS}>PLATFORM</h4>
            <ul className="space-y-[14px]">
              {PLATFORM_LINKS.map(link => <li key={link.name}>
                  <a href={link.href} className={NAV_LINK_CLASS}>{link.name}</a>
                </li>)}
            </ul>
          </div>

          {/* Column 4 — Company */}
          <div className="min-w-0">
            <h4 className={COLUMN_HEADING_CLASS}>COMPANY</h4>
            <ul className="space-y-[14px]">
              {COMPANY_LINKS.map(link => <li key={link.name}>
                  <a href={link.href} className={NAV_LINK_CLASS}>{link.name}</a>
                </li>)}
            </ul>
          </div>

          {/* Column 5 — Newsletter + Contact */}
          <div className="min-w-0 flex flex-col gap-7">

            {/* Newsletter */}
            <div>
              <h4 className={COLUMN_HEADING_CLASS}>STAY UPDATED</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed mb-4">
                Get platform updates and intelligence reports.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ENTER EMAIL" required className="w-full bg-[#111318] border border-white/10 px-4 py-2.5 text-[11px] font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-[#00e5ff] focus:shadow-[0_0_0_1px_rgba(0,229,255,0.25)] transition-all duration-150 ease-out rounded-none" />
                
                <button type="submit" className="w-full py-2.5 bg-[#00e5ff] text-[#0a0c10] text-[10px] font-bold tracking-[0.2em] hover:bg-[#00e5ff]/85 transition-colors duration-150 ease-out flex items-center justify-center gap-2 group font-mono">
                  
                  <span>SUBSCRIBE</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-150 ease-out" />
                </button>
              </form>
            </div>

            {/* Contact */}
            <ul className="space-y-3">
              {CONTACT_INFO.map(item => {
              const Icon = item.icon;
              return <li key={item.text} className="flex items-start gap-2.5 group">
                    <Icon className="w-3.5 h-3.5 text-gray-600 group-hover:text-[#00e5ff] transition-colors duration-150 ease-out mt-[1px] flex-shrink-0" />
                    <span className="text-[11px] text-gray-500 group-hover:text-gray-300 transition-colors duration-150 ease-out leading-[1.5]">{item.text}</span>
                  </li>;
            })}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Left */}
          <p className="text-[10px] text-gray-500 tracking-[0.12em] whitespace-nowrap font-mono">
            &copy; 2025 NEXUSECO. ALL RIGHTS RESERVED.
          </p>

          {/* Center — Language */}
          <div className="flex items-center gap-2 text-[10px] font-bold font-mono">
            <span className="text-gray-600 hover:text-[#00e5ff] cursor-pointer transition-colors duration-150 ease-out">BG</span>
            <span className="text-gray-700">|</span>
            <span className="text-[#00e5ff] cursor-pointer">EN</span>
          </div>

          {/* Right — Legal links */}
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-5 text-[10px] text-gray-500 tracking-[0.12em] font-mono">
            {LEGAL_LINKS.map(link => <a key={link.name} href={link.href} className="hover:text-[#00e5ff] transition-colors duration-150 ease-out whitespace-nowrap">
              
                {link.name}
              </a>)}
          </div>

        </div>
      </div>

    </footer>;
};
