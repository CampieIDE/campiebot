const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'guildConfig.json');

function getGuildConfig(guildId) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    if (!config[guildId]) {
        config[guildId] = {
            automod: {
                enabled: false,
                badWords: [],
                maxCaps: 70,
                maxMentions: 5,
                maxLinks: 3,
                spamThreshold: 5
            },
            moderation: {
                kickRole: null,
                banRole: null,
                modLogChannel: null
            },
            music: {
                enabled: true,
                maxQueue: 50
            },
            tickets: {
                enabled: false,
                categoryId: null,
                supportRole: null
            },
            games: {
                enabled: true
            }
        };
        saveGuildConfig(config);
    }
    return config[guildId];
}

function saveGuildConfig(config) {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

function updateGuildConfig(guildId, updates) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    if (!config[guildId]) {
        config[guildId] = {};
    }
    Object.assign(config[guildId], updates);
    saveGuildConfig(config);
}

module.exports = {
    getGuildConfig,
    saveGuildConfig,
    updateGuildConfig
};


