const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let users = []; // Array to store user information

const register = async (req, res) => {
  try {
    const { username, password, roles } = req.body;

    // Check if user already exists in the in-memory store
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create a new user object
    const newUser = {
      id: users.length + 1, // Simple ID assignment
      username,
      passwordHash,
      roles: roles || ['User']
    };
    users.push(newUser);

    // Respond with success message
    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(500).send('Error registering new user');
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username);
    if (!user || !await bcrypt.compare(password, user.passwordHash)) {
      return res.status(401).send('Invalid username or password');
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        roles: user.roles
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.send({ token });
  } catch (error) {
    res.status(500).send('An error occurred');
  }
};

module.exports = { login, register };

