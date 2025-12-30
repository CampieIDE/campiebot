const { SlashCommandBuilder } = require('discord.js');
const { getGuildConfig } = require('../utils/configManager');
const musicModule = require('../modules/music');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play music from a YouTube URL or local file')
        .addStringOption(option =>
            option.setName('source')
                .setDescription('YouTube URL or filename from music folder')
                .setRequired(true)),

    async execute(interaction) {
        const config = getGuildConfig(interaction.guild.id);
        
        if (!config.music.enabled) {
            return interaction.reply({ content: 'Music system is not enabled. Use `/setup music` to enable it.', ephemeral: true });
        }

        const member = interaction.member;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({ content: 'You need to be in a voice channel to play music!', ephemeral: true });
        }

        const source = interaction.options.getString('source');
        const queue = musicModule.getQueue(interaction.guild.id);

        try {
            musicModule.addToQueue(interaction.guild.id, source);
            
            if (!queue.playing) {
                await musicModule.playMusic(interaction.guild, voiceChannel, source);
                await interaction.reply({ content: `🎵 Now playing: ${source}` });
            } else {
                await interaction.reply({ content: `✅ Added to queue: ${source}\nPosition in queue: ${queue.songs.length}` });
            }
        } catch (error) {
            console.error('Error playing music:', error);
            await interaction.reply({ content: `Failed to play music: ${error.message}`, ephemeral: true });
        }
    },
};

