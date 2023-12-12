const mongoose = require('mongoose');

const Bot = mongoose.model('Bot', botSchema);

const orderSchema = new mongoose.Schema({
  // Unique order identifier
  orderId: {
    type: String,
    required: true,
    unique: true
  },

  // Type of order (e.g., 'Normal', 'VIP')
  type: {
    type: String,
    required: true,
    enum: ['Normal', 'VIP']
  },

  // Status of the order (e.g., 'PENDING', 'COMPLETED')
  status: {
    type: String,
    required: true,
    enum: ['PENDING', 'PROCESSING', 'COMPLETED'],
    default: 'PENDING'
  },

  // Timestamp for when the order was created
  createdAt: {
    type: Date,
    default: Date.now
  },

  // Additional details (if needed)
  details: {
    type: String,
    default: ''
  },

  botId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `${Bot}`, // This should match the name of your Bot model
    default: null
  },

});

module.exports = mongoose.model('Order', orderSchema);
