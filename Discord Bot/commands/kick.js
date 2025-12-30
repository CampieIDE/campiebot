const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getGuildConfig } = require('../utils/configManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a member from the server')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to kick')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the kick')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = interaction.guild.members.cache.get(user.id);
        const config = getGuildConfig(interaction.guild.id);

        if (!member) {
            return interaction.reply({ content: 'User not found in this server.', ephemeral: true });
        }

        if (member.roles.highest.position >= interaction.member.roles.highest.position && interaction.user.id !== interaction.guild.ownerId) {
            return interaction.reply({ content: 'You cannot kick someone with equal or higher roles.', ephemeral: true });
        }

        if (!member.kickable) {
            return interaction.reply({ content: 'I cannot kick this user. They may have higher permissions than me.', ephemeral: true });
        }

        try {
            await member.kick(reason);
            
            // Log to mod log channel if configured
            if (config.moderation.modLogChannel) {
                const logChannel = interaction.guild.channels.cache.get(config.moderation.modLogChannel);
                if (logChannel) {
                    await logChannel.send({
                        embeds: [{
                            title: 'Member Kicked',
                            description: `**User:** ${user.tag} (${user.id})\n**Moderator:** ${interaction.user.tag}\n**Reason:** ${reason}`,
                            color: 0xff9900,
                            timestamp: new Date().toISOString()
                        }]
                    });
                }
            }

            await interaction.reply({ content: `Successfully kicked ${user.tag}. Reason: ${reason}`, ephemeral: true });
        } catch (error) {
            console.error('Error kicking user:', error);
            await interaction.reply({ content: 'Failed to kick user.', ephemeral: true });
        }
    },
};

