/**
 * Zapier Integration Helper
 * Manages personalized checklist automation triggers
 */

export class ZapierIntegration {
  constructor() {
    this.webhookUrl = process.env.ZAPIER_ONBOARDING_WEBHOOK;
    this.timeout = 5000; // 5 second timeout to not block form submission
  }

  /**
   * Trigger Zapier workflow for personalized onboarding
   * Non-blocking - returns immediately
   */
  async triggerOnboarding(memberData, checklistAnalysis) {
    if (!this.webhookUrl) {
      console.warn('Zapier webhook not configured');
      return null;
    }

    const payload = {
      timestamp: new Date().toISOString(),
      memberId: memberData._id,
      name: memberData.name,
      email: memberData.email,
      major: memberData.major,
      graduationYear: memberData.graduationYear,
      careerGoal: memberData.careerGoal,
      missingAssets: checklistAnalysis.missingAssets,
      completionEstimate: checklistAnalysis.completionEstimate,
      hasLinkedIn: !!memberData.linkedinUrl,
      hasGitHub: !!memberData.githubUrl,
      hasPortfolio: !!memberData.portfolioUrl,
      hasCalendly: !!memberData.calendlyUrl,
      // Critical assets for email
      criticalAssets: checklistAnalysis.missingAssets.filter((a) => a.priority === 'critical'),
      recommendedAssets: checklistAnalysis.missingAssets.filter((a) => a.priority === 'recommended'),
      // Career-specific guidance
      careerGuidance: checklistAnalysis.careerGuidance || null,
      jobClubUrl: 'https://jobclub.njit.edu',
      discordServerUrl: process.env.DISCORD_SERVER_URL || 'https://discord.gg/jobclub',
    };

    // Fire and forget with timeout protection
    this.sendWebhookAsync(payload);
    return { queued: true };
  }

  /**
   * Send webhook asynchronously without blocking
   */
  async sendWebhookAsync(payload) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`Zapier webhook error: ${response.status} ${response.statusText}`);
      } else {
        console.log('Zapier automation triggered successfully');
      }
    } catch (error) {
      console.error('Error triggering Zapier automation:', error.message);
      // Don't throw - automation is non-blocking and optional
    }
  }

  /**
   * Generate email preview for testing
   */
  generateEmailPreview(memberData, checklistAnalysis) {
    const critical = checklistAnalysis.missingAssets
      .filter((a) => a.priority === 'critical')
      .map(
        (a) =>
          `<li>${a.asset} - ${a.estimatedTime} (<a href="${a.guide}">guide</a>)</li>`
      )
      .join('');

    const recommended = checklistAnalysis.missingAssets
      .filter((a) => a.priority === 'recommended')
      .map(
        (a) =>
          `<li>${a.asset} - ${a.estimatedTime} (<a href="${a.guide}">guide</a>)</li>`
      )
      .join('');

    return `
<html>
<body style="font-family: sans-serif;">
  <h2>Welcome to Job Club, ${memberData.name}!</h2>
  <p>Your personalized career path is ready.</p>
  
  <h3>📋 Your Action Items (${checklistAnalysis.completionEstimate})</h3>
  
  ${critical ? `<h4>🔴 Critical (Do ASAP)</h4><ul>${critical}</ul>` : ''}
  ${recommended ? `<h4>🟡 Recommended (This Week)</h4><ul>${recommended}</ul>` : ''}
  
  <p>
    <a href="https://jobclub.njit.edu">Visit Job Club</a> |
    <a href="${process.env.DISCORD_SERVER_URL || '#'}">Join Discord</a>
  </p>
</body>
</html>
    `.trim();
  }
}

export default ZapierIntegration;
