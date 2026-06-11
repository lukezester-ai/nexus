export async function readabilityScan($: any, url: string) {
  const robotsUrl = new URL('/robots.txt', url).href;
  let robotsOk = false;
  try {
    const res = await fetch(robotsUrl);
    const txt = await res.text();
    robotsOk = !txt.includes('Disallow: /') || txt.includes('Allow: /');
  } catch(e) {}
  
  return {
    hasLLMSTxt: false, // would fetch /llms.txt
    robotsAllow: robotsOk,
    structuredData: $('script[type="application/ld+json"]').length > 0,
    semanticHtmlScore: $('article, section, header, nav').length > 3 ? 0.8 : 0.4
  };
}
