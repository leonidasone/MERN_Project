const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));
app.use(express.json());

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'smartpark_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'PTMS'
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    console.log('Continuing without database for testing...');
    return;
  }
  console.log('Connected to PTMS MySQL database');
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Basic routes
app.get('/', (req, res) => {
  res.json({ message: 'SmartPark PTMS Backend Server is running!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ==================== AUTHENTICATION ROUTES ====================

// Login route
app.post('/api/auth/login', (req, res) => {
  console.log('Login attempt:', req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    console.log('Missing username or password');
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const query = 'SELECT * FROM User WHERE Username = ?';
  console.log('Executing query for user:', username);

  db.query(query, [username], async (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    console.log('Query results:', results.length, 'users found');

    if (results.length === 0) {
      console.log('No user found with username:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = results[0];
    console.log('User found:', user.Username, user.Role);

    // For demo purposes, accept plain text password "admin123" or "receptionist123"
    const isValidPassword = password === 'admin123' || password === 'receptionist123' ||
                           await bcrypt.compare(password, user.Password);

    console.log('Password validation result:', isValidPassword);

    if (!isValidPassword) {
      console.log('Invalid password for user:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.UserID,
        username: user.Username,
        role: user.Role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Store user in session
    req.session.user = {
      userId: user.UserID,
      username: user.Username,
      fullName: user.FullName,
      role: user.Role
    };

    res.json({
      message: 'Login successful',
      token,
      user: {
        userId: user.UserID,
        username: user.Username,
        fullName: user.FullName,
        role: user.Role
      }
    });
  });
});

// Logout route
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out' });
    }
    res.json({ message: 'Logout successful' });
  });
});

// Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// ==================== PARKING PACKAGE ROUTES ====================

// Get all parking packages
app.get('/api/packages', authenticateToken, (req, res) => {
  const query = 'SELECT * FROM ParkingPackage ORDER BY PackageNumber';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.json(results);
  });
});

// Get single parking package
app.get('/api/packages/:id', authenticateToken, (req, res) => {
  const packageId = req.params.id;
  const query = 'SELECT * FROM ParkingPackage WHERE PackageNumber = ?';

  db.query(query, [packageId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Package not found' });
    }

    res.json(results[0]);
  });
});

// Create new parking package
app.post('/api/packages', authenticateToken, (req, res) => {
  const { PackageName, PackageDescription, RatePerHour } = req.body;

  if (!PackageName || !RatePerHour) {
    return res.status(400).json({ message: 'Package name and rate per hour are required' });
  }

  const query = 'INSERT INTO ParkingPackage (PackageName, PackageDescription, RatePerHour) VALUES (?, ?, ?)';

  db.query(query, [PackageName, PackageDescription, RatePerHour], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(201).json({
      message: 'Package created successfully',
      packageId: results.insertId
    });
  });
});

// Update parking package
app.put('/api/packages/:id', authenticateToken, (req, res) => {
  const packageId = req.params.id;
  const { PackageName, PackageDescription, RatePerHour } = req.body;

  if (!PackageName || !RatePerHour) {
    return res.status(400).json({ message: 'Package name and rate per hour are required' });
  }

  const query = 'UPDATE ParkingPackage SET PackageName = ?, PackageDescription = ?, RatePerHour = ? WHERE PackageNumber = ?';

  db.query(query, [PackageName, PackageDescription, RatePerHour, packageId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Package not found' });
    }

    res.json({ message: 'Package updated successfully' });
  });
});

// Delete parking package
app.delete('/api/packages/:id', authenticateToken, (req, res) => {
  const packageId = req.params.id;

  // Check if package is being used by any tickets
  const checkQuery = 'SELECT COUNT(*) as count FROM ParkingTicket WHERE PackageNumber = ?';

  db.query(checkQuery, [packageId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results[0].count > 0) {
      return res.status(400).json({ message: 'Cannot delete package that is being used by tickets' });
    }

    const deleteQuery = 'DELETE FROM ParkingPackage WHERE PackageNumber = ?';

    db.query(deleteQuery, [packageId], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Package not found' });
      }

      res.json({ message: 'Package deleted successfully' });
    });
  });
});

// ==================== VEHICLE ROUTES ====================

// Get all vehicles
app.get('/api/vehicles', authenticateToken, (req, res) => {
  const query = 'SELECT * FROM Vehicle ORDER BY PlateNumber';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.json(results);
  });
});

// Get single vehicle
app.get('/api/vehicles/:plateNumber', authenticateToken, (req, res) => {
  const plateNumber = req.params.plateNumber;
  const query = 'SELECT * FROM Vehicle WHERE PlateNumber = ?';

  db.query(query, [plateNumber], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json(results[0]);
  });
});

// Create new vehicle
app.post('/api/vehicles', authenticateToken, (req, res) => {
  const { PlateNumber, VehicleType, DriverName, PhoneNumber } = req.body;

  if (!PlateNumber || !VehicleType || !DriverName) {
    return res.status(400).json({ message: 'Plate number, vehicle type, and driver name are required' });
  }

  const query = 'INSERT INTO Vehicle (PlateNumber, VehicleType, DriverName, PhoneNumber) VALUES (?, ?, ?, ?)';

  db.query(query, [PlateNumber, VehicleType, DriverName, PhoneNumber], (err, results) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Vehicle with this plate number already exists' });
      }
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(201).json({
      message: 'Vehicle created successfully',
      plateNumber: PlateNumber
    });
  });
});

// Update vehicle
app.put('/api/vehicles/:plateNumber', authenticateToken, (req, res) => {
  const plateNumber = req.params.plateNumber;
  const { VehicleType, DriverName, PhoneNumber } = req.body;

  if (!VehicleType || !DriverName) {
    return res.status(400).json({ message: 'Vehicle type and driver name are required' });
  }

  const query = 'UPDATE Vehicle SET VehicleType = ?, DriverName = ?, PhoneNumber = ? WHERE PlateNumber = ?';

  db.query(query, [VehicleType, DriverName, PhoneNumber, plateNumber], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json({ message: 'Vehicle updated successfully' });
  });
});

// Delete vehicle
app.delete('/api/vehicles/:plateNumber', authenticateToken, (req, res) => {
  const plateNumber = req.params.plateNumber;

  // Check if vehicle has any tickets
  const checkQuery = 'SELECT COUNT(*) as count FROM ParkingTicket WHERE PlateNumber = ?';

  db.query(checkQuery, [plateNumber], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results[0].count > 0) {
      return res.status(400).json({ message: 'Cannot delete vehicle that has parking tickets' });
    }

    const deleteQuery = 'DELETE FROM Vehicle WHERE PlateNumber = ?';

    db.query(deleteQuery, [plateNumber], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }

      res.json({ message: 'Vehicle deleted successfully' });
    });
  });
});

// Import additional routes
const routes = require('./routes');

// ==================== PARKING TICKET ROUTES ====================

// Get all parking tickets
app.get('/api/tickets', authenticateToken, (req, res) => {
  routes.getParkingTickets(req, res, db);
});

// Get single parking ticket
app.get('/api/tickets/:id', authenticateToken, (req, res) => {
  routes.getParkingTicket(req, res, db);
});

// Create new parking ticket
app.post('/api/tickets', authenticateToken, (req, res) => {
  routes.createParkingTicket(req, res, db);
});

// Complete parking ticket (calculate fee)
app.put('/api/tickets/:id/complete', authenticateToken, (req, res) => {
  routes.completeParkingTicket(req, res, db);
});

// ==================== PAYMENT ROUTES ====================

// Get all payments
app.get('/api/payments', authenticateToken, (req, res) => {
  routes.getPayments(req, res, db);
});

// Create payment
app.post('/api/payments', authenticateToken, (req, res) => {
  routes.createPayment(req, res, db);
});

// ==================== REPORT ROUTES ====================

// Get daily report
app.get('/api/reports/daily', authenticateToken, (req, res) => {
  routes.getDailyReport(req, res, db);
});

// Start server
app.listen(PORT, () => {
  console.log(`SmartPark PTMS Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
