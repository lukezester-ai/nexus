const TASKS = [
  { name: "Audit AI crawler access & robots.txt", priority: "DONE", hours: 4, phase: "M1" },
  { name: "Implement structured data (FAQ, HowTo, Article)", priority: "DONE", hours: 8, phase: "M1" },
  { name: "Add llms.txt and AI-readable site summary", priority: "HIGH", hours: 3, phase: "M1" },
  { name: "Fix page speed & Core Web Vitals", priority: "MEDIUM", hours: 12, phase: "M1" },
  { name: "Enable HTTPS and canonical tags", priority: "MEDIUM", hours: 2, phase: "M1" }
];

export function generateProposal(scored: any) {
  const tasks = TASKS.map(t => ({ ...t }));
  const totalHours = tasks.reduce((sum, t) => sum + t.hours, 0);
  return { tasks, totalHours, clientApproved: false };
}
