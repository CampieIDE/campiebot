const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getGameState, setGameState, deleteGameState, createGameId } = require('../utils/gameState');

const pieces = {
    'r': '🔴', // Red piece
    'R': '👑', // Red king
    'b': '⚫', // Black piece
    'B': '👑', // Black king
    ' ': '⬜'
};

function createBoard() {
    const board = Array(8).fill(null).map(() => Array(8).fill(' '));
    // Place checkers pieces
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 8; col++) {
            if ((row + col) % 2 === 1) {
                board[row][col] = 'r'; // Red pieces
            }
        }
    }
    for (let row = 5; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if ((row + col) % 2 === 1) {
                board[row][col] = 'b'; // Black pieces
            }
        }
    }
    return board;
}

function boardToString(board) {
    let str = '  1 2 3 4 5 6 7 8\n';
    for (let i = 0; i < 8; i++) {
        str += `${String.fromCharCode(65 + i)} `;
        for (let j = 0; j < 8; j++) {
            str += pieces[board[i][j]] + ' ';
        }
        str += `${String.fromCharCode(65 + i)}\n`;
    }
    str += '  1 2 3 4 5 6 7 8';
    return str;
}

function isValidMove(board, from, to, isRed) {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    
    if (fromRow < 0 || fromRow > 7 || fromCol < 0 || fromCol > 7) return false;
    if (toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) return false;
    
    const piece = board[fromRow][fromCol];
    const target = board[toRow][toCol];
    
    if (piece === ' ') return false;
    if (target !== ' ') return false;
    
    // Check if piece belongs to current player
    const pieceIsRed = piece === 'r' || piece === 'R';
    if (pieceIsRed !== isRed) return false;
    
    // Check if destination is on dark square
    if ((toRow + toCol) % 2 === 0) return false;
    
    const rowDiff = toRow - fromRow;
    const colDiff = Math.abs(toCol - fromCol);
    
    // Regular pieces can only move forward
    if (piece === 'r' || piece === 'b') {
        if (isRed) {
            if (rowDiff <= 0) return false; // Red moves down (increasing row)
        } else {
            if (rowDiff >= 0) return false; // Black moves up (decreasing row)
        }
    }
    
    // Check diagonal move
    if (Math.abs(rowDiff) !== colDiff) return false;
    
    // Regular move (one square)
    if (Math.abs(rowDiff) === 1) return true;
    
    // Jump move (two squares)
    if (Math.abs(rowDiff) === 2) {
        const middleRow = fromRow + (rowDiff / 2);
        const middleCol = fromCol + (toCol > fromCol ? 1 : -1);
        const middlePiece = board[middleRow][middleCol];
        
        if (middlePiece === ' ') return false;
        
        const middleIsRed = middlePiece === 'r' || middlePiece === 'R';
        if (middleIsRed === isRed) return false; // Can't jump own piece
        
        return true;
    }
    
    return false;
}

function makeMove(board, from, to) {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    
    const piece = board[fromRow][fromCol];
    board[toRow][toCol] = piece;
    board[fromRow][fromCol] = ' ';
    
    // Handle jump
    if (Math.abs(toRow - fromRow) === 2) {
        const middleRow = fromRow + (toRow - fromRow) / 2;
        const middleCol = fromCol + (toCol > fromCol ? 1 : -1);
        board[middleRow][middleCol] = ' ';
    }
    
    // King promotion
    if (piece === 'r' && toRow === 7) {
        board[toRow][toCol] = 'R';
    } else if (piece === 'b' && toRow === 0) {
        board[toRow][toCol] = 'B';
    }
}

function parseMove(move) {
    if (move.length < 4) return null;
    const from = move.substring(0, 2);
    const to = move.substring(2, 4);
    
    const fromRow = from.charCodeAt(0) - 65;
    const fromCol = parseInt(from[1]) - 1;
    const toRow = to.charCodeAt(0) - 65;
    const toCol = parseInt(to[1]) - 1;
    
    if (fromRow < 0 || fromRow > 7 || fromCol < 0 || fromCol > 7) return null;
    if (toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) return null;
    
    return [[fromRow, fromCol], [toRow, toCol]];
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('checkers')
        .setDescription('Play checkers')
        .addSubcommand(subcommand =>
            subcommand
                .setName('start')
                .setDescription('Start a new checkers game')
                .addUserOption(option =>
                    option.setName('opponent')
                        .setDescription('Opponent to play against (optional, plays against bot if not specified)')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('move')
                .setDescription('Make a move (e.g., A3B4)')
                .addStringOption(option =>
                    option.setName('move')
                        .setDescription('Move notation (e.g., A3B4)')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('board')
                .setDescription('View the current board'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('resign')
                .setDescription('Resign from the current game')),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const gameId = createGameId(interaction.user.id, 'checkers');
        let gameState = getGameState(gameId);

        if (subcommand === 'start') {
            if (gameState) {
                return interaction.reply({ content: 'You already have an active checkers game! Use `/checkers board` to view it or `/checkers resign` to end it.', ephemeral: true });
            }

            const opponent = interaction.options.getUser('opponent');
            const isTwoPlayer = opponent !== null;
            
            gameState = {
                board: createBoard(),
                currentPlayer: 'red',
                redPlayer: interaction.user.id,
                blackPlayer: opponent ? opponent.id : 'bot',
                isTwoPlayer,
                timestamp: Date.now()
            };
            
            setGameState(gameId, gameState);
            
            if (isTwoPlayer) {
                const opponentGameId = createGameId(opponent.id, 'checkers');
                setGameState(opponentGameId, gameState);
            }

            const embed = new EmbedBuilder()
                .setTitle('🔴⚫ Checkers Game Started')
                .setDescription(`**Red:** <@${interaction.user.id}>\n**Black:** ${isTwoPlayer ? `<@${opponent.id}>` : 'Bot'}\n\n${boardToString(gameState.board)}`)
                .setColor(0xff0000)
                .setFooter({ text: 'Use /checkers move <move> to make a move (e.g., A3B4)' });

            await interaction.reply({ embeds: [embed] });
            return;
        }

        if (!gameState) {
            return interaction.reply({ content: 'You don\'t have an active checkers game! Use `/checkers start` to begin one.', ephemeral: true });
        }

        if (subcommand === 'board') {
            const embed = new EmbedBuilder()
                .setTitle('🔴⚫ Checkers Board')
                .setDescription(`**Current Player:** ${gameState.currentPlayer === 'red' ? 'Red' : 'Black'}\n\n${boardToString(gameState.board)}`)
                .setColor(gameState.currentPlayer === 'red' ? 0xff0000 : 0x000000);

            await interaction.reply({ embeds: [embed] });
            return;
        }

        if (subcommand === 'resign') {
            const winner = gameState.currentPlayer === 'red' ? 'Black' : 'Red';
            deleteGameState(gameId);
            if (gameState.isTwoPlayer) {
                const opponentId = gameState.currentPlayer === 'red' ? gameState.blackPlayer : gameState.redPlayer;
                const opponentGameId = createGameId(opponentId, 'checkers');
                deleteGameState(opponentGameId);
            }
            
            await interaction.reply({ content: `🏳️ You resigned! ${winner} wins!` });
            return;
        }

        if (subcommand === 'move') {
            const isRed = gameState.currentPlayer === 'red';
            const isPlayerTurn = (isRed && gameState.redPlayer === interaction.user.id) ||
                                 (!isRed && gameState.blackPlayer === interaction.user.id);

            if (!isPlayerTurn && gameState.isTwoPlayer) {
                return interaction.reply({ content: 'It\'s not your turn!', ephemeral: true });
            }

            const moveStr = interaction.options.getString('move').toUpperCase();
            const move = parseMove(moveStr);

            if (!move) {
                return interaction.reply({ content: 'Invalid move format! Use notation like A3B4 (from A3 to B4).', ephemeral: true });
            }

            const [from, to] = move;
            if (!isValidMove(gameState.board, from, to, isRed)) {
                return interaction.reply({ content: 'Invalid move! Make sure you\'re moving diagonally and following checkers rules.', ephemeral: true });
            }

            // Make the move
            makeMove(gameState.board, from, to);
            gameState.currentPlayer = gameState.currentPlayer === 'red' ? 'black' : 'red';

            setGameState(gameId, gameState);
            if (gameState.isTwoPlayer) {
                const opponentId = gameState.currentPlayer === 'red' ? gameState.redPlayer : gameState.blackPlayer;
                const opponentGameId = createGameId(opponentId, 'checkers');
                setGameState(opponentGameId, gameState);
            }

            const embed = new EmbedBuilder()
                .setTitle('🔴⚫ Move Made')
                .setDescription(`**Move:** ${moveStr}\n**Current Player:** ${gameState.currentPlayer === 'red' ? 'Red' : 'Black'}\n\n${boardToString(gameState.board)}`)
                .setColor(gameState.currentPlayer === 'red' ? 0xff0000 : 0x000000);

            await interaction.reply({ embeds: [embed] });
        }
    },
};

