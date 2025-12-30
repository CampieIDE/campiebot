const { getGuildConfig } = require('../utils/configManager');

const badWordsList = [
    'badword1', 'badword2', 'spam', 'scam'
    // Add more bad words as needed
];

const userMessageHistory = new Map();

function checkMessage(message, client) {
    if (!message.guild) return;
    
    const config = getGuildConfig(message.guild.id);
    if (!config.automod.enabled) return;

    const content = message.content.toLowerCase();
    const userId = message.author.id;
    const now = Date.now();

    // Initialize user history
    if (!userMessageHistory.has(userId)) {
        userMessageHistory.set(userId, []);
    }
    const history = userMessageHistory.get(userId);

    // Clean old messages (older than 10 seconds)
    const recentHistory = history.filter(msg => now - msg.timestamp < 10000);
    userMessageHistory.set(userId, recentHistory);
    recentHistory.push({ content, timestamp: now });

    // Check for bad words
    if (config.automod.badWords.length > 0 || badWordsList.length > 0) {
        const allBadWords = [...config.automod.badWords, ...badWordsList];
        const hasBadWord = allBadWords.some(word => content.includes(word.toLowerCase()));
        if (hasBadWord) {
            message.delete().catch(() => {});
            message.author.send('Your message was deleted for containing inappropriate content.').catch(() => {});
            return;
        }
    }

    // Check for excessive caps
    if (content.length > 10) {
        const capsCount = (content.match(/[A-Z]/g) || []).length;
        const capsPercentage = (capsCount / content.length) * 100;
        if (capsPercentage > config.automod.maxCaps) {
            message.delete().catch(() => {});
            message.author.send('Your message was deleted for excessive capitalization.').catch(() => {});
            return;
        }
    }

    // Check for excessive mentions
    const mentionCount = message.mentions.users.size + message.mentions.roles.size;
    if (mentionCount > config.automod.maxMentions) {
        message.delete().catch(() => {});
        message.author.send('Your message was deleted for excessive mentions.').catch(() => {});
        return;
    }

    // Check for excessive links
    const linkCount = (content.match(/https?:\/\/[^\s]+/g) || []).length;
    if (linkCount > config.automod.maxLinks) {
        message.delete().catch(() => {});
        message.author.send('Your message was deleted for excessive links.').catch(() => {});
        return;
    }

    // Check for spam (repeated messages)
    if (recentHistory.length >= config.automod.spamThreshold) {
        const uniqueMessages = new Set(recentHistory.map(msg => msg.content));
        if (uniqueMessages.size <= 2) {
            message.delete().catch(() => {});
            message.author.send('Your message was deleted for spam.').catch(() => {});
            return;
        }
    }
}

module.exports = {
    checkMessage
};


