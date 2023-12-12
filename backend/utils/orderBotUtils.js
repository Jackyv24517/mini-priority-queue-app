const botStore = require('../store/botStore'); // Adjust the path as needed

function assignOrdersToBots(orderHeap, bots) {
  // const bots = botStore.getBots();
  bots.filter(bot => bot.status === 'IDLE').forEach(bot => {
    if (!orderHeap.isEmpty()) {
      const order = orderHeap.extractMax();
      bot.status = 'BUSY';
      bot.currentOrder = order.orderId;
      order.status = 'PROCESSING';
      order.botId = bot.botId;
      // Simulate the processing time (10 seconds)
      setTimeout(() => completeOrder(order, bot, orderHeap), 10000);
    }
  });
}

function completeOrder(order, bot, orderHeap) {
  order.status = 'COMPLETED';
  bot.status = 'IDLE';
  bot.currentOrder = null;
  // Update the bot in botStore
  botStore.updateBot(bot);
  // Emit a WebSocket update if necessary
  assignOrdersToBots(orderHeap); // Check for more orders to process
}

module.exports = {
  assignOrdersToBots,
  completeOrder,
};
