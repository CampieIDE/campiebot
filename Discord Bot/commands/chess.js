const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getGameState, setGameState, deleteGameState, createGameId } = require('../utils/gameState');

const pieces = {
    'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
    'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙',
    ' ': '⬜'
};

function createBoard() {
    const board = Array(8).fill(null).map(() => Array(8).fill(' '));
    // Place pieces
    const backRow = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
    for (let i = 0; i < 8; i++) {
        board[0][i] = backRow[i];
        board[1][i] = 'p';
        board[6][i] = 'P';
        board[7][i] = backRow[i].toUpperCase();
    }
    return board;
}

function boardToString(board) {
    let str = '   a b c d e f g h\n';
    for (let i = 0; i < 8; i++) {
        str += `${8 - i} `;
        for (let j = 0; j < 8; j++) {
            str += pieces[board[i][j]] + ' ';
        }
        str += `${8 - i}\n`;
    }
    str += '   a b c d e f g h';
    return str;
}

function isValidMove(board, from, to, isWhite) {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    
    if (fromRow < 0 || fromRow > 7 || fromCol < 0 || fromCol > 7) return false;
    if (toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) return false;
    
    const piece = board[fromRow][fromCol];
    const target = board[toRow][toCol];
    
    if (piece === ' ') return false;
    
    const pieceIsWhite = piece === piece.toUpperCase();
    if (pieceIsWhite !== isWhite) return false;
    
    if (target !== ' ' && (target === target.toUpperCase()) === isWhite) return false;
    
    // Simple move validation (basic rules)
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);
    
    const pieceType = piece.toLowerCase();
    
    if (pieceType === 'p') {
        // Pawn moves
        if (isWhite) {
            if (fromRow === 6 && toRow === 4 && fromCol === toCol && target === ' ') return true;
            if (toRow === fromRow - 1 && fromCol === toCol && target === ' ') return true;
            if (toRow === fromRow - 1 && colDiff === 1 && target !== ' ') return true;
        } else {
            if (fromRow === 1 && toRow === 3 && fromCol === toCol && target === ' ') return true;
            if (toRow === fromRow + 1 && fromCol === toCol && target === ' ') return true;
            if (toRow === fromRow + 1 && colDiff === 1 && target !== ' ') return true;
        }
        return false;
    }
    
    if (pieceType === 'r') {
        // Rook moves
        return (rowDiff === 0 || colDiff === 0);
    }
    
    if (pieceType === 'b') {
        // Bishop moves
        return rowDiff === colDiff;
    }
    
    if (pieceType === 'q') {
        // Queen moves
        return (rowDiff === 0 || colDiff === 0 || rowDiff === colDiff);
    }
    
    if (pieceType === 'k') {
        // King moves
        return rowDiff <= 1 && colDiff <= 1;
    }
    
    if (pieceType === 'n') {
        // Knight moves
        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
    }
    
    return false;
}

function parseMove(move) {
    if (move.length < 4) return null;
    const from = move.substring(0, 2);
    const to = move.substring(2, 4);
    
    const fromCol = from.charCodeAt(0) - 97;
    const fromRow = 8 - parseInt(from[1]);
    const toCol = to.charCodeAt(0) - 97;
    const toRow = 8 - parseInt(to[1]);
    
    if (fromCol < 0 || fromCol > 7 || fromRow < 0 || fromRow > 7) return null;
    if (toCol < 0 || toCol > 7 || toRow < 0 || toRow > 7) return null;
    
    return [[fromRow, fromCol], [toRow, toCol]];
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chess')
        .setDescription('Play chess')
        .addSubcommand(subcommand =>
            subcommand
                .setName('start')
                .setDescription('Start a new chess game')
                .addUserOption(option =>
                    option.setName('opponent')
                        .setDescription('Opponent to play against (optional, plays against bot if not specified)')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('move')
                .setDescription('Make a move (e.g., e2e4)')
                .addStringOption(option =>
                    option.setName('move')
                        .setDescription('Move in algebraic notation (e.g., e2e4)')
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
        const gameId = createGameId(interaction.user.id, 'chess');
        let gameState = getGameState(gameId);

        if (subcommand === 'start') {
            if (gameState) {
                return interaction.reply({ content: 'You already have an active chess game! Use `/chess board` to view it or `/chess resign` to end it.', ephemeral: true });
            }

            const opponent = interaction.options.getUser('opponent');
            const isTwoPlayer = opponent !== null;
            
            gameState = {
                board: createBoard(),
                currentPlayer: 'white',
                whitePlayer: interaction.user.id,
                blackPlayer: opponent ? opponent.id : 'bot',
                isTwoPlayer,
                timestamp: Date.now()
            };
            
            setGameState(gameId, gameState);
            
            if (isTwoPlayer) {
                const opponentGameId = createGameId(opponent.id, 'chess');
                setGameState(opponentGameId, gameState);
            }

            const embed = new EmbedBuilder()
                .setTitle('♟️ Chess Game Started')
                .setDescription(`**White:** <@${interaction.user.id}>\n**Black:** ${isTwoPlayer ? `<@${opponent.id}>` : 'Bot'}\n\n${boardToString(gameState.board)}`)
                .setColor(0xffffff)
                .setFooter({ text: 'Use /chess move <move> to make a move (e.g., e2e4)' });

            await interaction.reply({ embeds: [embed] });
            return;
        }

        if (!gameState) {
            return interaction.reply({ content: 'You don\'t have an active chess game! Use `/chess start` to begin one.', ephemeral: true });
        }

        if (subcommand === 'board') {
            const embed = new EmbedBuilder()
                .setTitle('♟️ Chess Board')
                .setDescription(`**Current Player:** ${gameState.currentPlayer === 'white' ? 'White' : 'Black'}\n\n${boardToString(gameState.board)}`)
                .setColor(0xffffff);

            await interaction.reply({ embeds: [embed] });
            return;
        }

        if (subcommand === 'resign') {
            const winner = gameState.currentPlayer === 'white' ? 'Black' : 'White';
            deleteGameState(gameId);
            if (gameState.isTwoPlayer) {
                const opponentId = gameState.currentPlayer === 'white' ? gameState.blackPlayer : gameState.whitePlayer;
                const opponentGameId = createGameId(opponentId, 'chess');
                deleteGameState(opponentGameId);
            }
            
            await interaction.reply({ content: `🏳️ You resigned! ${winner} wins!` });
            return;
        }

        if (subcommand === 'move') {
            const isWhite = gameState.currentPlayer === 'white';
            const isPlayerTurn = (isWhite && gameState.whitePlayer === interaction.user.id) ||
                                 (!isWhite && gameState.blackPlayer === interaction.user.id);

            if (!isPlayerTurn && gameState.isTwoPlayer) {
                return interaction.reply({ content: 'It\'s not your turn!', ephemeral: true });
            }

            const moveStr = interaction.options.getString('move').toLowerCase();
            const move = parseMove(moveStr);

            if (!move) {
                return interaction.reply({ content: 'Invalid move format! Use algebraic notation (e.g., e2e4).', ephemeral: true });
            }

            const [from, to] = move;
            if (!isValidMove(gameState.board, from, to, isWhite)) {
                return interaction.reply({ content: 'Invalid move!', ephemeral: true });
            }

            // Make the move
            const captured = gameState.board[to[0]][to[1]];
            gameState.board[to[0]][to[1]] = gameState.board[from[0]][from[1]];
            gameState.board[from[0]][from[1]] = ' ';
            gameState.currentPlayer = gameState.currentPlayer === 'white' ? 'black' : 'white';

            setGameState(gameId, gameState);
            if (gameState.isTwoPlayer) {
                const opponentId = gameState.currentPlayer === 'white' ? gameState.whitePlayer : gameState.blackPlayer;
                const opponentGameId = createGameId(opponentId, 'chess');
                setGameState(opponentGameId, gameState);
            }

            const embed = new EmbedBuilder()
                .setTitle('♟️ Move Made')
                .setDescription(`**Move:** ${moveStr}\n**Captured:** ${captured !== ' ' ? pieces[captured] : 'None'}\n**Current Player:** ${gameState.currentPlayer === 'white' ? 'White' : 'Black'}\n\n${boardToString(gameState.board)}`)
                .setColor(0xffffff);

            await interaction.reply({ embeds: [embed] });
        }
    },
};

