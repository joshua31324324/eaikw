# Job Club Automation Implementation Checklist

## Phase 1: Code Implementation ✅ COMPLETE

- [x] Create `src/lib/checklistGenerator.js`
  - [x] `analyzeMemberProfile()` - detect missing assets
  - [x] `calculateCompletionTime()` - estimate time needed
  - [x] `generateChecklist()` - create personalized tasks
  - [x] `getCareerSpecificTasks()` - career path guidance
  - [x] `formatChecklistForEmail()` - HTML formatting

- [x] Update `src/api/routes.js`
  - [x] Import ChecklistGenerator
  - [x] Call `analyzeMemberProfile()` after creating member
  - [x] Add `triggerZapierAutomation()` function
  - [x] Fire webhook with personalized data (non-blocking)
  - [x] Return member ID + personalization data

- [x] Enhance `src/lib/discordIntegration.js`
  - [x] Discord integration already posts to webhook
  - [x] Already has `postIntroduction()` method
  - [x] Ready for #jobclub-intros channel

---

## Phase 2: Environment Setup ⏳ IN PROGRESS

### 2.1: Zapier Setup
- [ ] Create Zapier account (zapier.com)
- [ ] Create new Zap
  - [ ] Trigger: "Webhooks by Zapier" → "Catch Raw Hook"
  - [ ] Copy webhook URL
- [ ] Add to `.env.local`:
  ```env
  ZAPIER_ONBOARDING_WEBHOOK=https://hooks.zapier.com/hooks/catch/YOUR_ID/YOUR_TOKEN/
  ```
- [ ] Test webhook with curl or Postman

### 2.2: Email Service Setup
Choose one:

#### Option A: Gmail (if volume < 500/day)
- [ ] Gmail account set up with jobclub@njit.edu address
- [ ] In Zapier, add action: Gmail → Send Email
- [ ] Authenticate Gmail account to Zapier
- [ ] Test sending

#### Option B: SendGrid (Recommended)
- [ ] Create free SendGrid account (100 emails/day)
- [ ] Get API key
- [ ] In Zapier, add action: SendGrid → Send Email
- [ ] Add email verification for jobclub@njit.edu
- [ ] Test sending

#### Option C: Make.com Alternative
- [ ] Create Make account
- [ ] Build scenario with HTTP webhook trigger
- [ ] Connect email service
- [ ] Test workflow

### 2.3: Discord Setup
- [ ] Verify Discord server exists
- [ ] Create #jobclub-intros channel (if not exists)
- [ ] Create Discord bot (Discord Developer Portal)
- [ ] Get bot token
- [ ] Get webhook URL for main channel
- [ ] Add to `.env.local`:
  ```env
  DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_ID/YOUR_TOKEN
  DISCORD_INTRO_CHANNEL_ID=YOUR_CHANNEL_ID
  ```
- [ ] Give bot permissions to post messages
- [ ] Test webhook manually

---

## Phase 3: Zapier Workflow Configuration ⏳ NEXT

### 3.1: Zapier Zap Setup
- [ ] Create new Zap named "Job Club Personalized Onboarding"
- [ ] **Trigger:** Webhooks by Zapier (Raw Hook)
  - URL: (from step 2.1)
  - Test trigger (submit form)
- [ ] **Action 1:** Code by Zapier
  - Extract missing assets from webhook data
  - Filter critical vs. recommended
  - Store in variables for email body
- [ ] **Action 2:** Formatter
  - Build email subject
  - Build email body HTML (use template from ZAPIER_EMAIL_SETUP.md)
  - Format checklist items
- [ ] **Action 3:** Email Service (Gmail/SendGrid)
  - To: {{Email}} from webhook
  - Subject: From formatter
  - Body: From formatter (HTML)
  - Enable HTML mode
  - Test send
- [ ] **Action 4:** Discord (Optional)
  - Send message to #jobclub-intros
  - Format: Welcome message with member info

### 3.2: Email Template
- [ ] Copy HTML template from `docs/ZAPIER_EMAIL_SETUP.md`
- [ ] Customize for Job Club branding
- [ ] Add your actual links (Discord, resources, etc.)
- [ ] Add dynamic field mappings ({{Name}}, {{Email}}, etc.)
- [ ] Test with sample data
- [ ] Verify renders correctly in Gmail/Outlook

### 3.3: Discord Webhook
- [ ] Verify webhook URL correct in `.env.local`
- [ ] Test posting manually with curl:
  ```bash
  curl -X POST \
    https://discord.com/api/webhooks/YOUR_ID/YOUR_TOKEN \
    -H 'Content-Type: application/json' \
    -d '{"content":"Test message"}'
  ```
- [ ] Verify message appears in channel

---

## Phase 4: Testing ⏳ TODO

### 4.1: Unit Tests
- [ ] Test ChecklistGenerator.analyzeMemberProfile()
  - [ ] Missing all assets
  - [ ] Missing some assets
  - [ ] Missing none (all set)
  - [ ] Different career goals
- [ ] Test calculateCompletionTime()
  - [ ] 0 critical items
  - [ ] 1 critical item
  - [ ] All items
- [ ] Test getCareerSpecificTasks() for each goal
  - [ ] ai-engineer
  - [ ] data-scientist
  - [ ] product-manager
  - [ ] ai-consultant
  - [ ] ai-startup

### 4.2: Integration Tests
- [ ] Submit onboarding form with:
  - [ ] No URLs (all assets missing)
  - [ ] Some URLs (partial assets)
  - [ ] All URLs (all assets present)
  - [ ] Different career goals
- [ ] Verify in local dev:
  - [ ] [ ] Member created in Sanity (check studio)
  - [ ] [ ] Entry synced to Notion (check database)
  - [ ] [ ] Webhook triggered (check Zapier history)
  - [ ] [ ] Email sent (check inbox)
  - [ ] [ ] Discord welcome message posted
  - [ ] [ ] Discord intro message posted

### 4.3: End-to-End Tests
- [ ] Submit form → Receive email within 5 minutes
- [ ] Email contains:
  - [ ] Personalized greeting with name
  - [ ] Career goal mentioned
  - [ ] Only MISSING assets listed
  - [ ] Critical items marked clearly
  - [ ] Correct estimated time
  - [ ] Working guide/template links
  - [ ] Career-specific tasks
  - [ ] Discord server link
  - [ ] Resources link
- [ ] Discord messages:
  - [ ] Welcome message posts to main channel
  - [ ] Intro message posts to #jobclub-intros
  - [ ] Shows name, major, career goal
  - [ ] Links are clickable

### 4.4: Error Cases
- [ ] Form submission with invalid email
- [ ] Zapier webhook down (graceful failure)
- [ ] Email service rate limit (don't block response)
- [ ] Discord webhook fails (don't block response)
- [ ] Missing environment variables (warning logged)

---

## Phase 5: Deployment ⏳ TODO

### 5.1: Staging Environment
- [ ] Deploy to staging URL (Netlify preview or similar)
- [ ] Add ZAPIER_ONBOARDING_WEBHOOK to staging .env
- [ ] Add Discord webhook to staging .env
- [ ] Test full flow in staging
- [ ] Verify emails send to test address

### 5.2: Production Deployment
- [ ] Add ZAPIER_ONBOARDING_WEBHOOK to production .env
- [ ] Add Discord webhook to production .env
- [ ] Deploy to production
- [ ] Test with real student submission
- [ ] Monitor logs for errors
- [ ] Verify email arrives

### 5.3: Monitoring
- [ ] Check Zapier execution history daily
- [ ] Monitor email bounce rates
- [ ] Track Discord message posting
- [ ] Set up alerts for failures
- [ ] Log webhook responses

---

## Phase 6: Optimization ⏳ TODO

### 6.1: Performance
- [ ] Verify webhook doesn't slow down form submission
- [ ] Implement response queuing if needed
- [ ] Cache career-specific content
- [ ] Optimize email template size

### 6.2: Email Delivery
- [ ] Configure SPF/DKIM/DMARC records
- [ ] Set up bounce handling
- [ ] Monitor unsubscribe rates
- [ ] A/B test email templates

### 6.3: User Experience
- [ ] Add success confirmation to form
- [ ] Show estimated email delivery time
- [ ] Allow manual checklist re-generation
- [ ] Add "Resend Email" option in account

---

## Phase 7: Future Enhancements ⏳ BACKLOG

- [ ] SMS reminders for incomplete assets
- [ ] Discord @Member role assignment
- [ ] Automated follow-up emails (3 days, 1 week)
- [ ] Calendar invite for first Job Club event
- [ ] Slack integration as alternative to Discord
- [ ] Personalized resource recommendations
- [ ] Alumni/mentor matching based on profile
- [ ] Weekly digest of new resources
- [ ] Event recommendations based on career goal

---

## Documentation

- [x] `docs/AUTOMATION_SETUP.md` - Overview and concepts
- [x] `docs/ZAPIER_EMAIL_SETUP.md` - Email template and configuration
- [ ] `docs/DISCORD_SETUP.md` - Discord webhook configuration (TODO)
- [ ] API documentation with example payloads
- [ ] Troubleshooting guide
- [ ] Runbook for manual interventions

---

## Current Status

**Completed:**
✅ ChecklistGenerator logic created
✅ API integration added
✅ Automation documentation written
✅ Email templates designed

**In Progress:**
⏳ Zapier webhook setup
⏳ Email service configuration
⏳ Testing automation

**To Do:**
⏳ Production deployment
⏳ Monitoring setup
⏳ Optimization

---

## Quick Reference

### Environment Variables Required
```env
# Zapier
ZAPIER_ONBOARDING_WEBHOOK=https://hooks.zapier.com/hooks/catch/.../

# Discord
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/.../
DISCORD_INTRO_CHANNEL_ID=...

# Existing (for context)
SANITY_PROJECT_ID=...
SANITY_WRITE_TOKEN=...
NOTION_API_KEY=...
NOTION_DATABASE_ID=...
```

### Key Files
- `src/lib/checklistGenerator.js` - Main logic
- `src/api/routes.js` - API integration
- `src/lib/discordIntegration.js` - Discord posts
- `docs/AUTOMATION_SETUP.md` - How it works
- `docs/ZAPIER_EMAIL_SETUP.md` - Email template

### Testing Quick Command
```bash
# Test form submission
curl -X POST http://localhost:3000/api/onboarding \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@njit.edu",
    "major": "CS",
    "graduationYear": 2025,
    "careerGoal": "ai-engineer"
  }'
```

---

## Notes

- Zapier webhook is non-blocking - form submission won't wait for email
- Email takes 1-5 minutes to arrive
- Discord posts are synchronous - will block if Discord is down (add error handling if needed)
- ChecklistGenerator doesn't need external dependencies - pure JS
- All personalization happens server-side before Zapier

