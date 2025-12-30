const { SlashCommandBuilder } = require('discord.js');
const musicModule = require('../modules/music');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Show the current music queue'),

    async execute(interaction) {
        const queue = musicModule.getQueueList(interaction.guild.id);
        
        if (queue.length === 0) {
            return interaction.reply({ content: 'The queue is empty!', ephemeral: true });
        }

        const queueList = queue.map((song, index) => `${index + 1}. ${song}`).join('\n');
        
        await interaction.reply({
            embeds: [{
                title: 'Music Queue',
                description: queueList,
                color: 0x00ff00,
                footer: { text: `Total songs: ${queue.length}` }
            }]
        });
    },
};

