const express = require('express');
const router = express.Router();

// In-memory storage for bots
let bots = [];
let nextBotId = 1;

// Add new bot
router.post('/bots', (req, res) => {
  try {
    const newBot = {
      botId: nextBotId++,
      status: 'IDLE'  // Initial bots status as 'IDLE'
    };

    bots.push(newBot);
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
    const botIndex = bots.findIndex(bot => bot.botId === botId);
    if (botIndex === -1) {
      return res.status(404).json({ message: 'Bot not found' });
    }

    // Remove the bot from the array
    bots.splice(botIndex, 1);
    res.json({ message: 'Bot removed' });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
});

module.exports = router;
