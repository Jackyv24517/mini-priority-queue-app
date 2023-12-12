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
  removeNewestBot: (orderHeap, updateOrderStatus) => {
    if (bots.length === 0) {
      return null;
    }

    // Assuming the newest bot has the highest botId
    const newestBot = bots.reduce((max, bot) => (bot.botId > max.botId ? bot : max), bots[0]);

    // Handle if the bot is processing an order
    if (newestBot.status === 'BUSY' && newestBot.currentOrder) {
      const orderIndex = orderHeap.findIndex(order => order.orderId === newestBot.currentOrder);
      if (orderIndex !== -1) {
        orderHeap[orderIndex].status = 'PENDING';
        updateOrderStatus(orderHeap[orderIndex].orderId, 'PENDING'); // Emit WebSocket update order status
      }
    }

    // Remove the bot
    bots = bots.filter(bot => bot.botId !== newestBot.botId);

    return newestBot;
  },
  getNextBotId: () => nextBotId
};