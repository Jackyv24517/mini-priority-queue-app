const express = require('express');
const router = express.Router();
const botStore = require('../store/botStore');
const orderRoute = require('../routes/order.routes');

// In-memory storage for bots
//let bots = botStore.getBots();
//let nextBotId = 1;

/*
// Add new bot
router.post('/bots', (req, res) => {
  try {
    
    const newBot = {};
    let orderHeap = orderRoute.getOrderHeap();
    botStore.addBot(newBot, orderHeap);

    
    res.status(201).json(newBot);
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ message: error.toString() });
  }
});
*/

/*
// Get all bots
router.get('/bots', (req, res) => {
  try {
    let bots = botStore.getBots();
    res.json(bots);
    console.log("All Bots: ",  bots);
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
});
*/

// Remove a bot
/*
router.delete('/bots/:botId', (req, res) => {
    try {
      const botId = parseInt(req.params.botId);
  
      // Check if the bot exists
      const bots = botStore.getBots();
      const botExists = bots.some(bot => bot.botId === botId);
      if (!botExists) {
        return res.status(404).json({ message: 'Bot not found' });
      }
  
      // Remove the bot using botStore
      botStore.removeBot(botId);
  
      res.json({ message: 'Bot removed' });
    } catch (error) {
      res.status(500).json({ message: error.toString() });
    }
});*/

module.exports = router;
