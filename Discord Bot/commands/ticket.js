const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getGuildConfig } = require('../utils/configManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Ticket system commands')
        .addSubcommand(subcommand =>
            subcommand
                .setName('panel')
                .setDescription('Create a ticket panel'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('close')
                .setDescription('Close the current ticket')),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const config = getGuildConfig(interaction.guild.id);

        if (subcommand === 'panel') {
            if (!config.tickets.enabled) {
                return interaction.reply({ content: 'Ticket system is not enabled. Use `/setup tickets` to enable it.', ephemeral: true });
            }

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('create_ticket')
                        .setLabel('Create Ticket')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji('🎫')
                );

            await interaction.reply({
                content: '**Ticket System**\n\nClick the button below to create a support ticket!',
                components: [row]
            });
        }

        if (subcommand === 'close') {
            const channel = interaction.channel;
            
            if (!channel.name.startsWith('ticket-')) {
                return interaction.reply({ content: 'This is not a ticket channel.', ephemeral: true });
            }

            try {
                await channel.send('This ticket will be deleted in 5 seconds...');
                setTimeout(async () => {
                    await channel.delete().catch(() => {});
                }, 5000);
                
                await interaction.reply({ content: 'Ticket closed successfully.', ephemeral: true });
            } catch (error) {
                console.error('Error closing ticket:', error);
                await interaction.reply({ content: 'Failed to close ticket.', ephemeral: true });
            }
        }
    },
};

