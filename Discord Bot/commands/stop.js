const { SlashCommandBuilder } = require('discord.js');
const musicModule = require('../modules/music');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the music and clear the queue'),

    async execute(interaction) {
        const member = interaction.member;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({ content: 'You need to be in a voice channel!', ephemeral: true });
        }

        const queue = musicModule.getQueue(interaction.guild.id);
        
        if (!queue.playing && queue.songs.length === 0) {
            return interaction.reply({ content: 'There is no music playing!', ephemeral: true });
        }

        try {
            musicModule.stopMusic(interaction.guild.id);
            await interaction.reply({ content: '⏹️ Stopped the music and cleared the queue!' });
        } catch (error) {
            console.error('Error stopping music:', error);
            await interaction.reply({ content: 'Failed to stop music.', ephemeral: true });
        }
    },
};

