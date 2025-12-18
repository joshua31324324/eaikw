#!/usr/bin/env node
/**
 * Master Setup Script
 * Runs Discord and Zapier automation setup in sequence
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
};

function runScript(scriptPath, scriptName) {
  return new Promise((resolve, reject) => {
    console.log(`\n${colors.cyan}═══════════════════════════════════${colors.reset}`);
    console.log(`${colors.blue}Running: ${scriptName}${colors.reset}`);
    console.log(`${colors.cyan}═══════════════════════════════════${colors.reset}\n`);

    const child = spawn('node', [scriptPath], {
      stdio: 'inherit',
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${scriptName} exited with code ${code}`));
      }
    });
  });
}

async function main() {
  console.log(`
${colors.green}
████████████████████████████████████████████████████
█ Job Club Automation Setup                        █
█ Discord Bot + Zapier Email Integration          █
████████████████████████████████████████████████████
${colors.reset}

${colors.yellow}What this will do:${colors.reset}
1. Set up your Discord bot (channels, roles, webhooks)
2. Configure Zapier for personalized emails
3. Update your .env.local with all credentials

${colors.yellow}What you'll need:${colors.reset}
✓ Discord bot token (from Discord Developer Portal)
✓ Your server ID
✓ Zapier API key (from zapier.com/app/settings)
✓ Gmail, SendGrid, or Mailgun account

${colors.yellow}Time required:${colors.reset}
Discord setup: 2-3 minutes
Zapier setup: 5 minutes
Total: ~10 minutes

`);

  const args = process.argv.slice(2);
  const skipDiscord = args.includes('--skip-discord');
  const skipZapier = args.includes('--skip-zapier');

  try {
    if (!skipDiscord) {
      await runScript(
        path.join(__dirname, 'setup-discord-automated.js'),
        'Discord Bot Setup'
      );
    }

    if (!skipZapier) {
      await runScript(
        path.join(__dirname, 'setup-zapier-automated.js'),
        'Zapier Automation Setup'
      );
    }

    console.log(`
${colors.green}
████████████████████████████████████████████████████
█ ✅ Setup Complete!                               █
████████████████████████████████████████████████████
${colors.reset}

${colors.cyan}Next Steps:${colors.reset}
1. Check .env.local for all your new credentials
2. Restart the dev server: npm run dev
3. Test by submitting the Job Club onboarding form
4. Verify email arrives (within 5 minutes)
5. Check Discord #jobclub-intros for intro message

${colors.cyan}Quick Reference:${colors.reset}
Discord: Check #jobclub-intros for member intros
Zapier: Check https://zapier.com/app/dashboard for zap history
Email: Check your inbox for personalized onboarding email

${colors.cyan}Troubleshooting:${colors.reset}
- Discord webhook not posting? Check channel permissions
- Email not arriving? Check Zapier zap is turned ON
- Can't connect bot? Make sure bot is invited to server

${colors.cyan}Need Help?${colors.reset}
See these docs:
- docs/AUTOMATION_SETUP.md - Architecture overview
- docs/AUTOMATION_SUMMARY.md - What's included
- docs/ZAPIER_EMAIL_SETUP.md - Email template
- setup/ZAPIER_SETUP_INSTRUCTIONS.md - Detailed Zapier steps

${colors.green}Happy automating! 🚀${colors.reset}
    `);
  } catch (error) {
    console.error(`\n${colors.yellow}❌ Setup failed:${colors.reset}`, error.message);
    process.exit(1);
  }
}

main();
