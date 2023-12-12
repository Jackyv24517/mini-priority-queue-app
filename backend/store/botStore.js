let bots = []; // Shared bots array
let nextBotId = 1; // Counter for bot ID

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