# Zapier One-Click Setup

Complete automation is configured in your `./.env.local` (not committed to git for security).

## What's Ready Now

✅ **Discord Integration**: Fully configured in code
- Bot token set
- Server ID set
- Intro channel ID set
- Member role ID set
- Webhook ready to receive messages

✅ **Zapier Webhook**: Active and receiving data
- URL: `https://hooks.zapier.com/hooks/catch/25750261/ua9wkj7/`
- Receives member data on form submission
- Ready for email automation

✅ **Code Integration**: Complete
- `src/lib/discordHelper.js` - Discord API integration
- `src/lib/zapierIntegration.js` - Webhook trigger
- `src/api/routes.js` - Both integrated in onboarding flow
- `src/lib/checklistGenerator.js` - Personalized checklist logic

## Next: Create Zapier Zap for Email

To send personalized emails, you need to create ONE Zapier Zap:

1. Go to: https://zapier.com/app/editor
2. Create new Zap called "Job Club Personalized Onboarding"
3. **Trigger**: Webhooks by Zapier → Catch Raw Hook
   - Paste this URL: `https://hooks.zapier.com/hooks/catch/25750261/ua9wkj7/`
4. **Action 1**: Formatter → Text
   - Format the email body using template from `docs/ZAPIER_EMAIL_SETUP.md` (lines 34-289)
5. **Action 2**: Gmail/SendGrid → Send Email
   - To: `{{email}}`
   - Subject: `Your Personalized Career Path - Job Club`
   - Body: Use formatted output from Action 1
6. **Action 3** (Optional): Discord → Send Channel Message
   - To: Your #jobclub-intros webhook
   - Message: Intro message

That's it! When students submit the form, they'll automatically get:
- Email with personalized checklist
- Discord intro message
- Profile saved in Sanity + Notion

## Test It

Submit the onboarding form with test data:
- Name: Test Student
- Email: your-email@test.com
- Missing some URLs to trigger checklist generation

You'll receive:
1. Email within 5 minutes
2. Discord message immediately
3. Member profile in Sanity

## Email Template

Copy this into your Zapier Zap:
See: `docs/ZAPIER_EMAIL_SETUP.md` (lines 34-289)

It includes:
- Personalized greeting
- Missing assets checklist (critical + recommended)
- Career-specific guidance
- Resource links
- FAQ section
- Call-to-action buttons

## Already Configured

Your `.env.local` has all Discord and Zapier credentials set (not committed to git for security).

Just need to create the Zapier Zap for email automation!

## Questions?

See these docs:
- `docs/AUTOMATION_SETUP.md` - Full overview
- `docs/AUTOMATION_SUMMARY.md` - What's included
- `docs/ZAPIER_EMAIL_SETUP.md` - Email template
