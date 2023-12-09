require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth.routes');

const app = express();
app.use(express.json());

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

const port = process.env.PORT || 3200;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
