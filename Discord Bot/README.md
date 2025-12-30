# Discord Bot - Comprehensive Guide

A feature-rich Discord bot built with Discord.js v14, featuring AutoMod, moderation tools, music playback, ticket system, and fun games - all without requiring a database!

## 🚀 Features

### 🛡️ AutoMod System
- **Bad Word Filter**: Automatically detects and removes messages containing inappropriate words
- **Caps Detection**: Prevents excessive capitalization (configurable threshold)
- **Mention Spam Protection**: Limits excessive user/role mentions
- **Link Spam Protection**: Prevents excessive link posting
- **Spam Detection**: Detects and removes repeated messages

### ⚖️ Moderation
- **Kick Command**: Remove members from the server
- **Ban Command**: Permanently ban members with message deletion options
- **Moderation Logs**: Automatic logging to configured channels

### 🎵 Music System
- **YouTube Support**: Play music directly from YouTube URLs
- **Local File Support**: Play audio files from the `music/` folder
- **Queue Management**: Add multiple songs to a queue
- **Playback Controls**: Skip, stop, and view queue commands

### 🎫 Ticket System
- **Ticket Creation**: Users can create support tickets via button
- **Auto Channel Creation**: Automatically creates private channels for tickets
- **Role-Based Access**: Configure support roles with ticket access
- **Easy Closure**: Simple ticket closing with auto-deletion

### 🎮 Games Section
- **8-Ball**: Ask the magic 8-ball questions
- **Coin Flip**: Simple coin flipping game
- **Rock Paper Scissors**: Play RPS against the bot
- **Dice Roll**: Roll dice with custom sides
- **Chess**: Full chess game with board display (play against friends or bot)
- **Checkers**: Classic checkers game with move validation
- **Hangman**: Word guessing game with random word generator

## 📋 Prerequisites

- Node.js v16.9.0 or higher
- npm or yarn package manager
- A Discord Bot Token (from [Discord Developer Portal](https://discord.com/developers/applications))
- FFmpeg installed on your system (for music playback)

## 🔧 Installation

1. **Clone or download this repository**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the bot:**
   - Open `config.json`
   - Replace `YOUR_BOT_TOKEN_HERE` with your bot token
   - Replace `YOUR_USER_ID_HERE` with your Discord user ID (optional, for owner commands)
   - Optionally change the prefix (default: `!`)

4. **Invite your bot to your server:**
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Select your bot application
   - Go to OAuth2 > URL Generator
   - Select scopes: `bot` and `applications.commands`
   - Select bot permissions:
     - Manage Channels
     - Kick Members
     - Ban Members
     - Manage Messages
     - Connect (for voice)
     - Speak (for voice)
     - Use Slash Commands
   - Copy the generated URL and open it in your browser

5. **Start the bot:**
   ```bash
   npm start
   ```

## 📖 Command Reference

### Setup Commands

#### `/setup automod`
Configure the AutoMod system for your server.

**Options:**
- `enabled` (required): Enable or disable AutoMod
- `max_caps` (optional): Maximum caps percentage (default: 70)
- `max_mentions` (optional): Maximum mentions per message (default: 5)
- `max_links` (optional): Maximum links per message (default: 3)

**Example:**
```
/setup automod enabled:true max_caps:60 max_mentions:3
```

#### `/setup moderation`
Configure moderation settings.

**Options:**
- `log_channel` (optional): Channel for moderation logs
- `kick_role` (optional): Role required to kick members
- `ban_role` (optional): Role required to ban members

**Example:**
```
/setup moderation log_channel:#mod-logs kick_role:@Moderator
```

#### `/setup tickets`
Configure the ticket system.

**Options:**
- `enabled` (required): Enable or disable ticket system
- `category` (required if enabling): Category for ticket channels
- `support_role` (required if enabling): Role that can view tickets

**Example:**
```
/setup tickets enabled:true category:"Support Tickets" support_role:@Support
```

#### `/setup music`
Configure music settings.

**Options:**
- `enabled` (required): Enable or disable music system
- `max_queue` (optional): Maximum queue size (default: 50)

**Example:**
```
/setup music enabled:true max_queue:100
```

### Moderation Commands

#### `/kick`
Kick a member from the server.

**Options:**
- `user` (required): The user to kick
- `reason` (optional): Reason for the kick

**Example:**
```
/kick user:@User reason:Spamming
```

#### `/ban`
Ban a member from the server.

**Options:**
- `user` (required): The user to ban
- `reason` (optional): Reason for the ban
- `delete_days` (optional): Days of messages to delete (0-7, default: 0)

**Example:**
```
/ban user:@User reason:Breaking rules delete_days:1
```

### Music Commands

#### `/play`
Play music from YouTube or local files.

**Options:**
- `source` (required): YouTube URL or filename from music folder

**Examples:**
```
/play source:https://www.youtube.com/watch?v=dQw4w9WgXcQ
/play source:song.mp3
```

#### `/skip`
Skip the current song.

**Example:**
```
/skip
```

#### `/stop`
Stop the music and clear the queue.

**Example:**
```
/stop
```

#### `/queue`
Show the current music queue.

**Example:**
```
/queue
```

### Ticket Commands

#### `/ticket panel`
Create a ticket panel with a button for users to create tickets.

**Example:**
```
/ticket panel
```

#### `/ticket close`
Close the current ticket channel.

**Example:**
```
/ticket close
```

### Game Commands

#### `/8ball`
Ask the magic 8-ball a question.

**Options:**
- `question` (required): Your question

**Example:**
```
/8ball question:Will I win the lottery?
```

#### `/coinflip`
Flip a coin.

**Example:**
```
/coinflip
```

#### `/rps`
Play rock paper scissors.

**Options:**
- `choice` (required): Your choice (rock, paper, or scissors)

**Example:**
```
/rps choice:rock
```

#### `/roll`
Roll a dice.

**Options:**
- `sides` (optional): Number of sides (default: 6, max: 100)

**Example:**
```
/roll sides:20
```

#### `/chess`
Play chess against another player or the bot.

**Subcommands:**
- `start [opponent]` - Start a new chess game (optional opponent)
- `move <move>` - Make a move using algebraic notation (e.g., e2e4)
- `board` - View the current board
- `resign` - Resign from the current game

**Examples:**
```
/chess start
/chess start opponent:@User
/chess move move:e2e4
/chess board
/chess resign
```

#### `/checkers`
Play checkers against another player or the bot.

**Subcommands:**
- `start [opponent]` - Start a new checkers game (optional opponent)
- `move <move>` - Make a move (e.g., A3B4)
- `board` - View the current board
- `resign` - Resign from the current game

**Examples:**
```
/checkers start
/checkers start opponent:@User
/checkers move move:A3B4
/checkers board
/checkers resign
```

#### `/hangman`
Play hangman with a random word generator.

**Subcommands:**
- `start` - Start a new hangman game
- `guess <letter>` - Guess a letter
- `status` - View current game status
- `giveup` - Give up and reveal the word

**Examples:**
```
/hangman start
/hangman guess letter:a
/hangman status
/hangman giveup
```

### Utility Commands

#### `/help`
Show all available commands.

**Example:**
```
/help
```

## 📁 Project Structure

```
Discord Bot/
├── commands/          # Slash command files
│   ├── 8ball.js
│   ├── ban.js
│   ├── coinflip.js
│   ├── help.js
│   ├── kick.js
│   ├── play.js
│   ├── queue.js
│   ├── roll.js
│   ├── rps.js
│   ├── setup.js
│   ├── skip.js
│   ├── stop.js
│   └── ticket.js
├── events/            # Event handlers
│   ├── interactionCreate.js
│   └── ready.js
├── modules/           # Core functionality modules
│   ├── automod.js
│   ├── music.js
│   └── tickets.js
├── utils/             # Utility functions
│   └── configManager.js
├── music/             # Local music files directory
│   └── README.md
├── config.json        # Bot configuration (token, prefix)
├── guildConfig.json   # Per-guild settings (auto-generated)
├── index.js           # Main bot file
├── package.json       # Dependencies
└── README.md          # This file
```

## ⚙️ Configuration

### Bot Configuration (`config.json`)
```json
{
  "token": "YOUR_BOT_TOKEN",
  "prefix": "!",
  "ownerId": "YOUR_USER_ID"
}
```

### Guild Configuration (`guildConfig.json`)
This file is automatically generated and stores per-server settings. It includes:
- AutoMod settings
- Moderation settings
- Music settings
- Ticket system settings

**Note:** This file is automatically managed by the bot. Manual editing is not recommended.

## 🎵 Using Local Music Files

1. Place your audio files (MP3, WAV, OGG, etc.) in the `music/` folder
2. Use the filename with the `/play` command:
   ```
   /play source:my-song.mp3
   ```
3. Supported formats: Any format supported by FFmpeg

## 🔒 Permissions

The bot requires the following permissions:
- **View Channels**: To see channels
- **Send Messages**: To send command responses
- **Manage Messages**: For AutoMod message deletion
- **Kick Members**: For kick command
- **Ban Members**: For ban command
- **Manage Channels**: For ticket system
- **Connect**: To join voice channels
- **Speak**: To play music in voice channels
- **Use Slash Commands**: To use slash commands

## 🐛 Troubleshooting

### Bot doesn't respond to commands
- Make sure the bot is online and running
- Check that the bot has "Use Slash Commands" permission
- Verify your bot token is correct in `config.json`
- Wait a few minutes after adding the bot for commands to register globally

### Music doesn't play
- Ensure FFmpeg is installed on your system
- Check that you're in a voice channel
- Verify the bot has "Connect" and "Speak" permissions
- For YouTube URLs, ensure they're valid and accessible

### AutoMod not working
- Run `/setup automod enabled:true` to enable it
- Check that the bot has "Manage Messages" permission
- Verify the bot's role is above users you want to moderate

### Tickets not creating
- Run `/setup tickets` with all required options
- Ensure the bot has "Manage Channels" permission
- Check that the category exists and the bot can create channels in it

## 📝 Notes

- **No Database Required**: All configuration is stored in JSON files
- **Per-Server Settings**: Each server has its own configuration
- **AutoMod Bad Words**: Edit `modules/automod.js` to customize the bad words list
- **Music Queue**: Limited by the `max_queue` setting (default: 50 songs)

## 🔄 Updating

To update the bot:
1. Pull the latest changes
2. Run `npm install` to update dependencies
3. Restart the bot

## 📄 License

MIT License - Feel free to modify and use as needed!

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the command documentation
3. Ensure all prerequisites are met
4. Verify bot permissions in your server

## 🎉 Enjoy Your Bot!

Your Discord bot is now ready to use! Start by running `/setup` to configure features for your server, then explore all the commands with `/help`.

