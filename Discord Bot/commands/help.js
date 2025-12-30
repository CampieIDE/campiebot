const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show all available commands'),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('🤖 Bot Commands')
            .setDescription('Here are all available commands:')
            .setColor(0x5865f2)
            .addFields(
                {
                    name: '⚙️ Setup',
                    value: '`/setup` - Configure bot features (AutoMod, Moderation, Tickets, Music)',
                    inline: false
                },
                {
                    name: '🛡️ Moderation',
                    value: '`/kick` - Kick a member\n`/ban` - Ban a member',
                    inline: false
                },
                {
                    name: '🎵 Music',
                    value: '`/play` - Play music from YouTube or local files\n`/skip` - Skip current song\n`/stop` - Stop music and clear queue\n`/queue` - Show music queue',
                    inline: false
                },
                {
                    name: '🎫 Tickets',
                    value: '`/ticket panel` - Create ticket panel\n`/ticket close` - Close current ticket',
                    inline: false
                },
                {
                    name: '🎮 Games',
                    value: '`/8ball` - Ask the magic 8-ball\n`/coinflip` - Flip a coin\n`/rps` - Rock Paper Scissors\n`/roll` - Roll a dice\n`/chess` - Play chess\n`/checkers` - Play checkers\n`/hangman` - Play hangman',
                    inline: false
                },
                {
                    name: 'ℹ️ Info',
                    value: '`/help` - Show this help message',
                    inline: false
                }
            )
            .setFooter({ text: 'Use /setup to configure the bot for your server!' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};

