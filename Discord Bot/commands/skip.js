const { SlashCommandBuilder } = require('discord.js');
const musicModule = require('../modules/music');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current song'),

    async execute(interaction) {
        const member = interaction.member;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({ content: 'You need to be in a voice channel!', ephemeral: true });
        }

        const queue = musicModule.getQueue(interaction.guild.id);
        
        if (!queue.playing || queue.songs.length === 0) {
            return interaction.reply({ content: 'There is no music playing!', ephemeral: true });
        }

        try {
            musicModule.skipSong(interaction.guild.id);
            await interaction.reply({ content: '⏭️ Skipped the current song!' });
        } catch (error) {
            console.error('Error skipping song:', error);
            await interaction.reply({ content: 'Failed to skip song.', ephemeral: true });
        }
    },
};

