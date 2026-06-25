import { ExternalLink, FileCheck2, ShieldCheck, UserCheck } from "lucide-react";

const conciseAnswers = [
  {
    query: "What does NexusECO do?",
    answer:
      "NexusECO connects audits, proposals, contracts, clients, projects, and executive reporting in one operating layer.",
  },
  {
    query: "Who is it for?",
    answer:
      "It is built for teams that manage regulated operations, recurring client work, compliance reviews, and cross-application decisions.",
  },
  {
    query: "What can leaders see first?",
    answer:
      "Leaders can start with the executive dashboard, live metrics, validation status, roadmap, and pricing options.",
  },
  {
    query: "How does NexusECO support compliance?",
    answer:
      "The platform separates audit workflows, proposal history, contract records, and client/project context so reviews stay traceable.",
  },
];

const faqs = [
  {
    question: "Is NexusECO an audit management platform?",
    answer:
      "Yes. NexusECO includes audit workflows, proposal tracking, contract views, client records, and project context for operational review.",
  },
  {
    question: "Can NexusECO be used as an executive dashboard?",
    answer:
      "Yes. The dashboard route is designed for leadership visibility across active functions, audits, applications, and platform status.",
  },
  {
    question: "Does NexusECO replace existing business applications?",
    answer:
      "No. NexusECO is positioned as an intelligence and coordination layer that can sit above specialized applications and workflows.",
  },
  {
    question: "How does NexusECO approach privacy and compliance?",
    answer:
      "NexusECO presents privacy, GDPR, AI governance, and security references so teams can evaluate the platform against their own requirements.",
  },
  {
    question: "How do I request pricing or a demo?",
    answer:
      "Use the pricing section or contact link to request a walkthrough, implementation discussion, or plan recommendation.",
  },
];

const references = [
  {
    label: "GDPR official text",
    href: "https://eur-lex.europa.eu/eli/reg/2016/679/oj",
    note: "EU privacy regulation reference for personal data processing.",
  },
  {
    label: "EU Artificial Intelligence Act",
    href: "https://artificialintelligenceact.eu/the-act/",
    note: "Reference point for AI governance and risk categories.",
  },
  {
    label: "NIST AI Risk Management Framework",
    href: "https://www.nist.gov/itl/ai-risk-management-framework",
    note: "Risk management guidance for AI-enabled systems.",
  },
  {
    label: "OWASP Top 10 for LLM Applications",
    href: "https://owasp.org/www-project-top-10-for-large-language-model-applications/",
    note: "Security reference for AI application design and review.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export function NexusSeoSections() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section id="answers" className="bg-[#0a0c10] px-6 py-24 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-3xl">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-400">
              Decision-ready answers
            </p>
            <h2 className="mt-4 text-3xl font-black uppercase tracking-tight md:text-5xl">
              Fast answers for high-intent buyers.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/55">
              Short, direct explanations for teams evaluating NexusECO as an operating system for audits, governance, and executive visibility.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {conciseAnswers.map((item) => (
              <article key={item.query} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                <h3 className="text-base font-bold text-white">{item.query}</h3>
                <p className="mt-3 text-sm leading-6 text-white/60">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="bg-[#0d1017] px-6 py-24 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-400">
              FAQ markup
            </p>
            <h2 className="mt-4 text-3xl font-black uppercase tracking-tight md:text-5xl">
              Clear answers. Structured for search.
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/55">
              This section uses FAQPage structured data and visible FAQ content, so users and search engines see the same concise answers.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((item) => (
              <details key={item.question} className="group rounded-2xl border border-white/10 bg-[#111318] p-5">
                <summary className="cursor-pointer list-none text-sm font-bold text-white">
                  {item.question}
                </summary>
                <p className="mt-3 text-sm leading-6 text-white/60">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="compliance" className="bg-[#0a0c10] px-6 py-24 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-3">
            <article className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.04] p-6">
              <UserCheck className="h-6 w-6 text-cyan-400" />
              <h2 className="mt-5 text-xl font-black uppercase tracking-tight">Author details</h2>
              <p className="mt-3 text-sm leading-6 text-white/60">
                NexusECO content is maintained by the NexusECO product team for operational, audit, and executive decision workflows.
              </p>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-white/35">
                Last reviewed: 2026-06-25
              </p>
            </article>

            <article id="privacy" className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
              <ShieldCheck className="h-6 w-6 text-cyan-400" />
              <h2 className="mt-5 text-xl font-black uppercase tracking-tight">Privacy posture</h2>
              <p className="mt-3 text-sm leading-6 text-white/60">
                Buyers should review data roles, retention, access controls, audit logging, and AI processing boundaries before production rollout.
              </p>
              <a href="mailto:contact@nexuseco.io?subject=Privacy%20Review" className="mt-5 inline-flex text-sm font-bold text-cyan-300 hover:text-cyan-200">
                Request privacy review
              </a>
            </article>

            <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
              <FileCheck2 className="h-6 w-6 text-cyan-400" />
              <h2 className="mt-5 text-xl font-black uppercase tracking-tight">Compliance references</h2>
              <ul className="mt-4 space-y-3">
                {references.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-cyan-300 hover:text-cyan-200">
                      {item.label} <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <p className="mt-1 text-xs leading-5 text-white/45">{item.note}</p>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
