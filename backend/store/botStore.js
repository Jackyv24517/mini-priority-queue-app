let bots = []; // Shared bots array
let nextBotId = 1; // Counter for bot ID

const { assignOrdersToBots } = require('../utils/orderBotUtils');

// Initialize bots with some dummy data for testing
/*
bots = [
    { botId: 1, status: 'IDLE', currentOrder: null },
    // Add more bot objects as needed
];*/

module.exports = {
  getBots: () => bots,
  updateBot: (updatedBot) => {
    const botIndex = bots.findIndex(bot => bot.botId === updatedBot.botId);
    if (botIndex !== -1) {
      bots[botIndex] = updatedBot;
    }
  },
  addBot: (bot) => {
    bot.botId = nextBotId++;
    bots.push(bot);
  },
  removeBot: (botId) => {
    bots = bots.filter(bot => bot.botId !== botId);
  },
  /*
  removeNewestBot: (orderHeap, updateOrderStatus) => {
    if (bots.length === 0) {
        console.log("No bots available to remove.");
        return null;
      }
  
      // If there's only one bot, it's both the newest and the last
      const botToRemove = bots.length === 1 ? bots[0] : bots.reduce((newest, bot) => bot.botId > newest.botId ? bot : newest, bots[0]);
  
      if (botToRemove.status === 'BUSY' && botToRemove.currentOrder) {
        // Find and update the order in the heap
        const orderIndex = orderHeap.findIndex(order => order.orderId === botToRemove.currentOrder);
        if (orderIndex !== -1) {
          orderHeap[orderIndex].status = 'PENDING';
          updateOrderStatus(orderHeap[orderIndex].orderId, 'PENDING'); // Emit WebSocket update if necessary
        }
      }
  
      // Remove the bot
      bots = bots.filter(bot => bot.botId !== botToRemove.botId);
      console.log(`Bot ${botToRemove.botId} removed.`);
      console.log("Bots list after deletion: ", bots);
      return botToRemove;
    },*/
    removeNewestBot: (orderHeap, updateOrderStatus) => {
        if (bots.length === 0) {
          console.log("No bots available to remove.");
          return null;
        }
    
        const botToRemove = bots.length === 1 ? bots[0] : bots.reduce((newest, bot) => bot.botId > newest.botId ? bot : newest, bots[0]);
    
        if (botToRemove.status === 'BUSY' && botToRemove.currentOrder) {
          const orderIndex = orderHeap.findIndex(order => order.orderId === botToRemove.currentOrder);
          if (orderIndex !== -1) {
            orderHeap[orderIndex].status = 'PENDING';
            updateOrderStatus(orderHeap[orderIndex].orderId, 'PENDING'); // Emit WebSocket update if necessary
            orderHeap.insert(orderHeap[orderIndex]); // Re-insert the order back into the heap
          }
        }
    
        bots = bots.filter(bot => bot.botId !== botToRemove.botId);
        assignOrdersToBots(orderHeap, bots); // Reassign orders to available bots
    
        return botToRemove;
    },
    getNextBotId: () => nextBotId
};