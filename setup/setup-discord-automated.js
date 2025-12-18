#!/usr/bin/env node
/**
 * Automated Discord Bot Setup
 * Creates bot, channels, roles, and webhooks automatically
 * 
 * Requirements:
 * - Discord bot token (from Developer Portal)
 * - Admin permission in your server
 */

import fetch from 'node-fetch';
import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_BASE = 'https://discord.com/api/v10';
const ENV_FILE = path.join(__dirname, '..', '.env.local');

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

async function getDiscordBotToken() {
  log.step('Step 1: Discord Bot Token');
  console.log('To get your bot token:');
  console.log('1. Go to https://discord.com/developers/applications');
  console.log('2. Select your application (or create new)');
  console.log('3. Go to "Bot" section');
  console.log('4. Click "Reset Token" and copy it');
  console.log('');
  
  const token = await question('Enter your Discord Bot Token: ');
  if (!token || token.length < 20) {
    log.error('Invalid token');
    process.exit(1);
  }
  return token;
}

async function getServerId(botToken) {
  log.step('Step 2: Get Your Server ID');
  console.log('To get your server ID:');
  console.log('1. Right-click your Discord server');
  console.log('2. Select "Copy Server ID"');
  console.log('');
  
  const serverId = await question('Enter your Server ID: ');
  if (!serverId) {
    log.error('Server ID required');
    process.exit(1);
  }

  // Verify bot is in server
  try {
    const response = await fetch(
      `${API_BASE}/users/@me/guilds`,
      {
        headers: { Authorization: `Bot ${botToken}` },
      }
    );
    const guilds = await response.json();
    const found = guilds.some((g) => g.id === serverId);
    
    if (!found) {
      log.error('Bot is not in that server!');
      console.log('Add the bot: https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&scope=bot&permissions=268435456');
      process.exit(1);
    }
    log.success(`Bot found in server`);
  } catch (error) {
    log.error(`Failed to verify bot: ${error.message}`);
    process.exit(1);
  }

  return serverId;
}

async function createChannels(botToken, serverId) {
  log.step('Step 3: Creating Channels');

  const channels = [
    { name: 'jobclub-intros', topic: 'Introduce yourself to the community!' },
    { name: 'help', topic: 'Ask questions and get help from the community' },
    { name: 'announcements', topic: 'Important Job Club announcements' },
  ];

  const created = {};

  for (const channel of channels) {
    try {
      const response = await fetch(
        `${API_BASE}/guilds/${serverId}/channels`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bot ${botToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: channel.name,
            type: 0, // text channel
            topic: channel.topic,
          }),
        }
      );

      if (response.status === 429) {
        // Rate limited
        const retryAfter = response.headers.get('retry-after');
        log.warn(`Rate limited. Waiting ${retryAfter}s...`);
        await new Promise((r) => setTimeout(r, parseInt(retryAfter) * 1000));
        // Retry
        const retryResponse = await fetch(
          `${API_BASE}/guilds/${serverId}/channels`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bot ${botToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: channel.name,
              type: 0,
              topic: channel.topic,
            }),
          }
        );
        const data = await retryResponse.json();
        created[channel.name] = data.id;
        log.success(`Created #${channel.name}`);
      } else if (response.status === 400) {
        // Channel might already exist
        const existingChannels = await fetch(
          `${API_BASE}/guilds/${serverId}/channels`,
          {
            headers: { Authorization: `Bot ${botToken}` },
          }
        );
        const existing = await existingChannels.json();
        const found = existing.find((c) => c.name === channel.name);
        if (found) {
          created[channel.name] = found.id;
          log.warn(`#${channel.name} already exists`);
        } else {
          log.error(`Failed to create #${channel.name}`);
        }
      } else if (response.ok) {
        const data = await response.json();
        created[channel.name] = data.id;
        log.success(`Created #${channel.name}`);
      } else {
        const error = await response.json();
        log.error(`Failed to create #${channel.name}: ${error.message}`);
      }
    } catch (error) {
      log.error(`Error creating #${channel.name}: ${error.message}`);
    }
  }

  return created;
}

async function createRole(botToken, serverId) {
  log.step('Step 4: Creating @Member Role');

  try {
    const response = await fetch(
      `${API_BASE}/guilds/${serverId}/roles`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bot ${botToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Member',
          color: 6366519, // Indigo
          mentionable: false,
        }),
      }
    );

    if (response.status === 429) {
      const retryAfter = response.headers.get('retry-after');
      await new Promise((r) => setTimeout(r, parseInt(retryAfter) * 1000));
      const retryResponse = await fetch(
        `${API_BASE}/guilds/${serverId}/roles`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bot ${botToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Member',
            color: 6366519,
            mentionable: false,
          }),
        }
      );
      const data = await retryResponse.json();
      log.success(`Created @Member role`);
      return data.id;
    } else if (response.ok) {
      const data = await response.json();
      log.success(`Created @Member role`);
      return data.id;
    } else if (response.status === 400) {
      // Role might exist
      const rolesResponse = await fetch(
        `${API_BASE}/guilds/${serverId}/roles`,
        {
          headers: { Authorization: `Bot ${botToken}` },
        }
      );
      const roles = await rolesResponse.json();
      const memberRole = roles.find((r) => r.name === 'Member');
      if (memberRole) {
        log.warn(`@Member role already exists`);
        return memberRole.id;
      }
      log.error('Failed to create role');
      return null;
    }
  } catch (error) {
    log.error(`Error creating role: ${error.message}`);
    return null;
  }
}

async function createWebhook(botToken, serverId, channelId, channelName) {
  log.step(`Step 5: Creating Webhook for #${channelName}`);

  try {
    const response = await fetch(
      `${API_BASE}/channels/${channelId}/webhooks`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bot ${botToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Job Club Bot',
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      log.success(`Created webhook for #${channelName}`);
      return data.url;
    } else {
      const error = await response.json();
      log.error(`Failed to create webhook: ${error.message}`);
      return null;
    }
  } catch (error) {
    log.error(`Error creating webhook: ${error.message}`);
    return null;
  }
}

async function updateEnvFile(config) {
  log.step('Step 6: Updating .env.local');

  try {
    let envContent = fs.readFileSync(ENV_FILE, 'utf8');

    // Update Discord config
    envContent = envContent.replace(
      /DISCORD_BOT_TOKEN=.*/,
      `DISCORD_BOT_TOKEN=${config.botToken}`
    );
    envContent = envContent.replace(
      /DISCORD_SERVER_ID=.*/,
      `DISCORD_SERVER_ID=${config.serverId}`
    );
    envContent = envContent.replace(
      /DISCORD_INTRO_CHANNEL_ID=.*/,
      `DISCORD_INTRO_CHANNEL_ID=${config.introChanelId}`
    );
    envContent = envContent.replace(
      /DISCORD_WEBHOOK_URL=.*/,
      `DISCORD_WEBHOOK_URL=${config.webhookUrl}`
    );

    if (config.memberRoleId) {
      envContent = envContent.replace(
        /DISCORD_MEMBER_ROLE_ID=.*/,
        `DISCORD_MEMBER_ROLE_ID=${config.memberRoleId}`
      );
    }

    fs.writeFileSync(ENV_FILE, envContent, 'utf8');
    log.success('Updated .env.local');
  } catch (error) {
    log.error(`Failed to update .env.local: ${error.message}`);
  }
}

async function testWebhook(webhookUrl) {
  log.step('Step 7: Testing Webhook');

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
      return false;
    }
  } catch (error) {
    log.error(`Webhook test error: ${error.message}`);
    return false;
  }
}

async function runSetup() {
  console.log('\n🤖 Job Club Discord Bot Automated Setup\n');

  try {
    const botToken = await getDiscordBotToken();
    const serverId = await getServerId(botToken);
    const channels = await createChannels(botToken, serverId);
    const memberRoleId = await createRole(botToken, serverId);
    const webhookUrl = await createWebhook(
      botToken,
      serverId,
      channels['jobclub-intros'],
      'jobclub-intros'
    );

    if (!webhookUrl) {
      log.error('Failed to create webhook');
      process.exit(1);
    }

    await updateEnvFile({
      botToken,
      serverId,
      introChanelId: channels['jobclub-intros'],
      webhookUrl,
      memberRoleId,
    });

    await testWebhook(webhookUrl);

    log.step('Setup Complete!');
    console.log('\n📋 Configuration Summary:');
    console.log(`  Bot Token: ${botToken.substring(0, 20)}...`);
    console.log(`  Server ID: ${serverId}`);
    console.log(`  Intro Channel: #jobclub-intros (${channels['jobclub-intros']})`);
    console.log(`  Help Channel: #help (${channels['help'] || 'existing'})`);
    console.log(`  Announcements: #announcements (${channels['announcements'] || 'existing'})`);
    console.log(`  Member Role: @Member (${memberRoleId || 'existing'})`);
    console.log(`  Webhook: Configured ✅`);

    console.log('\n📝 Environment variables have been saved to .env.local');
    console.log('   Variables updated:');
    console.log('   - DISCORD_BOT_TOKEN');
    console.log('   - DISCORD_SERVER_ID');
    console.log('   - DISCORD_INTRO_CHANNEL_ID');
    console.log('   - DISCORD_WEBHOOK_URL');
    if (memberRoleId) {
      console.log('   - DISCORD_MEMBER_ROLE_ID');
    }

    console.log('\n🎉 Ready to use! Next step: Set up Zapier automation');
  } catch (error) {
    log.error(`Setup failed: ${error.message}`);
    process.exit(1);
  } finally {
    rl.close();
  }
}

runSetup();
