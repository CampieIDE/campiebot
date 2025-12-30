const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getGameState, setGameState, deleteGameState, createGameId } = require('../utils/gameState');

const words = [
    'javascript', 'discord', 'computer', 'programming', 'algorithm', 'function',
    'variable', 'constant', 'array', 'object', 'string', 'number', 'boolean',
    'loop', 'condition', 'method', 'class', 'module', 'package', 'library',
    'framework', 'database', 'server', 'client', 'network', 'protocol',
    'encryption', 'security', 'authentication', 'authorization', 'session',
    'cookie', 'token', 'api', 'rest', 'graphql', 'websocket', 'http',
    'https', 'tcp', 'udp', 'dns', 'ip', 'domain', 'hosting', 'deployment',
    'version', 'control', 'git', 'github', 'repository', 'branch', 'commit',
    'merge', 'pull', 'push', 'clone', 'fork', 'issue', 'pullrequest',
    'testing', 'debugging', 'error', 'exception', 'logging', 'monitoring',
    'performance', 'optimization', 'scalability', 'reliability', 'availability',
    'maintainability', 'readability', 'documentation', 'comment', 'syntax',
    'semantic', 'compiler', 'interpreter', 'runtime', 'environment',
    'development', 'production', 'staging', 'deployment', 'ci', 'cd',
    'automation', 'integration', 'continuous', 'delivery', 'pipeline'
];

function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
}

function displayWord(word, guessedLetters) {
    return word.split('').map(letter => 
        guessedLetters.includes(letter.toLowerCase()) ? letter : '_'
    ).join(' ');
}

function displayHangman(wrongGuesses) {
    const stages = [
        '',
        '   |\n   |\n   |',
        '   |\n   |\n   |\n   O',
        '   |\n   |\n   |\n   O\n   |',
        '   |\n   |\n   |\n   O\n  /|',
        '   |\n   |\n   |\n   O\n  /|\\',
        '   |\n   |\n   |\n   O\n  /|\\\n  /',
        '   |\n   |\n   |\n   O\n  /|\\\n  / \\'
    ];
    return stages[wrongGuesses] || '';
}

function checkWin(word, guessedLetters) {
    return word.split('').every(letter => guessedLetters.includes(letter.toLowerCase()));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hangman')
        .setDescription('Play hangman')
        .addSubcommand(subcommand =>
            subcommand
                .setName('start')
                .setDescription('Start a new hangman game'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('guess')
                .setDescription('Guess a letter')
                .addStringOption(option =>
                    option.setName('letter')
                        .setDescription('Letter to guess')
                        .setRequired(true)
                        .setMaxLength(1)
                        .setMinLength(1)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('status')
                .setDescription('View current game status'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('giveup')
                .setDescription('Give up and reveal the word')),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const gameId = createGameId(interaction.user.id, 'hangman');
        let gameState = getGameState(gameId);

        if (subcommand === 'start') {
            if (gameState) {
                return interaction.reply({ content: 'You already have an active hangman game! Use `/hangman status` to view it or `/hangman giveup` to end it.', ephemeral: true });
            }

            const word = getRandomWord();
            gameState = {
                word: word.toLowerCase(),
                guessedLetters: [],
                wrongGuesses: 0,
                timestamp: Date.now()
            };
            
            setGameState(gameId, gameState);

            const embed = new EmbedBuilder()
                .setTitle('🎯 Hangman Game Started!')
                .setDescription(`Word: ${displayWord(gameState.word, gameState.guessedLetters)}\n\nWrong guesses: ${gameState.wrongGuesses}/7\n\n\`\`\`\n${displayHangman(gameState.wrongGuesses)}\n\`\`\``)
                .setColor(0x00ff00)
                .setFooter({ text: 'Use /hangman guess <letter> to guess a letter' });

            await interaction.reply({ embeds: [embed] });
            return;
        }

        if (!gameState) {
            return interaction.reply({ content: 'You don\'t have an active hangman game! Use `/hangman start` to begin one.', ephemeral: true });
        }

        if (subcommand === 'status') {
            const isWon = checkWin(gameState.word, gameState.guessedLetters);
            const isLost = gameState.wrongGuesses >= 7;

            const embed = new EmbedBuilder()
                .setTitle('🎯 Hangman Game Status')
                .setDescription(`Word: ${displayWord(gameState.word, gameState.guessedLetters)}\n\nGuessed letters: ${gameState.guessedLetters.length > 0 ? gameState.guessedLetters.join(', ') : 'None'}\nWrong guesses: ${gameState.wrongGuesses}/7\n\n\`\`\`\n${displayHangman(gameState.wrongGuesses)}\n\`\`\``)
                .setColor(isWon ? 0x00ff00 : isLost ? 0xff0000 : 0xffff00)
                .setFooter({ text: isWon ? 'You won! 🎉' : isLost ? 'Game Over! 😢' : 'Keep guessing!' });

            await interaction.reply({ embeds: [embed] });
            return;
        }

        if (subcommand === 'giveup') {
            deleteGameState(gameId);
            
            const embed = new EmbedBuilder()
                .setTitle('🏳️ You Gave Up!')
                .setDescription(`The word was: **${gameState.word}**\n\n\`\`\`\n${displayHangman(gameState.wrongGuesses)}\n\`\`\``)
                .setColor(0xff9900);

            await interaction.reply({ embeds: [embed] });
            return;
        }

        if (subcommand === 'guess') {
            const letter = interaction.options.getString('letter').toLowerCase();

            if (!letter.match(/[a-z]/)) {
                return interaction.reply({ content: 'Please guess a valid letter (a-z)!', ephemeral: true });
            }

            if (gameState.guessedLetters.includes(letter)) {
                return interaction.reply({ content: `You already guessed "${letter}"!`, ephemeral: true });
            }

            gameState.guessedLetters.push(letter);

            if (!gameState.word.includes(letter)) {
                gameState.wrongGuesses++;
            }

            setGameState(gameId, gameState);

            const isWon = checkWin(gameState.word, gameState.guessedLetters);
            const isLost = gameState.wrongGuesses >= 7;

            if (isWon) {
                deleteGameState(gameId);
                const embed = new EmbedBuilder()
                    .setTitle('🎉 You Won!')
                    .setDescription(`The word was: **${gameState.word}**\n\nWord: ${displayWord(gameState.word, gameState.guessedLetters)}\nWrong guesses: ${gameState.wrongGuesses}/7\n\n\`\`\`\n${displayHangman(gameState.wrongGuesses)}\n\`\`\``)
                    .setColor(0x00ff00);

                await interaction.reply({ embeds: [embed] });
                return;
            }

            if (isLost) {
                deleteGameState(gameId);
                const embed = new EmbedBuilder()
                    .setTitle('💀 Game Over!')
                    .setDescription(`The word was: **${gameState.word}**\n\nWord: ${displayWord(gameState.word, gameState.guessedLetters)}\nWrong guesses: ${gameState.wrongGuesses}/7\n\n\`\`\`\n${displayHangman(gameState.wrongGuesses)}\n\`\`\``)
                    .setColor(0xff0000);

                await interaction.reply({ embeds: [embed] });
                return;
            }

            const embed = new EmbedBuilder()
                .setTitle('🎯 Guess Made!')
                .setDescription(`${letter.toUpperCase()} ${gameState.word.includes(letter) ? '✅ is in the word!' : '❌ is not in the word!'}\n\nWord: ${displayWord(gameState.word, gameState.guessedLetters)}\n\nGuessed letters: ${gameState.guessedLetters.join(', ')}\nWrong guesses: ${gameState.wrongGuesses}/7\n\n\`\`\`\n${displayHangman(gameState.wrongGuesses)}\n\`\`\``)
                .setColor(gameState.word.includes(letter) ? 0x00ff00 : 0xff0000)
                .setFooter({ text: 'Keep guessing!' });

            await interaction.reply({ embeds: [embed] });
        }
    },
};

