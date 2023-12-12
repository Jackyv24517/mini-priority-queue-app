const express = require('express');
const Order = require('../models/orderModel');
const Counter = require('../models/counterModel');
const Bot = require('../models/botModel');
const router = express.Router();

const MaxHeap = require('../utils/MaxHeap');
const orderHeap = new MaxHeap();

const { getIO } = require('../socket');

// POST /api/orders - Create a new order
router.post('/orders', async (req, res) => {
  try {
    const { type, details } = req.body;

    // Generate the next order ID here (you'll need to implement this logic)
    const orderId = await getNextOrderId(type);

    // Create a new order
    const newOrder = new Order({
        orderId,
        type,
        details,
        status: 'PENDING' // Default status
    });
    await newOrder.save();

    // Emit the new order status
    updateOrderStatus(newOrder._id, newOrder.status);

    // Insert the new order into the heap
    orderHeap.insert(newOrder);

    // Assign orders immediately after adding
    assignOrdersToBots();

    
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Fetch all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find({}).populate('botId');
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

async function getNextOrderId(orderType) {
  // Check and initialize the counter if not present
  let counter = await Counter.findById('order');
  if (!counter) {
    counter = new Counter({ _id: 'order', seq: 1 });
    await counter.save();
  }

  // Increment the counter
  counter = await Counter.findByIdAndUpdate('order', { $inc: { seq: 1 } }, { new: true });

  // Format the order ID based on the order type
  const prefix = orderType === 'VIP' ? 'VIP-' : 'N-';

  // Format the order ID with zero-padding
  const paddedSeq = String(counter.seq).padStart(4, '0');
  return `${prefix}${paddedSeq}`;
}

//Assigning Orders to Bots
async function assignOrdersToBots() {
    const availableBots = await Bot.find({ status: 'IDLE' });
  
    for (const bot of availableBots) {
      if (!orderHeap.isEmpty()) {
        const order = orderHeap.extractMax(); // Get the highest priority order
  
        // Assign the order to the bot
        bot.status = 'BUSY';
        bot.currentOrderId = order._id;
        await bot.save();
  
        // Update the order status
        order.status = 'PROCESSING';
        order.botId = bot._id;
        await order.save();
  
        // Simulate the processing time (10 seconds)
        setTimeout(() => completeOrder(order, bot), 10000);
        
      }
    }
}

//Completing the Order
async function completeOrder(order, bot) {
    order.status = 'COMPLETED';
    await order.save();
  
    bot.status = 'IDLE';
    bot.currentOrderId = null;
    await bot.save();

     // After processing is complete
    await updateOrderStatus(order._id, 'COMPLETED');
  
    // Check for more orders to process
    assignOrdersToBots();
}

// update order status via websocket
async function updateOrderStatus(orderId, newStatus) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }
  
    const oldStatus = order.status;
    order.status = newStatus;
    await order.save();
  
    const io = getIO();
    // Emit an event to all connected clients
    io.emit('orderUpdate', { ...order.toObject(), oldStatus });
  
    return order;
  }


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
