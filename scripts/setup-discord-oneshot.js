#!/usr/bin/env node
/**
 * One-Shot Discord Setup
 * Creates all Discord infrastructure automatically
 */

import fetch from 'node-fetch';

const API_BASE = 'https://discord.com/api/v10';
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const SERVER_ID = process.env.DISCORD_SERVER_ID;

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠️${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ️${colors.reset} ${msg}`),
};

async function createChannels() {
  log.info('Creating Discord channels...');

  const channels = [
    { name: 'jobclub-intros', topic: 'Introduce yourself to the community!' },
    { name: 'help', topic: 'Ask questions and get help' },
    { name: 'announcements', topic: 'Important announcements' },
  ];

  const created = {};

  for (const channel of channels) {
    try {
      const response = await fetch(`${API_BASE}/guilds/${SERVER_ID}/channels`, {
        method: 'POST',
        headers: {
          Authorization: `Bot ${BOT_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: channel.name,
          type: 0,
          topic: channel.topic,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        created[channel.name] = data.id;
        log.success(`Created #${channel.name}`);
      } else if (response.status === 400) {
        // Likely exists
        const allChannels = await fetch(`${API_BASE}/guilds/${SERVER_ID}/channels`, {
          headers: { Authorization: `Bot ${BOT_TOKEN}` },
        });
        const channels = await allChannels.json();
        const found = channels.find((c) => c.name === channel.name);
        if (found) {
          created[channel.name] = found.id;
          log.warn(`#${channel.name} already exists`);
        }
      } else {
        log.error(`Failed to create #${channel.name}: ${response.statusText}`);
      }
    } catch (error) {
      log.error(`Error creating #${channel.name}: ${error.message}`);
    }
  }

  return created;
}

async function createRole() {
  log.info('Creating @Member role...');

  try {
    const response = await fetch(`${API_BASE}/guilds/${SERVER_ID}/roles`, {
      method: 'POST',
      headers: {
        Authorization: `Bot ${BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Member',
        color: 6366519,
        mentionable: false,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      log.success(`Created @Member role`);
      return data.id;
    } else if (response.status === 400) {
      // Might exist
      const rolesResponse = await fetch(`${API_BASE}/guilds/${SERVER_ID}/roles`, {
        headers: { Authorization: `Bot ${BOT_TOKEN}` },
      });
      const roles = await rolesResponse.json();
      const memberRole = roles.find((r) => r.name === 'Member');
      if (memberRole) {
        log.warn(`@Member role already exists`);
        return memberRole.id;
      }
    }
  } catch (error) {
    log.error(`Error creating role: ${error.message}`);
  }

  return null;
}

async function createWebhook(channelId) {
  log.info('Creating webhook for #jobclub-intros...');

  try {
    const response = await fetch(`${API_BASE}/channels/${channelId}/webhooks`, {
      method: 'POST',
      headers: {
        Authorization: `Bot ${BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Job Club Bot',
      }),
    });

    if (response.ok) {
      const data = await response.json();
      log.success(`Created webhook`);
      return data.url;
    } else {
      log.error(`Failed to create webhook: ${response.statusText}`);
    }
  } catch (error) {
    log.error(`Error creating webhook: ${error.message}`);
  }

  return null;
}

async function testWebhook(webhookUrl) {
  log.info('Testing webhook...');

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: '🤖 Job Club Bot is online and ready!',
      }),
    });

    if (response.ok) {
      log.success('Webhook test successful!');
      return true;
    } else {
      log.error(`Webhook test failed: ${response.statusText}`);
    }
  } catch (error) {
    log.error(`Webhook test error: ${error.message}`);
  }

  return false;
}

async function main() {
  console.log('\n🤖 Setting up Discord automatically...\n');

  try {
    const channels = await createChannels();
    const roleId = await createRole();
    const webhookUrl = channels['jobclub-intros']
      ? await createWebhook(channels['jobclub-intros'])
      : null;

    if (webhookUrl) {
      await testWebhook(webhookUrl);

      console.log(`\n${colors.green}✅ Discord Setup Complete!${colors.reset}\n`);
      console.log('Configuration:');
      console.log(`  Bot Token: ${BOT_TOKEN.substring(0, 20)}...`);
      console.log(`  Server ID: ${SERVER_ID}`);
      console.log(`  Intro Channel: #jobclub-intros (${channels['jobclub-intros']})`);
      console.log(`  Help Channel: #help (${channels['help'] || 'existing'})`);
      console.log(`  Member Role: @Member (${roleId || 'existing'})`);
      console.log(`  Webhook: Configured ✅\n`);
    } else {
      log.warn('Webhook not created - check credentials');
    }
  } catch (error) {
    log.error(`Setup failed: ${error.message}`);
    process.exit(1);
  }
}

main();
