export async function answerReadyParse($: any) {
  const faqCount = $('.faq, [itemtype*="FAQ"]').length;
  const hasHowTo = $('[itemtype*="HowTo"]').length > 0;
  const wordCount = $('body').text().split(/\s+/).length;
  return { faqCount, hasHowTo, wordCount };
}
