const express = require('express');
const router = express.Router();
const MaxHeap = require('../utils/MaxHeap');

/* Unuse imports */
//const Order = require('../models/orderModel');
// const Counter = require('../models/counterModel');
//const Bot = require('../models/botModel');
// const botStore = require('../store/botStore');
// const { assignOrdersToBots, completeOrder } = require('../utils/orderBotUtils');


// In-memory data storage init
let orders = [];
let bots = [];
let nextBotId = 1;
let nextOrderId = 1;
let orderHeap = new MaxHeap();

const { getIO } = require('../socket');

/* -- REST API ROUTES -- */
// POST /api/orders - Create a new order
router.post('/orders', async (req, res) => {
  try {
    console.log("req: ", req.body);
    const { type, details } = req.body;

    // Generate the next order ID here (you'll need to implement this logic)
    const orderId = getNextOrderId(type);

    // Create a new order
    const newOrder = {
        orderId,
        type,
        details,
        createdAt: Date.now, // Default createdAt
        status: 'PENDING' // Default status
    };
     // Add the new order to the orders array and order heap
     orders.push(newOrder);
     orderHeap.insert(newOrder);

    // Emit the new order status
    getIO().emit('orderUpdate', newOrder);


    // Assign orders immediately after adding
    assignOrdersToBots(orderHeap, bots);

    
    res.status(201).json(newOrder);
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ message: error.message });
  }
});

//Fetch all orders
router.get('/orders', async (req, res) => {
    try {
        res.json(orders);
      } catch (error) {
        res.status(500).json({ message: error.toString() });
      }
});

//delete newest bot only
router.delete('/bots/newest', (req, res) => {
    console.log("Delete newest bot function is called");
    try {
      const removedBot = removeNewestBot(orderHeap, updateOrderStatus);
      if (removedBot) {
        res.json({ message: `Bot ${removedBot.botId} removed` });
      } else {
        res.status(404).json({ message: 'No bots available to remove' });
      }
    } catch (error) {
      res.status(500).json({ message: error.toString() });
    }
});

// Add new bot
router.post('/bots', (req, res) => {
    try {
      
      const newBot = {};
      addBot(newBot, orderHeap);
  
      res.status(201).json(newBot);
    } catch (error) {
      console.log("error: ", error);
      res.status(500).json({ message: error.toString() });
    }
  });
  
  // Get all bots
  router.get('/bots', (req, res) => {
    try {
      res.json(bots);
      console.log("All Bots: ",  bots);
    } catch (error) {
      res.status(500).json({ message: error.toString() });
    }
  });

/* -- Order Methods -- */

function getNextOrderId(orderType) {
    const prefix = orderType === 'VIP' ? 'VIP-' : 'N-';
    return `${prefix}${nextOrderId++}`;
}


function completeOrder(order, bot, orderHeap) {
    order.status = 'COMPLETED';
    bot.status = 'IDLE';
    bot.currentOrder = null;
  
    console.log("all bots before update: ", bots);
    // Update the bot
    updateBot(bot);
  
    console.log("all bots: ", bots);
    // Emit a WebSocket update if necessary
    assignOrdersToBots(orderHeap); // Check for more orders to process

    // Emit an update via WebSocket
    updateOrderStatus(order.orderId, 'COMPLETED');
  }
  
  function assignOrdersToBots(orderHeap) {
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

// update order status via websocket
function updateOrderStatus(orderId, newStatus) {
    const order = orders.find(o => o.orderId === orderId);
    if (!order) {
      throw new Error('Order not found');
    }
  
    const oldStatus = order.status;
    order.status = newStatus;
  
    // Emit an event to all connected clients
    getIO().emit('orderUpdate', { ...order, oldStatus });
}

/* -- Bot Management methods -- */
function addBot(bot, orderHeap) {
    bot.botId = nextBotId++;
    bot.status = 'IDLE';
    bots.push(bot);
  
    assignOrdersToBots(orderHeap);
  }
  
  function removeNewestBot(orderHeap, updateOrderStatus) {
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
  }
  
  function updateBot(updatedBot) {
    const botIndex = bots.findIndex(bot => bot.botId === updatedBot.botId);
    if (botIndex !== -1) {
      bots[botIndex] = updatedBot;
    } else {
      console.log("Bot not found for updating:", updatedBot);
    }
  }

/*
// Helper function to get the next available bot
const getNextAvailableBot = () => {
    return bots.find(bot => bot.status === 'IDLE');
};

//Assigning Orders to Bots
async function assignOrdersToBots() {
    let availableBot = getNextAvailableBot();
  
    while (availableBot && !orderHeap.isEmpty()) {
        const order = orderHeap.extractMax(); // Get the highest priority order
    
        // Assign the order to the bot
        availableBot.status = 'BUSY';
        availableBot.currentOrder = order.orderId;
    
        // Update the order status
        order.status = 'PROCESSING';
        order.botId = availableBot.botId;

        // Emit an update via WebSocket
        updateOrderStatus(order.orderId, 'PROCESSING');
    
        // Simulate the processing time (10 seconds)
        setTimeout(() => completeOrder(order), 10000);
    
        // Try to get the next available bot for further processing
        availableBot = getNextAvailableBot();
    }
}

//complete the processing of an order
function completeOrder(order) {
    order.status = 'COMPLETED';
    const bot = bots.find(b => b.botId === order.botId);
  
    // Ensure the bot is found and correctly assigned to the completed order
    if (bot && bot.currentOrder === order.orderId) {
      bot.status = 'IDLE';
      bot.currentOrder = null;
    }
  
    // Emit an update via WebSocket
    updateOrderStatus(order.orderId, 'COMPLETED');
  
    // Check for more orders to process
    assignOrdersToBots();
  }
*/


// Initialize bots with some dummy data for testing
/*
bots = [
    { botId: 1, status: 'IDLE', currentOrder: null },
    // Add more bot objects as needed
];
*/


/*
    Description on order creation logic:

    1. Initialization Check: The function first checks if a counter document exists in the database for orders. If not, it creates one and initializes it with a sequence number of 1.

    2. Incrementing the Counter: The counter's sequence number is then atomically incremented using findByIdAndUpdate. This ensures that each order gets a unique ID, even in the case of concurrent requests.

    3. ID Formatting: Finally, the function formats the order ID by prepending a type-specific prefix ('VIP-' for VIP orders and 'N-' for Normal orders) to the incremented sequence number.
 */

/*
    Description on Assign Orders to Bots, processing & completing orders:

    1. Looping Through Available Bots: loop through each available bot and check if there are orders in the heap.
    2. Extracting Orders from the Heap: use orderHeap.extractMax() to get the order with the highest priority.
    3. Updating Bot Status: The bot's status is set to 'BUSY', and currentOrderId is updated to the ID of the assigned order.
    4. Updating Order Status: The order's status is updated to 'PROCESSING', and botId is set to the ID of the bot processing the order.
    5. Simulating Processing Time: A setTimeout is used to simulate the processing time of the order. After 10 seconds, completeOrder is called.
    6. Completing the Order: In completeOrder, the order's status is set to 'COMPLETED', and the bot's status is set back to 'IDLE'. The function then calls assignOrdersToBots again to check for more orders to process.
*/
module.exports = router;
