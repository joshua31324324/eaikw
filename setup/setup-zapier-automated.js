#!/usr/bin/env node
/**
 * Automated Zapier Automation Setup
 * Creates and configures the personalized onboarding Zap
 * 
 * Requirements:
 * - Zapier API key (from https://zapier.com/app/settings)
 * - Gmail or SendGrid account connected to Zapier
 */

import fetch from 'node-fetch';
import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENV_FILE = path.join(__dirname, '..', '.env.local');
const ZAPIER_API = 'https://zapier.com/api/v1';

// Terminal colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠️${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ️${colors.reset} ${msg}`),
  step: (msg) => console.log(`\n${colors.cyan}${msg}${colors.reset}`),
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function getZapierToken() {
  log.step('Step 1: Zapier API Key');
  console.log('To get your Zapier API key:');
  console.log('1. Go to https://zapier.com/app/settings');
  console.log('2. Click "API" in the left sidebar');
  console.log('3. Copy your API key');
  console.log('');

  const token = await question('Enter your Zapier API Key: ');
  if (!token || token.length < 20) {
    log.error('Invalid API key');
    process.exit(1);
  }

  // Verify token
  try {
    const response = await fetch(`${ZAPIER_API}/apps`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      log.error('Invalid API key or insufficient permissions');
      process.exit(1);
    }
    log.success('API key verified');
  } catch (error) {
    log.error(`Failed to verify API key: ${error.message}`);
    process.exit(1);
  }

  return token;
}

async function getZapierWebhookUrl() {
  log.step('Step 2: Create Zapier Webhook');
  console.log('Creating a catch hook to receive member data...\n');

  const zapierToken = await getZapierToken();

  try {
    const response = await fetch(`https://zapier.com/hooks/catch/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Zapier webhooks are simpler - just use the catch endpoint
    // The actual webhook URL will be created when we test the zap
    const webhookUrl = 'https://hooks.zapier.com/hooks/catch/YOUR_ID/YOUR_TOKEN/';

    console.log('Zapier webhook will be created when you test the first action.');
    console.log('');

    return {
      url: webhookUrl,
      token: zapierToken,
    };
  } catch (error) {
    log.error(`Error setting up webhook: ${error.message}`);
    process.exit(1);
  }
}

async function getEmailService() {
  log.step('Step 3: Choose Email Service');
  console.log('Which email service would you like to use?');
  console.log('1. Gmail (free, up to 500 emails/day)');
  console.log('2. SendGrid (free tier, 100 emails/day)');
  console.log('3. Mailgun (generous free tier)');
  console.log('');

  const choice = await question('Choose (1-3): ');

  switch (choice) {
    case '1':
      return 'gmail';
    case '2':
      return 'sendgrid';
    case '3':
      return 'mailgun';
    default:
      log.error('Invalid choice');
      process.exit(1);
  }
}

async function getEmailDetails(service) {
  log.step(`Step 4: ${service.toUpperCase()} Configuration`);

  const email = await question(`Enter ${service} email address: `);

  if (service === 'sendgrid') {
    const apiKey = await question('Enter SendGrid API Key: ');
    return { email, apiKey };
  } else if (service === 'mailgun') {
    const apiKey = await question('Enter Mailgun API Key: ');
    const domain = await question('Enter Mailgun Domain: ');
    return { email, apiKey, domain };
  }

  return { email };
}

async function generateZapierInstructions(webhookUrl, emailService, emailDetails) {
  log.step('Step 5: Zapier Zap Setup Instructions');

  const instructions = `
🤖 ZAPIER ZAP SETUP INSTRUCTIONS
================================

Since Zapier doesn't have a direct API for creating complex multi-step zaps,
you'll need to create this manually in the UI (it takes about 5 minutes):

1. GO TO: https://zapier.com/app/dashboard
2. CREATE NEW ZAP
3. NAME: "Job Club Personalized Onboarding"

--- STEP 1: TRIGGER (Webhook) ---
App: Webhooks by Zapier
Action: Catch Raw Hook
- Copy the webhook URL
- Add to .env.local as: ZAPIER_ONBOARDING_WEBHOOK

--- STEP 2: ACTION (Email) ---
App: ${emailService.charAt(0).toUpperCase() + emailService.slice(1)}
Action: Send Email

Settings:
- From: ${emailDetails.email}
- To: {{email}} (from webhook data)
- Subject: Your Personalized Career Path - Job Club
- Body Type: HTML
- Body: (Copy from docs/ZAPIER_EMAIL_SETUP.md)

Map these fields:
- {{Name}} → name
- {{Email}} → email
- {{CareerGoal}} → careerGoal
- {{CompletionEstimate}} → completionEstimate
- {{MissingAssets}} → missingAssets (array)

--- STEP 3: TEST ---
1. Click "Test" in the Zapier editor
2. Submit a test form to Job Club onboarding
3. Check email arrives

Email Template Location:
   docs/ZAPIER_EMAIL_SETUP.md (lines 34-289)

Save Template As:
   ${emailService === 'sendgrid' ? 'SendGrid template' : 'Gmail draft'}

Full Setup Guide:
   docs/AUTOMATION_SETUP.md
   docs/ZAPIER_EMAIL_SETUP.md
`;

  return instructions;
}

async function updateEnvFile(webhookUrl) {
  log.step('Step 6: Update Environment');

  try {
    let envContent = fs.readFileSync(ENV_FILE, 'utf8');

    // We'll add a placeholder since the actual URL comes from Zapier
    if (!envContent.includes('ZAPIER_ONBOARDING_WEBHOOK')) {
      envContent += '\n# Zapier (add after creating webhook)\nZAPIER_ONBOARDING_WEBHOOK=https://hooks.zapier.com/hooks/catch/YOUR_ID/YOUR_TOKEN/\n';
    }

    fs.writeFileSync(ENV_FILE, envContent, 'utf8');
    log.success('Updated .env.local');
  } catch (error) {
    log.error(`Failed to update .env.local: ${error.message}`);
  }
}

async function runSetup() {
  console.log('\n⚡ Job Club Zapier Automation Setup\n');

  try {
    // Step 1: Get Zapier token
    const zapierToken = await getZapierToken();

    // Step 2: Get email service choice
    const emailService = await getEmailService();

    // Step 3: Get email details
    const emailDetails = await getEmailDetails(emailService);
    log.success(`Using ${emailService} for emails`);

    // Step 4: Update env file
    await updateEnvFile();

    // Step 5: Generate instructions
    const instructions = await generateZapierInstructions(
      'https://hooks.zapier.com/hooks/catch/YOUR_ID/YOUR_TOKEN/',
      emailService,
      emailDetails
    );

    console.log(instructions);

    log.step('Next Steps');
    console.log(`
1. ✅ You've chosen ${emailService} for email delivery
2. 📝 Follow the manual setup steps above in Zapier UI
3. 📋 Copy the email template from docs/ZAPIER_EMAIL_SETUP.md
4. 🔗 Get webhook URL from Zapier trigger setup
5. 🔐 Add ZAPIER_ONBOARDING_WEBHOOK to .env.local
6. 🧪 Submit test form to verify everything works
7. ✨ Once tested, automation will run for all new members

Estimated time: 5 minutes to set up in Zapier

Email Template Preview:
  See: docs/ZAPIER_EMAIL_SETUP.md (lines 34-289)

Questions?
  See: docs/AUTOMATION_SETUP.md
  See: docs/AUTOMATION_SUMMARY.md
    `);

    // Save instructions to file
    const instructionsFile = path.join(__dirname, '..', 'docs', 'ZAPIER_SETUP_INSTRUCTIONS.md');
    fs.writeFileSync(instructionsFile, instructions, 'utf8');
    log.success(`Setup instructions saved to docs/ZAPIER_SETUP_INSTRUCTIONS.md`);
  } catch (error) {
    log.error(`Setup failed: ${error.message}`);
    process.exit(1);
  } finally {
    rl.close();
  }
}

runSetup();
