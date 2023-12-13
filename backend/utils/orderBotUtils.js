const botStore = require('../store/botStore');

function completeOrder(order, bot, orderHeap) {
  order.status = 'COMPLETED';
  bot.status = 'IDLE';
  bot.currentOrder = null;

  console.log("all bots before update: ", botStore.getBots());
  // Update the bot in botStore
  botStore.updateBot(bot);

  console.log("all bots: ", botStore.getBots());
  // Emit a WebSocket update if necessary
  assignOrdersToBots(orderHeap, botStore.getBots()); // Check for more orders to process
}

function assignOrdersToBots(orderHeap, bots) {
  // check if there is any idle bots to process order
  const idleBots = bots.filter(bot => bot.status === 'IDLE');
  if (idleBots.length === 0) {
    console.log("No idle bots available to process orders.");
    return;
  }

  bots.filter(bot => bot.status === 'IDLE').forEach(bot => {
    if (!orderHeap.isEmpty()) {
      const order = orderHeap.extractMax();
      console.log(`${bot.botId} is assigned to handle ${order.orderId}`);
     
      bot.status = 'BUSY';
      bot.currentOrder = order.orderId;
      order.status = 'PROCESSING';
      order.botId = bot.botId;
      // Simulate the processing time (10 seconds)
      setTimeout(() => completeOrder(order, bot, orderHeap), 10000);
    }
  });
}

module.exports = {
  assignOrdersToBots,
  completeOrder,
};
