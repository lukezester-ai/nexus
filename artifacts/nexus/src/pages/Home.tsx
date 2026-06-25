import {
  AppPreviewsSection,
} from "@/components/generated/AppPreviewsSection";
import {
  LiveMetricsStrip,
} from "@/components/generated/LiveMetricsStrip";
import {
  NexusEcoSocialProof,
} from "@/components/generated/NexusEcoSocialProof";
import {
  NexusFooter,
} from "@/components/generated/NexusFooter";
import {
  NexusHero,
} from "@/components/generated/NexusHero";
import {
  NexusPricing,
} from "@/components/generated/NexusPricing";
import {
  Roadmap,
} from "@/components/generated/Roadmap";
import {
  ValidationLoopSection,
} from "@/components/generated/ValidationLoop";
import { NexusSeoSections } from "@/components/landing/NexusSeoSections";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0a0c10] text-white">
      <NexusHero />
      <section id="metrics"><LiveMetricsStrip /></section>
      <section id="apps"><AppPreviewsSection /></section>
      <section id="validation"><ValidationLoopSection /></section>
      <section id="proof"><NexusEcoSocialProof /></section>
      <section id="pricing"><NexusPricing /></section>
      <section id="roadmap"><Roadmap /></section>
      <NexusSeoSections />
      <section id="contact"><NexusFooter /></section>
    </main>
  );
}
