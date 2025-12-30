// In-memory game state storage (no database needed)
const gameStates = new Map();

function getGameState(gameId) {
    return gameStates.get(gameId);
}

function setGameState(gameId, state) {
    gameStates.set(gameId, state);
}

function deleteGameState(gameId) {
    gameStates.delete(gameId);
}

function createGameId(userId, gameType) {
    return `${gameType}_${userId}`;
}

// Clean up old games (older than 1 hour)
setInterval(() => {
    const now = Date.now();
    for (const [gameId, state] of gameStates.entries()) {
        if (state.timestamp && now - state.timestamp > 3600000) {
            gameStates.delete(gameId);
        }
    }
}, 60000); // Check every minute

module.exports = {
    getGameState,
    setGameState,
    deleteGameState,
    createGameId
};

