const mongoose = require('mongoose');

const botSchema = new mongoose.Schema({
  botId: { type: Number, required: true, unique: true },
  status: { type: String, enum: ['IDLE', 'PROCESSING'], default: 'IDLE' },
  currentOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null }
});

const Bot = mongoose.model('Bot', botSchema);

module.exports = Bot;