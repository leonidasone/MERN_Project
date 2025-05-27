const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Simple health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Simple login endpoint
app.post('/api/auth/login', (req, res) => {
  console.log('Login request received:', req.body);
  
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'admin123') {
    res.json({
      message: 'Login successful',
      token: 'dummy-token-123',
      user: {
        userId: 1,
        username: 'admin',
        fullName: 'System Administrator',
        role: 'ADMIN'
      }
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Simple test server running on port ${PORT}`);
});
