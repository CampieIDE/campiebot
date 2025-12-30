# Quick Reference Guide

## 🚀 Getting Started
1. Install: `npm install`
2. Configure: Edit `config.json` with your bot token
3. Start: `npm start`

## 📋 All Commands

### Setup
- `/setup automod` - Configure AutoMod
- `/setup moderation` - Configure moderation
- `/setup tickets` - Configure tickets
- `/setup music` - Configure music

### Moderation
- `/kick <user> [reason]` - Kick a member
- `/ban <user> [reason] [delete_days]` - Ban a member

### Music
- `/play <source>` - Play YouTube URL or local file
- `/skip` - Skip current song
- `/stop` - Stop and clear queue
- `/queue` - Show queue

### Tickets
- `/ticket panel` - Create ticket panel
- `/ticket close` - Close ticket

### Games
- `/8ball <question>` - Ask 8-ball
- `/coinflip` - Flip coin
- `/rps <choice>` - Rock Paper Scissors
- `/roll [sides]` - Roll dice
- `/chess start [opponent]` - Start chess game
- `/chess move <move>` - Make chess move (e.g., e2e4)
- `/chess board` - View chess board
- `/checkers start [opponent]` - Start checkers game
- `/checkers move <move>` - Make checkers move (e.g., A3B4)
- `/checkers board` - View checkers board
- `/hangman start` - Start hangman game
- `/hangman guess <letter>` - Guess a letter
- `/hangman status` - View hangman status

### Utility
- `/help` - Show all commands

## ⚙️ Configuration Files

**config.json** - Bot token and basic settings
**guildConfig.json** - Per-server settings (auto-generated)

## 📁 Important Directories

- `commands/` - All slash commands
- `modules/` - Core functionality
- `music/` - Place audio files here
- `events/` - Event handlers
- `utils/` - Utility functions

## 🔧 First Time Setup Checklist

- [ ] Install Node.js
- [ ] Run `npm install`
- [ ] Install FFmpeg
- [ ] Create Discord bot application
- [ ] Get bot token
- [ ] Add token to `config.json`
- [ ] Invite bot to server with permissions
- [ ] Run `npm start`
- [ ] Run `/setup` commands in Discord
- [ ] Test with `/help`

## 🎯 Common Tasks

**Enable AutoMod:**
```
/setup automod enabled:true
```

**Set up moderation logs:**
```
/setup moderation log_channel:#mod-logs
```

**Enable tickets:**
```
/setup tickets enabled:true category:"Support" support_role:@Support
```

**Play local music:**
1. Put file in `music/` folder
2. `/play source:filename.mp3`

**Play YouTube:**
```
/play source:https://youtube.com/watch?v=...
```

## 🐛 Quick Fixes

**Bot not responding?**
- Check if bot is online
- Verify token in config.json
- Check bot permissions

**Music not working?**
- Install FFmpeg
- Check voice permissions
- Be in a voice channel

**Commands not showing?**
- Wait 5-10 minutes after adding bot
- Re-invite with "applications.commands" scope

## 📚 Full Documentation

See `README.md` for complete documentation
See `SETUP_GUIDE.md` for detailed setup instructions

