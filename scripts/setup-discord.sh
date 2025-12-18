#!/bin/bash
# Discord Setup Script for Job Club
# Creates Discord bot, configures permissions, and sets up channels

set -e

echo "🤖 Job Club Discord Setup"
echo "========================="
echo ""

# Check if Discord CLI or required tools are available
if ! command -v curl &> /dev/null; then
    echo "❌ curl is required but not installed"
    exit 1
fi

echo "📋 Step 1: Get your Discord Server ID"
echo "---"
echo "1. Go to Discord Developer Portal: https://discord.com/developers/applications"
echo "2. Create a new application (or select existing)"
echo "3. Go to 'Bot' section → Click 'Add Bot'"
echo "4. Copy the bot TOKEN (you'll need this)"
echo ""
read -p "Enter your Discord Bot Token: " BOT_TOKEN

if [ -z "$BOT_TOKEN" ]; then
    echo "❌ Bot token is required"
    exit 1
fi

echo ""
echo "📋 Step 2: Set Bot Permissions"
echo "---"
echo "In Discord Developer Portal:"
echo "1. Go to Bot section"
echo "2. Under 'TOKEN' section, click 'Copy' (we already have it)"
echo "3. Go to 'OAuth2' → 'URL Generator'"
echo "4. Select these scopes:"
echo "   ✓ bot"
echo "5. Select these permissions:"
echo "   ✓ Send Messages"
echo "   ✓ Manage Roles"
echo "   ✓ Read Message History"
echo "6. Copy generated URL and open it to invite bot to your server"
echo ""
read -p "Press Enter once bot is invited to your Discord server..."

echo ""
echo "📋 Step 3: Get Server IDs"
echo "---"
echo "In Discord:"
echo "1. Right-click your server → Copy Server ID"
echo ""
read -p "Enter Server ID: " SERVER_ID

if [ -z "$SERVER_ID" ]; then
    echo "❌ Server ID is required"
    exit 1
fi

echo ""
echo "📋 Step 4: Create/Verify Channels"
echo "---"
echo "1. Create/Verify these channels exist in your Discord:"
echo "   - #jobclub-intros (for member introductions)"
echo "   - #help (for questions)"
echo "   - #announcements (for updates)"
echo ""
read -p "Enter #jobclub-intros channel ID (right-click channel → Copy ID): " INTRO_CHANNEL_ID

if [ -z "$INTRO_CHANNEL_ID" ]; then
    echo "❌ Intro channel ID is required"
    exit 1
fi

echo ""
echo "📋 Step 5: Create @Member Role"
echo "---"
echo "In Discord:"
echo "1. Go to Server Settings → Roles"
echo "2. Create new role called '@Member'"
echo "3. Customize color/permissions as desired"
echo "4. Right-click role → Copy ID"
echo ""
read -p "Enter @Member Role ID (optional, press Enter to skip): " MEMBER_ROLE_ID

echo ""
echo "📋 Step 6: Create Webhooks"
echo "---"
echo "1. Go to #jobclub-intros channel"
echo "2. Click Settings (gear) → Integrations → Webhooks"
echo "3. Click 'New Webhook'"
echo "4. Name it 'Job Club Bot'"
echo "5. Copy the webhook URL"
echo ""
read -p "Enter Webhook URL for #jobclub-intros: " WEBHOOK_URL

if [ -z "$WEBHOOK_URL" ]; then
    echo "❌ Webhook URL is required"
    exit 1
fi

echo ""
echo "📋 Step 7: Test Configuration"
echo "---"

# Test webhook
echo "Testing webhook..."
WEBHOOK_TEST=$(curl -s -X POST "$WEBHOOK_URL" \
  -H 'Content-Type: application/json' \
  -d '{"content":"🧪 Job Club Bot is online and ready!"}')

if echo "$WEBHOOK_TEST" | grep -q "id"; then
    echo "✅ Webhook is working!"
else
    echo "⚠️  Webhook test may have failed - check your Discord channel"
fi

echo ""
echo "📋 Configuration Summary"
echo "---"
echo "Bot Token: ${BOT_TOKEN:0:20}...***"
echo "Server ID: $SERVER_ID"
echo "Intro Channel ID: $INTRO_CHANNEL_ID"
echo "Member Role ID: ${MEMBER_ROLE_ID:-"(optional)"}"
echo "Webhook URL: ${WEBHOOK_URL:0:40}...***"

echo ""
echo "📝 Add these to your .env.local:"
echo "---"
cat << EOF
DISCORD_BOT_TOKEN=$BOT_TOKEN
DISCORD_SERVER_ID=$SERVER_ID
DISCORD_INTRO_CHANNEL_ID=$INTRO_CHANNEL_ID
DISCORD_WEBHOOK_URL=$WEBHOOK_URL
EOF

if [ ! -z "$MEMBER_ROLE_ID" ]; then
    echo "DISCORD_MEMBER_ROLE_ID=$MEMBER_ROLE_ID"
fi

echo ""
echo "DISCORD_SERVER_URL=https://discord.gg/YOUR_SERVER_INVITE_CODE"
echo ""
echo "✅ Discord setup complete!"
echo ""
echo "Next steps:"
echo "1. Copy the environment variables above"
echo "2. Add them to .env.local"
echo "3. Restart the dev server"
echo "4. Test by submitting the onboarding form"
