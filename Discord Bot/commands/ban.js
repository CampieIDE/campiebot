const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getGuildConfig } = require('../utils/configManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a member from the server')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the ban')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('delete_days')
                .setDescription('Number of days of messages to delete (0-7)')
                .setRequired(false)
                .setMinValue(0)
                .setMaxValue(7))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const deleteDays = interaction.options.getInteger('delete_days') || 0;
        const member = interaction.guild.members.cache.get(user.id);
        const config = getGuildConfig(interaction.guild.id);

        if (member) {
            if (member.roles.highest.position >= interaction.member.roles.highest.position && interaction.user.id !== interaction.guild.ownerId) {
                return interaction.reply({ content: 'You cannot ban someone with equal or higher roles.', ephemeral: true });
            }

            if (!member.bannable) {
                return interaction.reply({ content: 'I cannot ban this user. They may have higher permissions than me.', ephemeral: true });
            }
        }

        try {
            await interaction.guild.members.ban(user, { reason, deleteMessageDays: deleteDays });
            
            // Log to mod log channel if configured
            if (config.moderation.modLogChannel) {
                const logChannel = interaction.guild.channels.cache.get(config.moderation.modLogChannel);
                if (logChannel) {
                    await logChannel.send({
                        embeds: [{
                            title: 'Member Banned',
                            description: `**User:** ${user.tag} (${user.id})\n**Moderator:** ${interaction.user.tag}\n**Reason:** ${reason}\n**Messages Deleted:** ${deleteDays} days`,
                            color: 0xff0000,
                            timestamp: new Date().toISOString()
                        }]
                    });
                }
            }

            await interaction.reply({ content: `Successfully banned ${user.tag}. Reason: ${reason}`, ephemeral: true });
        } catch (error) {
            console.error('Error banning user:', error);
            await interaction.reply({ content: 'Failed to ban user.', ephemeral: true });
        }
    },
};

