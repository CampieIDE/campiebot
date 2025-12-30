const { ChannelType, PermissionFlagsBits } = require('discord.js');
const { getGuildConfig } = require('../utils/configManager');

async function createTicket(interaction, client) {
    const config = getGuildConfig(interaction.guild.id);
    
    if (!config.tickets.enabled) {
        return interaction.reply({ content: 'Ticket system is not enabled. Use `/setup tickets` to enable it.', ephemeral: true });
    }

    const ticketNumber = Math.floor(Math.random() * 10000);
    const channelName = `ticket-${ticketNumber}`;

    try {
        const channel = await interaction.guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            parent: config.tickets.categoryId,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionFlagsBits.ViewChannel]
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
                },
                {
                    id: config.tickets.supportRole,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
                }
            ]
        });

        await channel.send({
            content: `Welcome ${interaction.user}! Support will be with you shortly.\n\nUse \`/close\` to close this ticket.`,
            embeds: [{
                title: 'Ticket Created',
                description: `Ticket #${ticketNumber}`,
                color: 0x00ff00,
                timestamp: new Date().toISOString()
            }]
        });

        await interaction.reply({ content: `Ticket created: ${channel}`, ephemeral: true });
    } catch (error) {
        console.error('Error creating ticket:', error);
        await interaction.reply({ content: 'Failed to create ticket. Please contact an administrator.', ephemeral: true });
    }
}

async function closeTicket(interaction, client) {
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

module.exports = {
    createTicket,
    closeTicket
};


