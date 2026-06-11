export async function trustAuthorityAnalyze(url: string) {
  const isHttps = url.startsWith('https');
  // Mock – in real world you'd check backlinks, Core Web Vitals via API
  return { https: isHttps, hasCanonical: false, cwvScore: 45 };
}
