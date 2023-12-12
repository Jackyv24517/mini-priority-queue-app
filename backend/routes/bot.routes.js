const express = require('express');
const Order = require('../models/orderModel');
const Bot = require('../models/botModel');
const router = express.Router();

async function assignOrdersToBots() {
    const idleBots = await Bot.find({ status: 'IDLE' });
    const pendingOrders = await Order.find({ status: 'PENDING' }).sort({ createdAt: 1 });
  
    pendingOrders.forEach(async (order, index) => {
      if (idleBots[index]) {
        idleBots[index].status = 'PROCESSING';
        idleBots[index].currentOrderId = order._id;
        await idleBots[index].save();
  
        order.status = 'PROCESSING';
        await order.save();
  
        // Start a timer for order processing (10 seconds as per your requirement)
        setTimeout(() => completeOrder(order._id, idleBots[index]), 10000);
      }
    });
  }
  
  async function completeOrder(orderId, bot) {
    const order = await Order.findById(orderId);
    order.status = 'COMPLETED';
    await order.save();
  
    bot.status = 'IDLE';
    bot.currentOrderId = null;
    await bot.save();
  }

  router.post('/bots', async (req, res) => {
    try {
      const newBot = new Bot({ /* bot details */ });
      await newBot.save();
      res.status(201).json(newBot);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  module.exports = router;
  