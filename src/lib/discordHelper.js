/**
 * Discord Integration Helper
 * Manages member roles, channel assignments, and intro posting
 */

export class DiscordIntegrationHelper {
  constructor() {
    this.webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    this.botToken = process.env.DISCORD_BOT_TOKEN;
    this.serverId = process.env.DISCORD_SERVER_ID;
    this.introChannelId = process.env.DISCORD_INTRO_CHANNEL_ID;
    this.memberRoleId = process.env.DISCORD_MEMBER_ROLE_ID;
    this.apiBaseUrl = 'https://discord.com/api/v10';
  }

  /**
   * Assign @Member role to a user
   * Requires bot token with role management permissions
   */
  async assignMemberRole(userId) {
    if (!this.botToken || !this.serverId || !this.memberRoleId) {
      console.warn('Discord bot configuration incomplete for role assignment');
      return null;
    }

    try {
      const response = await fetch(
        `${this.apiBaseUrl}/guilds/${this.serverId}/members/${userId}/roles/${this.memberRoleId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bot ${this.botToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to assign role: ${response.statusText}`);
      }

      console.log(`Assigned @Member role to user ${userId}`);
      return true;
    } catch (error) {
      console.error('Error assigning Discord role:', error);
      return false;
    }
  }

  /**
   * Post introduction to #jobclub-intros channel
   */
  async postIntroduction(memberData) {
    if (!this.webhookUrl) {
      console.warn('Discord webhook not configured');
      return null;
    }

    try {
      const embed = this.buildIntroEmbed(memberData);

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          embeds: [embed],
          allowed_mentions: { parse: [] },
        }),
      });

      if (!response.ok) {
        throw new Error(`Discord API error: ${response.statusText}`);
      }

      console.log(`Posted introduction for ${memberData.name}`);
      return await response.json();
    } catch (error) {
      console.error('Error posting introduction:', error);
      throw error;
    }
  }

  /**
   * Build intro embed with member info
   */
  buildIntroEmbed(memberData) {
    const careerEmoji = {
      'ai-engineer': '💻',
      'data-scientist': '📊',
      'product-manager': '🎯',
      'ai-consultant': '🧠',
      'ai-startup': '🚀',
      other: '❓',
    };

    const emoji = careerEmoji[memberData.careerGoal] || '👋';
    const careerLabel = this.formatCareerGoal(memberData.careerGoal);

    const fields = [
      {
        name: 'Major',
        value: memberData.major || 'Not specified',
        inline: true,
      },
      {
        name: 'Graduation',
        value: memberData.graduationYear ? `${memberData.graduationYear}` : 'Not specified',
        inline: true,
      },
      {
        name: 'Career Goal',
        value: `${emoji} ${careerLabel}`,
        inline: false,
      },
    ];

    // Add social links
    if (memberData.linkedinUrl || memberData.githubUrl || memberData.portfolioUrl) {
      let links = [];
      if (memberData.linkedinUrl) links.push(`[LinkedIn](${memberData.linkedinUrl})`);
      if (memberData.githubUrl) links.push(`[GitHub](${memberData.githubUrl})`);
      if (memberData.portfolioUrl) links.push(`[Portfolio](${memberData.portfolioUrl})`);

      fields.push({
        name: 'Connect',
        value: links.join(' • '),
        inline: false,
      });
    }

    return {
      title: `${memberData.name}`,
      description: `Welcome to Job Club! 🎉`,
      color: 0x6366f1,
      fields,
      footer: {
        text: 'Job Club • NJIT AI Career Accelerator',
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Format career goal for display
   */
  formatCareerGoal(goal) {
    const labels = {
      'ai-engineer': 'AI Software Engineer',
      'data-scientist': 'Data Scientist',
      'product-manager': 'Product Manager',
      'ai-consultant': 'AI Consultant',
      'ai-startup': 'AI Startup Founder',
      other: 'Other/Undecided',
    };
    return labels[goal] || 'Undecided';
  }

  /**
   * Send DM to new member with welcome message
   * Requires bot token
   */
  async sendWelcomeDM(userId, memberData) {
    if (!this.botToken) {
      console.warn('Discord bot token not configured for DMs');
      return null;
    }

    try {
      // Create DM channel
      const dmResponse = await fetch(`${this.apiBaseUrl}/users/@me/channels`, {
        method: 'POST',
        headers: {
          Authorization: `Bot ${this.botToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient_id: userId,
        }),
      });

      if (!dmResponse.ok) {
        throw new Error(`Failed to create DM: ${dmResponse.statusText}`);
      }

      const dmChannel = await dmResponse.json();
      const message = `
Welcome to Job Club, ${memberData.name}! 🎉

We're excited to have you join our AI Career Accelerator program.

Check your email for your personalized career path and action items.

💬 Feel free to introduce yourself in #introductions
❓ Ask questions in #help
📅 Check out events at: https://jobclub.njit.edu/events

You've got this! 💪
      `.trim();

      const msgResponse = await fetch(`${this.apiBaseUrl}/channels/${dmChannel.id}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bot ${this.botToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: message,
        }),
      });

      if (!msgResponse.ok) {
        throw new Error(`Failed to send DM: ${msgResponse.statusText}`);
      }

      console.log(`Sent welcome DM to ${memberData.name}`);
      return true;
    } catch (error) {
      console.error('Error sending welcome DM:', error);
      // Don't throw - DMs are optional
      return false;
    }
  }
}

export default DiscordIntegrationHelper;
