export class ScoringService {
  scoreReadability(data: any) {
    let score = 0;
    if (data.robotsAllow) score += 20;
    if (data.structuredData) score += 30;
    if (data.hasLLMSTxt) score += 30;
    score += data.semanticHtmlScore * 20;
    const potential = Math.min(40, 100 - score);
    return { score, potential };
  }
  
  scoreAnswerReady(data: any) {
    let score = 0;
    if (data.faqCount > 0) score += 30;
    if (data.hasHowTo) score += 30;
    if (data.wordCount > 1000) score += 20;
    else if (data.wordCount > 500) score += 10;
    const potential = Math.min(20, 100 - score);
    return { score, potential };
  }
  
  scoreTrust(data: any) {
    let score = 0;
    if (data.https) score += 30;
    if (data.hasCanonical) score += 20;
    if (data.cwvScore > 70) score += 50;
    else if (data.cwvScore > 40) score += 25;
    const potential = Math.min(38, 100 - score);
    return { score, potential };
  }
  
  scorePlatform(data: any) {
    let score = 0;
    if (data.chatGPTCited) score += 25;
    if (data.perplexityCited) score += 25;
    if (data.googleAICited) score += 25;
    if (data.claudeCited) score += 25;
    const potential = Math.min(42, 100 - score);
    return { score, potential };
  }
}
