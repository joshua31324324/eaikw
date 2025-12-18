# Zapier Configuration for Job Club Automation

## Quick Start

### 1. Get Zapier Webhook URL
1. Go to **zapier.com** and log in
2. Create new Zap
3. **Trigger:** Select "Webhooks by Zapier" → "Catch Raw Hook"
4. Copy the webhook URL
5. Add to `.env.local`: `ZAPIER_ONBOARDING_WEBHOOK=https://hooks.zapier.com/hooks/catch/YOUR_ID/YOUR_TOKEN/`

### 2. Set Up Email Action
In your Zapier Zap, add **Gmail** or **Outlook** action:
- **To:** Use field `Email` from webhook data
- **Subject:** Use formatter (see below)
- **Body:** Use HTML formatter (see below)

### 3. Test
Submit onboarding form in Job Club, verify email arrives.

---

## Email Template

### Subject Line Formatter

```
Your Personalized Career Path - Job Club
```

### Email Body (HTML)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      padding: 20px;
      border-radius: 8px;
    }
    .header {
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: white;
      padding: 30px;
      border-radius: 8px;
      text-align: center;
      margin-bottom: 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .section {
      margin: 20px 0;
      padding: 15px;
      background: #f9fafb;
      border-radius: 8px;
      border-left: 4px solid #6366f1;
    }
    .section h2 {
      color: #6366f1;
      margin-top: 0;
      font-size: 18px;
    }
    .asset-item {
      margin: 10px 0;
      padding: 10px;
      background: white;
      border-radius: 4px;
    }
    .asset-priority-critical {
      border-left: 3px solid #dc2626;
    }
    .asset-priority-recommended {
      border-left: 3px solid #f59e0b;
    }
    .priority-label {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 12px;
      font-weight: bold;
      margin-right: 5px;
    }
    .priority-critical {
      background: #fee2e2;
      color: #dc2626;
    }
    .priority-recommended {
      background: #fef3c7;
      color: #92400e;
    }
    .cta-button {
      display: inline-block;
      background: #6366f1;
      color: white;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 4px;
      margin: 5px 5px 5px 0;
      font-weight: bold;
    }
    .cta-button:hover {
      background: #4f46e5;
    }
    .checklist-item {
      margin: 8px 0;
      padding: 8px;
      background: white;
      border-radius: 4px;
      border-left: 3px solid #10b981;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 12px;
      color: #999;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Welcome to Job Club!</h1>
      <p>Your personalized career path is ready</p>
    </div>

    <div style="margin: 20px 0;">
      <p>Hi <strong>{{Name}}</strong>,</p>
      <p>Welcome to the NJIT Job Club community! We're thrilled to have you join us as you pursue your career in <strong>{{CareerGoal}}</strong>.</p>
      
      <p>Based on your onboarding responses, we've created a personalized action plan to help you succeed. Here's what we found:</p>
    </div>

    <!-- Professional Assets Section -->
    <div class="section">
      <h2>📋 Your Professional Assets Checklist</h2>
      <p><strong>Estimated completion time: {{CompletionEstimate}}</strong></p>

      <h3 style="color: #dc2626; margin: 15px 0 10px 0;">🔴 Critical Assets (Do ASAP)</h3>
      <div style="margin-bottom: 15px;">
        {{#MissingAssetsCritical}}
        <div class="asset-item asset-priority-critical">
          <strong>{{Asset}}</strong> 
          <span class="priority-label priority-critical">CRITICAL</span>
          <br>
          <small style="color: #666;">{{Description}}</small>
          <br>
          <small style="color: #999;">⏱️ {{EstimatedTime}}</small>
          <br>
          <a href="{{Guide}}" style="color: #6366f1; text-decoration: none; font-weight: bold;">→ View Step-by-Step Guide</a>
        </div>
        {{/MissingAssetsCritical}}
      </div>

      {{#MissingAssetsRecommended}}
      <h3 style="color: #f59e0b; margin: 15px 0 10px 0;">🟡 Recommended Assets (This Week)</h3>
      <div>
        {{#.}}
        <div class="asset-item asset-priority-recommended">
          <strong>{{Asset}}</strong>
          <span class="priority-label priority-recommended">RECOMMENDED</span>
          <br>
          <small style="color: #666;">{{Description}}</small>
          <br>
          <small style="color: #999;">⏱️ {{EstimatedTime}}</small>
          <br>
          <a href="{{Guide}}" style="color: #6366f1; text-decoration: none; font-weight: bold;">→ View Setup Guide</a>
        </div>
        {{/.}}
      </div>
      {{/MissingAssetsRecommended}}
    </div>

    <!-- Your Next Steps Section -->
    <div class="section">
      <h2>🎯 Your Next Steps</h2>
      
      <div class="checklist-item">
        <strong>1. Complete Your Missing Assets</strong>
        <br>
        <small>Start with critical items above. Most take 30-60 minutes total.</small>
      </div>

      <div class="checklist-item">
        <strong>2. Join Our Discord Community</strong>
        <br>
        <a href="{{DiscordServerLink}}" class="cta-button">Join Discord →</a>
        <br>
        <small>Connect with peers, ask questions, find mentors</small>
      </div>

      <div class="checklist-item">
        <strong>3. Introduce Yourself</strong>
        <br>
        <small>Post in #introductions to get to know the community</small>
      </div>

      <div class="checklist-item">
        <strong>4. Attend Your First Event</strong>
        <br>
        <a href="https://jobclub.njit.edu/events" class="cta-button">View Events →</a>
        <br>
        <small>Workshops, networking, office hours, and more</small>
      </div>
    </div>

    <!-- Career-Specific Guidance -->
    {{#CareerSpecificTasks}}
    <div class="section">
      <h2>🚀 {{CareerPath}} Path</h2>
      <p>To accelerate your progress toward {{CareerPath}}, we recommend:</p>
      
      {{#Tasks}}
      <div class="checklist-item">
        <strong>{{TaskName}}</strong>
        <br>
        <small>{{TaskDescription}}</small>
        <br>
        <a href="{{TaskGuide}}" style="color: #6366f1; font-weight: bold;">Learn more →</a>
      </div>
      {{/Tasks}}
    </div>
    {{/CareerSpecificTasks}}

    <!-- Resources Section -->
    <div class="section">
      <h2>📚 Your Personalized Resources</h2>
      
      <p>We've curated resources specifically for {{CareerGoal}} professionals:</p>
      
      <ul style="margin: 15px 0;">
        <li><a href="https://jobclub.njit.edu/resources#{{CareerGoal}}" style="color: #6366f1; font-weight: bold;">Career Path Guide</a> - Your step-by-step roadmap</li>
        <li><a href="https://jobclub.njit.edu/resources#interview-prep" style="color: #6366f1; font-weight: bold;">Interview Preparation</a> - AI company interview tips</li>
        <li><a href="https://jobclub.njit.edu/resources#networking" style="color: #6366f1; font-weight: bold;">Networking Guide</a> - How to build professional relationships</li>
        <li><a href="https://jobclub.njit.edu/resources#portfolio" style="color: #6366f1; font-weight: bold;">Portfolio Examples</a> - See what works in your field</li>
      </ul>
    </div>

    <!-- FAQ Section -->
    <div class="section">
      <h2>❓ FAQ</h2>
      
      <p><strong>Q: When do I need to complete these assets?</strong></p>
      <p>A: Critical assets should be done ASAP (this week if possible). Recommended items can be done over the next month. Start with LinkedIn and GitHub - they open the most doors.</p>
      
      <p><strong>Q: What if I don't have experience to show yet?</strong></p>
      <p>A: That's okay! Use the resources we provided. Build small projects, contribute to open source, or start a learning blog. Quality > Quantity.</p>
      
      <p><strong>Q: How can I get help?</strong></p>
      <p>A: Ask in Discord #help channel, or schedule a mentor session with our team. We're here to help!</p>
    </div>

    <!-- Call to Action -->
    <div style="text-align: center; margin: 30px 0;">
      <p style="font-size: 18px; margin-bottom: 15px;">Ready to level up your career?</p>
      <a href="https://jobclub.njit.edu" class="cta-button" style="font-size: 16px; padding: 12px 24px;">Visit Job Club →</a>
    </div>

    <div class="footer">
      <p>Job Club • NJIT AI Career Accelerator</p>
      <p>Questions? Email us at jobclub@njit.edu or join our Discord community</p>
      <p style="margin-top: 10px; color: #bbb;">
        <a href="https://jobclub.njit.edu/privacy" style="color: #999; text-decoration: none;">Privacy Policy</a> • 
        <a href="https://jobclub.njit.edu" style="color: #999; text-decoration: none;">Website</a>
      </p>
    </div>
  </div>
</body>
</html>
```

---

## Zapier Data Mapping

The webhook sends this data structure:

```json
{
  "memberId": "abc123...",
  "name": "John Smith",
  "email": "john@njit.edu",
  "careerGoal": "ai-engineer",
  "missingAssets": [
    {
      "asset": "LinkedIn Profile",
      "priority": "critical",
      "guide": "/resources#linkedin-guide",
      "estimatedTime": "20-30 minutes",
      "description": "Professional network profile with your career path and skills"
    }
  ],
  "completionEstimate": "About 45 minutes",
  "majorSpecificTasks": {
    "urgent": [...],
    "thisWeek": [...],
    "thisMonth": [...],
    "longTerm": [...]
  }
}
```

### Map to Email Template

In Zapier Formatter, use:
- `{{Name}}` → member name
- `{{Email}}` → member email
- `{{CareerGoal}}` → career goal
- `{{CompletionEstimate}}` → estimated time
- `{{MissingAssetsCritical}}` → critical items array
- `{{MissingAssetsRecommended}}` → recommended items array

---

## Alternative: Use Make.com

If you prefer Make.com instead of Zapier:

1. Go to **make.com** and create account
2. Create new scenario
3. **Trigger:** HTTP → Make a request
   - Method: `POST`
   - URL: `https://hooks.zapier.com/...` (from Zapier)
4. **Action:** Send Email
5. Map the same fields

---

## Gmail Setup in Zapier

### If Using Gmail:
1. In Zapier, select **Gmail** → **Send Email**
2. **From:** jobclub@njit.edu (must be configured in your Gmail)
3. **To:** `{{Email}}`
4. **Subject:** `Your Personalized Career Path - Job Club`
5. **Body Type:** HTML
6. **Body:** Paste HTML template above
7. Test sending

### Gmail Limitations:
- Free Gmail accounts may have sending limits (100-500/day)
- Consider using **SendGrid** or **Mailgun** for higher volume
- Job Club will likely exceed free Gmail limits once active

### Better: Use SendGrid

1. Get free **SendGrid** account (100 emails/day free)
2. In Zapier, select **SendGrid** → **Send Email**
3. Easier to manage templates and bounce handling

---

## Discord Integration in Zapier

Optional: Also post to Discord when member onboards.

1. Add action: **Discord** → **Send Channel Message**
2. **Channel:** #jobclub-intros
3. **Message:** Build with formatter
   ```
   👋 **{{Name}}** from {{CareerGoal}} just joined Job Club!
   ```

---

## Testing

### Test Data
```json
{
  "memberId": "test-123",
  "name": "Test Student",
  "email": "test@njit.edu",
  "careerGoal": "ai-engineer",
  "missingAssets": [
    {
      "asset": "LinkedIn Profile",
      "priority": "critical",
      "guide": "/resources#linkedin",
      "estimatedTime": "30 minutes",
      "description": "Your professional profile"
    },
    {
      "asset": "GitHub Portfolio",
      "priority": "critical",
      "guide": "/resources#github",
      "estimatedTime": "45 minutes",
      "description": "Your coding portfolio"
    }
  ],
  "completionEstimate": "About 45 minutes"
}
```

### Test Flow:
1. In Zapier, use **Test this action**
2. Paste test data above
3. Verify email preview looks good
4. Check actual email inbox
5. Go to Job Club onboarding form and submit real data

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Webhook URL not working | Verify URL copied correctly, no spaces |
| Email not sending | Check Gmail/SendGrid is connected and authenticated |
| Template not rendering | Check variable names match exactly (case-sensitive) |
| Missing fields in email | Verify checkbox "Use custom values" is toggled off |
| Email arrives blank | Check email body HTML is valid, no syntax errors |
| Too many emails sent | Enable Zapier rate limiting (runs per minute) |

---

## Next Steps

1. ✅ Copy Zapier webhook URL
2. ✅ Add to `.env.local` as `ZAPIER_ONBOARDING_WEBHOOK`
3. ✅ Create Zapier Zap with webhook trigger
4. ✅ Add Gmail/SendGrid action with template above
5. ✅ Test with sample submission
6. ✅ Monitor Discord #jobclub-intros for intro messages
7. ✅ Iterate on email template based on feedback

