const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  // Registration logic...
});

router.post('/login', async (req, res) => {
  // Login logic...
});

module.exports = router;
