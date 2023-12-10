const express = require('express');
const Order = require('../models/order.model');
const router = express.Router();

let nextOrderId = 1; // Simulates an auto-incrementing order ID

router.post('/create', async (req, res) => {
  const { type } = req.body; // 'Normal' or 'VIP'
  const newOrder = new Order({ orderId: nextOrderId++, type, status: 'PENDING' });
  await newOrder.save();
  res.status(201).json(newOrder);
});

// Add other routes as needed for updating and managing orders

module.exports = router;