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
