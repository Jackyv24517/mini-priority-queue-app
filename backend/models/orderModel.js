const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: Number,
  type: String, // 'Normal' or 'VIP'
  status: String // 'PENDING', 'PROCESSING', 'COMPLETE'
});

module.exports = mongoose.model('Order', orderSchema);