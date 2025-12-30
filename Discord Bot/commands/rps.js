const { SlashCommandBuilder } = require('discord.js');

const choices = ['rock', 'paper', 'scissors'];
const emojis = {
    rock: '🪨',
    paper: '📄',
    scissors: '✂️'
};

function determineWinner(userChoice, botChoice) {
    if (userChoice === botChoice) return 'tie';
    if (
        (userChoice === 'rock' && botChoice === 'scissors') ||
        (userChoice === 'paper' && botChoice === 'rock') ||
        (userChoice === 'scissors' && botChoice === 'paper')
    ) {
        return 'user';
    }
    return 'bot';
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rps')
        .setDescription('Play rock paper scissors')
        .addStringOption(option =>
            option.setName('choice')
                .setDescription('Your choice')
                .setRequired(true)
                .addChoices(
                    { name: 'Rock', value: 'rock' },
                    { name: 'Paper', value: 'paper' },
                    { name: 'Scissors', value: 'scissors' }
                )),

    async execute(interaction) {
        const userChoice = interaction.options.getString('choice');
        const botChoice = choices[Math.floor(Math.random() * choices.length)];
        const result = determineWinner(userChoice, botChoice);

        let resultText;
        if (result === 'tie') {
            resultText = "It's a tie!";
        } else if (result === 'user') {
            resultText = 'You win! 🎉';
        } else {
            resultText = 'I win! 😎';
        }

        await interaction.reply({
            embeds: [{
                title: 'Rock Paper Scissors',
                description: `**You:** ${emojis[userChoice]} ${userChoice}\n**Bot:** ${emojis[botChoice]} ${botChoice}\n\n${resultText}`,
                color: result === 'tie' ? 0xffff00 : result === 'user' ? 0x00ff00 : 0xff0000
            }]
        });
    },
};

