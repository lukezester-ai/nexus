export async function platformCheck(url: string) {
  // Mock LLM presence – real version would call ChatGPT, Perplexity APIs
  return { chatGPTCited: false, perplexityCited: false, googleAICited: false, claudeCited: false };
}
