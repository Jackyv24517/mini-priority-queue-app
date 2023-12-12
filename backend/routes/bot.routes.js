const express = require('express');
const router = express.Router();
const botStore = require('../store/botStore');

// In-memory storage for bots
let bots = botStore.getBots();
//let nextBotId = 1;

// Add new bot
router.post('/bots', (req, res) => {
  try {
    botStore.addBot({ status: 'IDLE' });
    /*
    const newBot = {
      botId: nextBotId++,
      status: 'IDLE'  // Initial bots status as 'IDLE'

      bots.push(newBot);
    };*/

    
    res.status(201).json(newBot);
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
});

// Get all bots
router.get('/bots', (req, res) => {
  try {
    res.json(bots);
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
});

// Remove a bot
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
  });

module.exports = router;
