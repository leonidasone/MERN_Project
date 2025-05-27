const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Login route
router.post('/login', (req, res) => {
  console.log('🔐 Login attempt:', { username: req.body.username, hasPassword: !!req.body.password });
  const { username, password } = req.body;

  if (!username || !password) {
    console.log('❌ Missing credentials');
    return res.status(400).json({
      success: false,
      message: 'Username and password are required'
    });
  }

  // Check if user exists
  const query = 'SELECT * FROM User WHERE Username = ?';
  db.query(query, [username], async (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Database error'
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    const user = results[0];

    try {
      // Compare password
      const isValidPassword = await bcrypt.compare(password, user.Password);

      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username or password'
        });
      }

      // Create JWT token
      const token = jwt.sign(
        {
          userId: user.UserID,
          username: user.Username
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Store user info in session
      req.session.userId = user.UserID;
      req.session.username = user.Username;
      req.session.token = token;

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.UserID,
            username: user.Username
          },
          token: token
        }
      });

    } catch (error) {
      console.error('Password comparison error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  });
});

// Logout route
router.post('/logout', requireAuth, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Could not log out'
      });
    }

    res.clearCookie('connect.sid');
    res.json({
      success: true,
      message: 'Logout successful'
    });
  });
});

// Check authentication status
router.get('/check', (req, res) => {
  if (req.session && req.session.userId) {
    res.json({
      success: true,
      authenticated: true,
      user: {
        id: req.session.userId,
        username: req.session.username
      }
    });
  } else {
    res.json({
      success: true,
      authenticated: false
    });
  }
});

// Register route (for creating new users)
router.post('/register', async (req, res) => {
  console.log('📝 Registration attempt:', { username: req.body.username, hasPassword: !!req.body.password });
  const { username, password } = req.body;

  if (!username || !password) {
    console.log('❌ Missing registration credentials');
    return res.status(400).json({
      success: false,
      message: 'Username and password are required'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }

  try {
    // Check if user already exists
    const checkQuery = 'SELECT * FROM User WHERE Username = ?';
    db.query(checkQuery, [username], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error'
        });
      }

      if (results.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Username already exists'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      const insertQuery = 'INSERT INTO User (Username, Password) VALUES (?, ?)';
      db.query(insertQuery, [username, hashedPassword], (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            success: false,
            message: 'Failed to create user'
          });
        }

        res.status(201).json({
          success: true,
          message: 'User created successfully',
          data: {
            userId: result.insertId,
            username: username
          }
        });
      });
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
