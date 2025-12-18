#!/usr/bin/env node
/**
 * Automation Test Script
 * Tests Zapier and Discord integration without full form submission
 */

import fetch from 'node-fetch';
import { ChecklistGenerator } from '../src/lib/checklistGenerator.js';
import { ZapierIntegration } from '../src/lib/zapierIntegration.js';
import { DiscordIntegrationHelper } from '../src/lib/discordHelper.js';

const args = process.argv.slice(2);
const command = args[0] || 'test-all';

// Test data
const testMember = {
  _id: 'test-' + Date.now(),
  name: 'Test Student',
  email: 'test@njit.edu',
  major: 'Computer Science',
  graduationYear: 2025,
  careerGoal: 'ai-engineer',
  linkedinUrl: 'https://linkedin.com/in/test',
  githubUrl: null,
  portfolioUrl: null,
  calendlyUrl: null,
};

async function testChecklist() {
  console.log('🧪 Testing Checklist Generator...\n');

  const analysis = ChecklistGenerator.analyzeMemberProfile(testMember);

  console.log('📋 Checklist Analysis:');
  console.log(`  Name: ${analysis.name}`);
  console.log(`  Email: ${analysis.email}`);
  console.log(`  Career Goal: ${analysis.careerGoal}`);
  console.log(`  Missing Assets: ${analysis.missingAssets.length}`);
  console.log(`  Completion Time: ${analysis.completionEstimate}`);

  console.log('\n🔴 Critical Assets:');
  analysis.missingAssets
    .filter((a) => a.priority === 'critical')
    .forEach((a) => {
      console.log(`  - ${a.asset} (${a.estimatedTime})`);
    });

  console.log('\n🟡 Recommended Assets:');
  analysis.missingAssets
    .filter((a) => a.priority === 'recommended')
    .forEach((a) => {
      console.log(`  - ${a.asset} (${a.estimatedTime})`);
    });

  console.log('\n✅ Checklist generator working!\n');
  return analysis;
}

async function testZapier(analysis) {
  console.log('🧪 Testing Zapier Integration...\n');

  const zapier = new ZapierIntegration();

  if (!process.env.ZAPIER_ONBOARDING_WEBHOOK) {
    console.log('⚠️  ZAPIER_ONBOARDING_WEBHOOK not configured');
    console.log('   Add to .env.local to test webhook trigger');
    return;
  }

  console.log('📤 Sending test payload to Zapier...');
  const result = await zapier.triggerOnboarding(testMember, analysis);

  if (result && result.queued) {
    console.log('✅ Zapier webhook queued!');
    console.log('   Check your Zapier dashboard for execution');
  } else {
    console.log('⚠️  Could not connect to Zapier');
    console.log('   Webhook URL may be invalid');
  }

  console.log('\n📧 Email Preview:');
  const preview = zapier.generateEmailPreview(testMember, analysis);
  console.log(preview);
  console.log('\n');
}

async function testDiscord() {
  console.log('🧪 Testing Discord Integration...\n');

  const discord = new DiscordIntegrationHelper();

  if (!process.env.DISCORD_WEBHOOK_URL) {
    console.log('⚠️  DISCORD_WEBHOOK_URL not configured');
    console.log('   Add to .env.local to test Discord integration');
    return;
  }

  console.log('📨 Testing Discord intro embed...');

  try {
    const result = await discord.postIntroduction(testMember);
    if (result && result.id) {
      console.log('✅ Discord intro posted successfully!');
      console.log(`   Message ID: ${result.id}`);
      console.log('   Check your Discord #jobclub-intros channel');
    } else {
      console.log('⚠️  Discord post may have failed');
      console.log('   Check webhook URL and permissions');
    }
  } catch (error) {
    console.log('❌ Discord error:', error.message);
  }

  console.log('\n');
}

async function testAll() {
  console.log('🚀 Job Club Automation Test Suite\n');
  console.log('Testing with sample member:');
  console.log(`  Name: ${testMember.name}`);
  console.log(`  Email: ${testMember.email}`);
  console.log(`  Career Goal: ${testMember.careerGoal}`);
  console.log('\n' + '='.repeat(50) + '\n');

  const analysis = await testChecklist();
  await testZapier(analysis);
  await testDiscord();

  console.log('='.repeat(50));
  console.log('\n📋 Test Summary\n');
  console.log('✅ Checklist Generator: Working');
  console.log(`${process.env.ZAPIER_ONBOARDING_WEBHOOK ? '✅' : '⚠️'} Zapier: ${process.env.ZAPIER_ONBOARDING_WEBHOOK ? 'Configured' : 'Not configured'}`);
  console.log(`${process.env.DISCORD_WEBHOOK_URL ? '✅' : '⚠️'} Discord: ${process.env.DISCORD_WEBHOOK_URL ? 'Configured' : 'Not configured'}`);

  console.log('\n📝 Next Steps:\n');
  if (!process.env.ZAPIER_ONBOARDING_WEBHOOK) {
    console.log('1. Set up Zapier webhook:');
    console.log('   - Go to zapier.com and create a new Zap');
    console.log('   - Use "Webhooks by Zapier" trigger');
    console.log('   - Copy webhook URL to ZAPIER_ONBOARDING_WEBHOOK in .env.local');
  }

  if (!process.env.DISCORD_WEBHOOK_URL) {
    console.log('2. Set up Discord webhook:');
    console.log('   - Run: bash scripts/setup-discord.sh');
    console.log('   - Follow the prompts');
  }

  console.log('\n3. Submit the onboarding form to test the full flow');
  console.log('4. Check for email and Discord messages within 5 minutes');
}

// Run tests
const runTests = async () => {
  try {
    switch (command) {
      case 'checklist':
        await testChecklist();
        break;
      case 'zapier':
        const analysis = await testChecklist();
        await testZapier(analysis);
        break;
      case 'discord':
        await testDiscord();
        break;
      case 'test-all':
      case 'all':
        await testAll();
        break;
      default:
        console.log('Usage: node test-automation.js [checklist|zapier|discord|test-all]');
        console.log('\nExamples:');
        console.log('  node setup/test-automation.js checklist');
        console.log('  node setup/test-automation.js zapier');
        console.log('  node setup/test-automation.js discord');
        console.log('  node setup/test-automation.js test-all');
    }
  } catch (error) {
    console.error('❌ Test error:', error.message);
    process.exit(1);
  }
};

runTests();
