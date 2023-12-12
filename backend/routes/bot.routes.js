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

  //add new bot
  router.post('/bots', async (req, res) => {
    try {
        const lastBot = await Bot.findOne().sort({ botId: -1 });
        const botId = lastBot ? lastBot.botId + 1 : 1;
    
        const newBot = new Bot({
          botId,
          status: 'IDLE'  // Initial bots status as 'IDLE'
        });
    
        await newBot.save();
        res.status(201).json(newBot);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
  });

  //get all bots
  router.get('/bots', async (req, res) => {
    try {
      const bots = await Bot.find({});
      res.json(bots);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  //remove a bot
  router.delete('/bots/:id', async (req, res) => {
    try {
      const bot = await Bot.findByIdAndDelete(req.params.id);
      if (!bot) {
        return res.status(404).json({ message: 'Bot not found' });
      }
      res.json({ message: 'Bot removed' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  module.exports = router;
  