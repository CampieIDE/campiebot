# Quick Setup Guide

## Step-by-Step Setup Instructions

### 1. Install Node.js
Download and install Node.js from [nodejs.org](https://nodejs.org/) (v16.9.0 or higher recommended)

### 2. Install Dependencies
Open terminal in the bot directory and run:
```bash
npm install
```

### 3. Install FFmpeg (Required for Music)
**Windows:**
- Download from [ffmpeg.org](https://ffmpeg.org/download.html)
- Add to system PATH

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt update
sudo apt install ffmpeg
```

### 4. Create Discord Bot Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Name your bot and click "Create"
4. Go to "Bot" section
5. Click "Add Bot" and confirm
6. Under "Token", click "Reset Token" and copy it
7. Enable these Privileged Gateway Intents:
   - ✅ MESSAGE CONTENT INTENT
   - ✅ SERVER MEMBERS INTENT

### 5. Configure Bot

1. Open `config.json` in the bot folder
2. Replace `YOUR_BOT_TOKEN_HERE` with your bot token
3. (Optional) Replace `YOUR_USER_ID_HERE` with your Discord user ID
   - To get your user ID: Enable Developer Mode in Discord, right-click yourself, "Copy ID"

### 6. Invite Bot to Server

1. In Discord Developer Portal, go to "OAuth2" > "URL Generator"
2. Select scopes:
   - ✅ `bot`
   - ✅ `applications.commands`
3. Select bot permissions:
   - ✅ Manage Channels
   - ✅ Kick Members
   - ✅ Ban Members
   - ✅ Manage Messages
   - ✅ Connect
   - ✅ Speak
   - ✅ Use Slash Commands
4. Copy the generated URL
5. Open URL in browser and select your server
6. Authorize the bot

### 7. Start the Bot

```bash
npm start
```

You should see: `Ready! Logged in as YourBot#1234`

### 8. Initial Setup in Discord

1. Run `/setup automod enabled:true` to enable AutoMod
2. Run `/setup moderation log_channel:#your-log-channel` to set up moderation logs
3. Run `/setup tickets enabled:true category:"Support" support_role:@Support` to enable tickets
4. Run `/setup music enabled:true` to enable music

### 9. Test Commands

Try these commands to verify everything works:
- `/help` - Show all commands
- `/8ball question:Is this working?` - Test game command
- `/coinflip` - Test another game

## Common Issues

**"Cannot find module 'discord.js'"**
- Run `npm install` again

**"Invalid token"**
- Check your token in `config.json`
- Make sure there are no extra spaces

**"Missing permissions"**
- Re-invite the bot with all required permissions
- Check bot's role position in server settings

**Music not working**
- Verify FFmpeg is installed: `ffmpeg -version`
- Check bot has "Connect" and "Speak" permissions
- Ensure you're in a voice channel

## Next Steps

- Read the full README.md for detailed documentation
- Customize AutoMod bad words in `modules/automod.js`
- Add music files to the `music/` folder
- Configure all features with `/setup` commands

