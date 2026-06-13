import axios from 'axios';
import * as cheerio from 'cheerio';
import { db } from '@workspace/db';
import { auditsTable } from '@workspace/db/schema';
import { readabilityScan } from './audit-engine/readability.scanner';
import { answerReadyParse } from './audit-engine/answer-ready.parser';
import { trustAuthorityAnalyze } from './audit-engine/trust-authority.analyzer';
import { platformCheck } from './audit-engine/platform-presence.analyzer';
import { ScoringService } from './scoring.service';
import { generateProposal } from './proposal.service';

export class AuditService {
  private scoring = new ScoringService();
  
  async runAudit(url: string) {
    const { data: html } = await axios.get(url).catch(() => ({ data: '' }));
    const $ = cheerio.load(html);
    
    const readability = await readabilityScan($, url);
    const answerReady = await answerReadyParse($);
    const trust = await trustAuthorityAnalyze(url);
    const platform = await platformCheck(url);
    
    const scored = {
      readability: this.scoring.scoreReadability(readability),
      answerReady: this.scoring.scoreAnswerReady(answerReady),
      trust: this.scoring.scoreTrust(trust),
      platform: this.scoring.scorePlatform(platform)
    };
    
    // Save to database
    const [insertedAudit] = await db.insert(auditsTable).values({
      url,
      status: "completed",
      aiReadabilityScore: scored.readability.score,
      aiReadabilityPotential: scored.readability.potential,
      answerReadyScore: scored.answerReady.score,
      answerReadyPotential: scored.answerReady.potential,
      trustAuthorityScore: scored.trust.score,
      trustAuthorityPotential: scored.trust.potential,
      platformPresenceScore: scored.platform.score,
      platformPresencePotential: scored.platform.potential,
    }).returning();

    return { auditId: insertedAudit.id, url, scored, raw: { readability, answerReady, trust, platform } };
  }
}
