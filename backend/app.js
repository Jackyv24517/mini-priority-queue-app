require('dotenv').config();

const cors = require('cors');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth.routes');
const orderRoutes = require('./routes/order.routes'); 
const botRoutes = require('./routes/bot.routes'); 


const app = express();
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000', // allowed frontend URL
    methods: ['GET', 'POST']
  }
});

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000' // permitted frontend URL
  }));

//connection cred var
const username = encodeURIComponent(process.env.DB_USERNAME);
const password = encodeURIComponent(process.env.DB_PASSWORD);
const cluster = process.env.DB_CLUSTER;
const dbname = process.env.DB_NAME;

const uri = `mongodb+srv://${username}:${password}@${cluster}/${dbname}?retryWrites=true&w=majority`;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Could not connect to MongoDB Atlas', err));

  app.use('/api/auth', authRoutes);
  app.use('/api', orderRoutes);
  app.use('/api', botRoutes);


 /* 
const port = process.env.PORT || 3200;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); */

const port = process.env.PORT || 3200;

// Update: Use server.listen instead of app.listen
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Setup WebSocket connections using Socket.IO
io.on('connection', (socket) => {
  console.log('A user connected via WebSocket');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  // WebSocket event listeners and emitters
});

module.exports = { app, server, io };