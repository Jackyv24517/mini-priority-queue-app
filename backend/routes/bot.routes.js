const express = require('express');
const Order = require('../models/orderModel');
const Bot = require('../models/botModel');
const router = express.Router();

/* 
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
  //Completing the Order
  async function completeOrder(order, bot) {
    order.status = 'COMPLETED';
    await order.save();
  
    bot.status = 'IDLE';
    bot.currentOrderId = null;
    await bot.save();
  
    // Optionally, check for new orders to process
    assignOrdersToBots();
  }

*/

/*
  //Assigning Orders to Bots
  async function assignOrdersToBots() {
    const idleBots = await Bot.find({ status: 'IDLE' });
    const pendingOrders = await Order.find({ status: 'PENDING' }).sort({ createdAt: 1 });
  
    for (let i = 0; i < idleBots.length; i++) {
      if (pendingOrders[i]) {
        idleBots[i].status = 'PROCESSING';
        idleBots[i].currentOrderId = pendingOrders[i]._id;
        //update bot status
        await idleBots[i].save();
  
        pendingOrders[i].status = 'PROCESSING';
        //update order status
        await pendingOrders[i].save();
        
        //Simulate the order processing time
        setTimeout(() => completeOrder(pendingOrders[i], idleBots[i]), 10000);
      }
    }
  }
  */
  

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
  router.delete('/bots/:botId', async (req, res) => {
    try {
    const botId = parseInt(req.params.botId);  
    const bot = await Bot.findOneAndDelete({ botId: botId });
      if (!bot) {
        return res.status(404).json({ message: 'Bot not found' });
      }
      res.json({ message: 'Bot removed' });
    } catch (error) {
      console.error(error); // Additional logging on  error
      res.status(500).json({ message: error.message });
    }
  });
  

  module.exports = router;
  