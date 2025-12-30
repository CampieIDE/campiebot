const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const { getGuildConfig } = require('../utils/configManager');
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');

const musicQueues = new Map();
const audioPlayers = new Map();

function getQueue(guildId) {
    if (!musicQueues.has(guildId)) {
        musicQueues.set(guildId, {
            songs: [],
            volume: 5,
            playing: false
        });
    }
    return musicQueues.get(guildId);
}

async function playMusic(guild, voiceChannel, song) {
    const queue = getQueue(guild.id);
    
    try {
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator
        });

        let resource;
        
        // Check if it's a local file
        const localPath = path.join(__dirname, '..', 'music', song);
        if (fs.existsSync(localPath)) {
            resource = createAudioResource(localPath);
        } else if (ytdl.validateURL(song)) {
            // YouTube URL
            const stream = ytdl(song, { filter: 'audioonly', quality: 'highestaudio' });
            resource = createAudioResource(stream);
        } else {
            throw new Error('Invalid song source');
        }

        const player = createAudioPlayer();
        audioPlayers.set(guild.id, player);

        player.play(resource);
        connection.subscribe(player);

        player.on(AudioPlayerStatus.Idle, () => {
            queue.songs.shift();
            if (queue.songs.length > 0) {
                playMusic(guild, voiceChannel, queue.songs[0]);
            } else {
                queue.playing = false;
                connection.destroy();
            }
        });

        player.on('error', error => {
            console.error('Audio player error:', error);
            queue.songs.shift();
            if (queue.songs.length > 0) {
                playMusic(guild, voiceChannel, queue.songs[0]);
            } else {
                queue.playing = false;
                connection.destroy();
            }
        });

        queue.playing = true;
    } catch (error) {
        console.error('Error playing music:', error);
        queue.playing = false;
        throw error;
    }
}

function addToQueue(guildId, song) {
    const queue = getQueue(guildId);
    const config = getGuildConfig(guildId);
    
    if (queue.songs.length >= config.music.maxQueue) {
        throw new Error(`Queue is full! Maximum ${config.music.maxQueue} songs allowed.`);
    }
    
    queue.songs.push(song);
    return queue;
}

function skipSong(guildId) {
    const player = audioPlayers.get(guildId);
    if (player) {
        player.stop();
    }
}

function stopMusic(guildId) {
    const queue = getQueue(guildId);
    const player = audioPlayers.get(guildId);
    
    queue.songs = [];
    queue.playing = false;
    
    if (player) {
        player.stop();
    }
}

function getQueueList(guildId) {
    return getQueue(guildId).songs;
}

module.exports = {
    playMusic,
    addToQueue,
    skipSong,
    stopMusic,
    getQueueList,
    getQueue
};

