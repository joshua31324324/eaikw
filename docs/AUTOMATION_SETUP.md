# Job Club Automation Setup Guide

## Overview

This guide walks through setting up automated personalized onboarding emails and Discord integrations for Job Club using Zapier/Make.

---

## Part 1: Automated Personalized Checklist

### What Happens
1. Student submits onboarding form
2. API stores data in Sanity + Notion
3. Zapier/Make detects new entry
4. System identifies missing professional assets
5. Personalized email sent with:
   - Tasks they need to complete
   - Relevant guides/templates
   - Timeline

### Professional Assets Checklist

Each student should have:
- ✅ LinkedIn profile
- ✅ GitHub profile/portfolio
- ✅ Personal portfolio site (optional)
- ✅ Calendly link for scheduling

### Setup Using Zapier

#### Step 1: Create Zapier Workflow

1. **Go to:** zapier.com
2. **Create New Zap**
3. **Trigger:** "Webhook by Zapier"
   - Copy webhook URL
   - Save for later

#### Step 2: Update API to Call Zapier

Update `src/api/routes.js` to send webhook to Zapier after form submission:

```javascript
// After member is created in Sanity
const webhookUrl = process.env.ZAPIER_ONBOARDING_WEBHOOK;
if (webhookUrl) {
  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      memberId: memberProfile._id,
      name: memberProfile.name,
      email: memberProfile.email,
      linkedinUrl: memberProfile.linkedinUrl,
      githubUrl: memberProfile.githubUrl,
      portfolioUrl: memberProfile.portfolioUrl,
      calendlyUrl: memberProfile.calendlyUrl,
      careerGoal: memberProfile.careerGoal,
    }),
  });
}
```

#### Step 3: Build Zapier Actions

In your Zapier Zap, add these actions in sequence:

**Action 1: Identify Missing Assets**
```
If LinkedIn URL is empty
  -> Add to "missing" list: LinkedIn
If GitHub URL is empty
  -> Add to "missing" list: GitHub
If Calendly URL is empty
  -> Add to "missing" list: Calendly
```

**Action 2: Generate Personalized Email Content**

Create a formatter to build the email body:

```
Subject: Welcome to Job Club, [Name]! Your Personalized Career Path

Body:
---

Hi [Name],

Welcome to Job Club! 🎉

We've reviewed your onboarding responses and created a personalized action plan for you.

## Your Career Goal: [Career Goal]

## Missing Professional Assets:
[If missing LinkedIn]
- LinkedIn Profile (Critical) → Guide: [Link to LinkedIn guide]

[If missing GitHub]
- GitHub Portfolio (Critical) → Template: [Link to GitHub template]

[If missing Calendly]
- Calendly Booking Link (Recommended) → Setup: [Link to Calendly guide]

[If missing Portfolio]
- Personal Portfolio Site (Optional but Impressive) → Examples: [Link to examples]

## Your Next Steps (In Order):
1. Complete your missing assets (30-60 mins)
2. Join our Discord community [Link]
3. Attend your first event [Link to upcoming events]
4. Schedule a mentor session [Link to office hours]

## Your Personalized Resources:
- Learning path for [Career Goal]: [Link]
- Interview prep guide: [Link]
- Networking tips: [Link]

Questions? Reply to this email or post in our Discord #help channel.

You've got this! 💪
Job Club Team
```

**Action 3: Send Email**

- **To:** [Email from form]
- **From:** jobclub@njit.edu
- **Subject:** From formatter above
- **Body:** From formatter above
- **Type:** HTML

#### Step 4: Environment Variables

Add to `.env.local`:

```env
ZAPIER_ONBOARDING_WEBHOOK=https://hooks.zapier.com/hooks/catch/YOUR_KEY_HERE/
```

---

## Part 2: Discord Integration

### What Happens
1. Member submits onboarding
2. API posts intro to #jobclub-intros channel
3. (Optional) Assign @Member role to user

### Discord Setup

#### Step 1: Create Discord Bot

1. Go to **Discord Developer Portal**
2. Create new application "Job Club Bot"
3. Go to **Bot** section
4. Create bot token
5. Add these permissions:
   - `send_messages`
   - `manage_roles`
   - `read_message_history`

#### Step 2: Set Environment Variables

```env
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_ID/YOUR_TOKEN
DISCORD_INTRO_CHANNEL_ID=CHANNEL_ID_HERE
DISCORD_MEMBER_ROLE_ID=ROLE_ID_HERE
```

#### Step 3: Update Discord Integration

The Discord integration already posts intro messages. To enhance it:

**In `src/lib/discordIntegration.js`, add method:**

```javascript
async postIntroduction(memberData) {
  if (!this.webhookUrl) {
    console.warn('Discord integration not configured');
    return null;
  }

  try {
    const introText = this.buildIntroText(memberData);
    const response = await fetch(this.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: introText,
        allowed_mentions: { parse: [] }, // Don't ping anyone
      }),
    });

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error posting introduction:', error);
    throw error;
  }
}

buildIntroText(memberData) {
  const careerGoal = this.getCareerGoalLabel(memberData.careerGoal);
  
  return `
👋 **New Member Alert!**

**${memberData.name}** from **${memberData.major}** (Class of ${memberData.graduationYear}) just joined Job Club!

🎯 **Career Goal:** ${careerGoal}

${memberData.linkedinUrl ? `🔗 LinkedIn: ${memberData.linkedinUrl}` : ''}
${memberData.githubUrl ? `💻 GitHub: ${memberData.githubUrl}` : ''}

Welcome to the community! Feel free to introduce yourself in #introductions and ask questions in #help.
  `.trim();
}
```

#### Step 4: Test Integration

Run the onboarding form and verify:
- ✅ Welcome message appears in general or main channel
- ✅ Intro message appears in #jobclub-intros
- ✅ Email arrives with personalized checklist

---

## Environment Variables Summary

```env
# Zapier Automation
ZAPIER_ONBOARDING_WEBHOOK=https://hooks.zapier.com/hooks/catch/YOUR_KEY/

# Discord
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_ID/YOUR_TOKEN
DISCORD_INTRO_CHANNEL_ID=YOUR_CHANNEL_ID
DISCORD_MEMBER_ROLE_ID=YOUR_ROLE_ID

# Existing
SANITY_PROJECT_ID=YOUR_ID
SANITY_DATASET=production
SANITY_WRITE_TOKEN=YOUR_TOKEN
NOTION_API_KEY=YOUR_KEY
NOTION_DATABASE_ID=YOUR_ID
```

---

## Zapier Template

Save this as a Zap template for easy duplication:

**Name:** Job Club Personalized Onboarding

**Trigger:** Webhook by Zapier
- Receives: memberId, name, email, linkedinUrl, githubUrl, portfolioUrl, calendlyUrl, careerGoal

**Actions:**
1. Code by Zapier (identify missing assets)
2. Formatter (build email content)
3. Gmail (send email)
4. Discord (post intro message)
5. Airtable (log submission - optional)

---

## Troubleshooting

### Email not sending
- Check ZAPIER_ONBOARDING_WEBHOOK is correct
- Verify Zapier zap is active (toggle on)
- Check email formatter for syntax errors
- Review Zapier execution history

### Discord message not posting
- Verify DISCORD_WEBHOOK_URL is correct
- Check webhook belongs to correct channel
- Ensure bot has message permissions
- Review Discord audit log

### Missing assets not detected
- Verify form is capturing all URLs
- Check null/empty string handling in formatter
- Test with sample data in Zapier

---

## Next Steps

1. **Set up Zapier account** if you don't have one
2. **Create the webhook** and add to `.env.local`
3. **Test with sample submission**
4. **Monitor logs** for errors
5. **Iterate on email template** based on feedback

---

## Resources

- [Zapier Documentation](https://zapier.com/help)
- [Discord Webhooks](https://discord.com/developers/docs/resources/webhook)
- [Email Template Examples](https://www.campaignmonitor.com/email-templates/)

