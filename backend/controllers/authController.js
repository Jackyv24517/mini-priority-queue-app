// authController.js
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//user login auth
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !await bcrypt.compare(password, user.passwordHash)) {
      return res.status(401).send('Invalid username or password');
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.send({ token });
  } catch (error) {
    res.status(500).send('An error occurred');
  }
};


//user register
const register = async (req, res) => {
    try {
      const { username, password, roles } = req.body; // Include 'roles' in the destructuring
  
      // Check if user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).send('User already exists');
      }
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
  
      // Create a new user with roles
      // Ensure roles are assigned appropriately, whether default or from the request
      const user = new User({
        username,
        passwordHash,
        roles: roles || ['User'] // Default role to 'User' if not provided
      });
      await user.save();
  
      // Create a token that includes the roles in its payload
      const token = jwt.sign({
        _id: user._id,
        roles: user.roles
      }, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      //instead of auto login after successful registation
      //res.status(201).send({ token });
      res.status(201).send('User registered successfully');
    } catch (error) {
      res.status(500).send('Error registering new user');
    }
};


module.exports = { login, register };
