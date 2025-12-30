const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { updateGuildConfig, getGuildConfig } = require('../utils/configManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Setup bot features for your server')
        .addSubcommand(subcommand =>
            subcommand
                .setName('automod')
                .setDescription('Setup AutoMod system')
                .addBooleanOption(option =>
                    option.setName('enabled')
                        .setDescription('Enable/disable AutoMod')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('max_caps')
                        .setDescription('Maximum caps percentage (default: 70)')
                        .setRequired(false))
                .addIntegerOption(option =>
                    option.setName('max_mentions')
                        .setDescription('Maximum mentions per message (default: 5)')
                        .setRequired(false))
                .addIntegerOption(option =>
                    option.setName('max_links')
                        .setDescription('Maximum links per message (default: 3)')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('moderation')
                .setDescription('Setup moderation system')
                .addChannelOption(option =>
                    option.setName('log_channel')
                        .setDescription('Channel for moderation logs')
                        .setRequired(false))
                .addRoleOption(option =>
                    option.setName('kick_role')
                        .setDescription('Role required to kick members')
                        .setRequired(false))
                .addRoleOption(option =>
                    option.setName('ban_role')
                        .setDescription('Role required to ban members')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('tickets')
                .setDescription('Setup ticket system')
                .addBooleanOption(option =>
                    option.setName('enabled')
                        .setDescription('Enable/disable ticket system')
                        .setRequired(true))
                .addChannelOption(option =>
                    option.setName('category')
                        .setDescription('Category for ticket channels')
                        .setRequired(false))
                .addRoleOption(option =>
                    option.setName('support_role')
                        .setDescription('Role that can view tickets')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('music')
                .setDescription('Setup music system')
                .addBooleanOption(option =>
                    option.setName('enabled')
                        .setDescription('Enable/disable music system')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('max_queue')
                        .setDescription('Maximum queue size (default: 50)')
                        .setRequired(false)))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const config = getGuildConfig(interaction.guild.id);

        if (subcommand === 'automod') {
            const enabled = interaction.options.getBoolean('enabled');
            const maxCaps = interaction.options.getInteger('max_caps') || config.automod.maxCaps;
            const maxMentions = interaction.options.getInteger('max_mentions') || config.automod.maxMentions;
            const maxLinks = interaction.options.getInteger('max_links') || config.automod.maxLinks;

            updateGuildConfig(interaction.guild.id, {
                automod: {
                    ...config.automod,
                    enabled,
                    maxCaps,
                    maxMentions,
                    maxLinks
                }
            });

            await interaction.reply({
                content: `AutoMod ${enabled ? 'enabled' : 'disabled'}!\nMax Caps: ${maxCaps}%\nMax Mentions: ${maxMentions}\nMax Links: ${maxLinks}`,
                ephemeral: true
            });
        }

        if (subcommand === 'moderation') {
            const logChannel = interaction.options.getChannel('log_channel');
            const kickRole = interaction.options.getRole('kick_role');
            const banRole = interaction.options.getRole('ban_role');

            updateGuildConfig(interaction.guild.id, {
                moderation: {
                    modLogChannel: logChannel?.id || config.moderation.modLogChannel,
                    kickRole: kickRole?.id || config.moderation.kickRole,
                    banRole: banRole?.id || config.moderation.banRole
                }
            });

            await interaction.reply({
                content: `Moderation system configured!\nLog Channel: ${logChannel || 'Not set'}\nKick Role: ${kickRole || 'Not set'}\nBan Role: ${banRole || 'Not set'}`,
                ephemeral: true
            });
        }

        if (subcommand === 'tickets') {
            const enabled = interaction.options.getBoolean('enabled');
            const category = interaction.options.getChannel('category');
            const supportRole = interaction.options.getRole('support_role');

            if (enabled && (!category || !supportRole)) {
                return interaction.reply({
                    content: 'When enabling tickets, you must provide both a category and support role!',
                    ephemeral: true
                });
            }

            updateGuildConfig(interaction.guild.id, {
                tickets: {
                    enabled,
                    categoryId: category?.id || config.tickets.categoryId,
                    supportRole: supportRole?.id || config.tickets.supportRole
                }
            });

            await interaction.reply({
                content: `Ticket system ${enabled ? 'enabled' : 'disabled'}!\nCategory: ${category || 'Not set'}\nSupport Role: ${supportRole || 'Not set'}`,
                ephemeral: true
            });
        }

        if (subcommand === 'music') {
            const enabled = interaction.options.getBoolean('enabled');
            const maxQueue = interaction.options.getInteger('max_queue') || config.music.maxQueue;

            updateGuildConfig(interaction.guild.id, {
                music: {
                    enabled,
                    maxQueue
                }
            });

            await interaction.reply({
                content: `Music system ${enabled ? 'enabled' : 'disabled'}!\nMax Queue: ${maxQueue} songs`,
                ephemeral: true
            });
        }
    },
};


