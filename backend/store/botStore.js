let bots = []; // Shared bots array
let nextBotId = 1; // Counter for bot ID

// Initialize bots with some dummy data for testing
/*
bots = [
    { botId: 1, status: 'IDLE', currentOrder: null },
    // Add more bot objects as needed
];*/

module.exports = {
  getBots: () => bots,
  addBot: (bot) => {
    bot.botId = nextBotId++;
    bots.push(bot);
  },
  removeBot: (botId) => {
    bots = bots.filter(bot => bot.botId !== botId);
  },
  getNextBotId: () => nextBotId
};