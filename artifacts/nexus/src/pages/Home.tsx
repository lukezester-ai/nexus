import {
  AppPreviewsSection,
  LiveMetricsStrip,
  NexusEcoSocialProof,
  NexusFooter,
  NexusHero,
  NexusPricing,
  Roadmap,
  ValidationLoopSection,
} from "@/components/landing/NexusLandingSections";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0a0c10] text-white">
      <NexusHero />
      <LiveMetricsStrip />
      <AppPreviewsSection />
      <ValidationLoopSection />
      <NexusEcoSocialProof />
      <NexusPricing />
      <Roadmap />
      <NexusFooter />
    </main>
  );
}
