import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
interface Testimonial {
  id: string;
  quote: string;
  name: string;
  title: string;
  initials: string;
  rating: number;
  isFeatured?: boolean;
}
interface Stat {
  value: string;
  label: string;
  colorClass: string;
}
const CLIENT_LOGOS = [{
  id: 'logo-1',
  name: 'AGROHOLDING'
}, {
  id: 'logo-2',
  name: 'TERRA GROUP'
}, {
  id: 'logo-3',
  name: 'NEXUS VENTURES'
}, {
  id: 'logo-4',
  name: 'BALKAN TRADE CO.'
}, {
  id: 'logo-5',
  name: 'EUROAGRI'
}, {
  id: 'logo-6',
  name: 'DIGITAL FIELDS'
}];
const TESTIMONIALS: Testimonial[] = [{
  id: 't-1',
  quote: '"NexusECO cut our compliance overhead by 60%. AuditNexus alone paid for itself in the first quarter."',
  name: 'IVAN PETROV',
  title: 'COO, Terra Group',
  initials: 'IP',
  rating: 5
}, {
  id: 't-2',
  quote: '"FieldLot transformed how we execute commodity trades. The validation loop gives us confidence in every transaction."',
  name: 'ELENA GEORGIEVA',
  title: 'Head of Operations, Balkan Trade Co.',
  initials: 'EG',
  rating: 5,
  isFeatured: true
}, {
  id: 't-3',
  quote: '"Having TerraIQ, AgriNexus Law and FieldLot under one core is a game changer for enterprise agriculture."',
  name: 'MARTIN STOYANOV',
  title: 'CEO, EuroAgri',
  initials: 'MS',
  rating: 5
}];
const STATS: Stat[] = [{
  value: '4 LIVE APPS',
  label: 'INTELLIGENCE SUITE',
  colorClass: 'text-white'
}, {
  value: '92+ MODULES',
  label: 'VALIDATED FUNCTIONS',
  colorClass: 'text-[#00e5ff]'
}, {
  value: '99.9% UPTIME',
  label: 'ENTERPRISE SLA',
  colorClass: 'text-white'
}, {
  value: '3 MARKETS',
  label: 'GLOBAL OPERATIONS',
  colorClass: 'text-[#a855f7]'
}];
const STAR_KEYS = ['s1', 's2', 's3', 's4', 's5'];
export const NexusEcoSocialProof: React.FC = () => {
  return <section className="min-h-screen bg-[#0a0c10] text-white font-sans selection:bg-[#00e5ff] selection:text-black py-20 px-4 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-20">

        {/* Header Section */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="text-center space-y-4">
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-none">
            <span>Trusted by </span>
            <span className="text-[#00e5ff]">Industry Leaders</span>
          </h2>
          <p className="font-mono text-gray-500 text-sm md:text-base uppercase tracking-widest max-w-2xl mx-auto">
            From precision agriculture to enterprise compliance — built for scale.
          </p>
        </motion.div>

        {/* Logo Strip */}
        <motion.div initial={{
        opacity: 0
      }} whileInView={{
        opacity: 1
      }} viewport={{
        once: true
      }}>
          
          <div className="flex flex-wrap justify-center items-center">
            {CLIENT_LOGOS.map((logo, index) => <div key={logo.id} className="flex items-center">
                <div className="px-6 md:px-8 py-2 flex items-center justify-center">
                  <span className="font-mono text-xs md:text-sm font-bold tracking-widest text-white/35 hover:text-white/65 transition-colors duration-300 whitespace-nowrap">
                    {logo.name}
                  </span>
                </div>
                {index < CLIENT_LOGOS.length - 1 && <div className="hidden md:block h-5 w-px bg-white/10 flex-shrink-0" />}
              </div>)}
          </div>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {TESTIMONIALS.map((testimonial, index) => <motion.div key={testimonial.id} initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: index * 0.1
        }} className={cn('group relative bg-[#0f1117] border p-8 flex flex-col transition-all duration-200 hover:-translate-y-0.5', testimonial.isFeatured ? 'border-[#00e5ff]/30 hover:border-[#00e5ff]/55 shadow-[0_0_40px_-8px_rgba(0,229,255,0.12)] hover:shadow-[0_0_56px_-8px_rgba(0,229,255,0.2)]' : 'border-[#1e2330] hover:border-[#2e3448]')}>
            
              {/* Stars */}
              <div className="flex items-center gap-1 mb-6">
                {STAR_KEYS.slice(0, testimonial.rating).map(key => <Star key={key} size={13} className="fill-[#00e5ff] text-[#00e5ff] flex-shrink-0" />)}
              </div>

              {/* Quote — grows to fill available space */}
              <blockquote className="flex-1 mb-8">
                <p className="text-gray-300 text-base leading-[1.6] font-light">
                  {testimonial.quote}
                </p>
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4 mt-auto">
                <div className={cn('w-11 h-11 flex-shrink-0 rounded-full border bg-[#0a0c10] flex items-center justify-center font-mono text-[#00e5ff] text-sm font-bold transition-colors duration-200', testimonial.isFeatured ? 'border-[#00e5ff]/40 group-hover:border-[#00e5ff]/70' : 'border-[#2a2f3e] group-hover:border-[#3a4055]')}>
                
                  {testimonial.initials}
                </div>
                <div className="space-y-1 min-w-0">
                  <h4 className="font-mono font-bold text-sm tracking-wider uppercase text-white leading-none">
                    {testimonial.name}
                  </h4>
                  <p className="font-mono text-[10px] text-[#00e5ff] uppercase tracking-widest opacity-75 leading-none truncate">
                    {testimonial.title}
                  </p>
                </div>
              </div>
            </motion.div>)}
        </div>

        {/* Stat Bar */}
        <motion.div initial={{
        opacity: 0,
        y: 40
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="border-t border-b border-[#1e2330] py-12">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {STATS.map((stat, index) => <div key={stat.label} className="flex items-center justify-center">
                <div className="text-center px-6 py-4">
                  <h3 className={cn('text-xl md:text-2xl font-black tracking-tight leading-none mb-2', stat.colorClass)}>
                    {stat.value}
                  </h3>
                  <p className="font-mono text-[10px] md:text-[11px] text-gray-500 uppercase tracking-[0.2em] leading-none">
                    {stat.label}
                  </p>
                </div>
                {index < STATS.length - 1 && <div className="hidden md:block self-stretch w-px bg-[#1e2330] my-2" />}
              </div>)}
          </div>
        </motion.div>

      </div>
    </section>;
};
