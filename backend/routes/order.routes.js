const express = require('express');
const Order = require('../models/orderModel');
const Counter = require('./models/counterModel');
const router = express.Router();

// POST /api/orders - Create a new order
router.post('/orders', async (req, res) => {
  try {
    const { type, details } = req.body;

    // Generate the next order ID here (you'll need to implement this logic)
    const nextOrderId = await getNextOrderId();

    const newOrder = new Order({
      orderId: nextOrderId,
      type,
      details
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
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
  return prefix + counter.seq;
}


/*
 Description on logic

Initialization Check: The function first checks if a counter document exists in the database for orders. If not, it creates one and initializes it with a sequence number of 1.

Incrementing the Counter: The counter's sequence number is then atomically incremented using findByIdAndUpdate. This ensures that each order gets a unique ID, even in the case of concurrent requests.

ID Formatting: Finally, the function formats the order ID by prepending a type-specific prefix ('VIP-' for VIP orders and 'N-' for Normal orders) to the incremented sequence number.
 */

module.exports = router;
