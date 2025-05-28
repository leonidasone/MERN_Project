const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: process.env.JWT_SECRET || 'gsms-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'your_database'
});

// Connect to database with better error handling
let dbConnected = false;
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    console.log('Server will continue running without database connection');
    console.log('Please set up MySQL and restart the server');
    dbConnected = false;
    return;
  }
  console.log('Connected to MySQL database');
  dbConnected = true;
});

// Auth middleware
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Test endpoint to check database
app.get('/api/test-db', (req, res) => {
  if (!dbConnected) {
    return res.status(500).json({ error: 'Database not connected' });
  }

  db.query('SELECT * FROM User', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }
    res.json({ message: 'Database connected', users: results });
  });
});

// Auth routes
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!dbConnected) {
    return res.status(500).json({ error: 'Database not connected' });
  }

  console.log('Login attempt:', { username, password });

  db.query('SELECT * FROM User WHERE Username = ?', [username], (err, results) => {
    if (err) {
      console.error('Database error during login:', err);
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }

    console.log('Query results:', results);

    if (results.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (results[0].Password !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    req.session.userId = results[0].UserID;
    req.session.username = results[0].Username;
    res.json({ message: 'Login successful', username: results[0].Username });
  });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logout successful' });
});

app.get('/api/auth/check', (req, res) => {
  if (req.session.userId) {
    res.json({ authenticated: true, username: req.session.username });
  } else {
    res.json({ authenticated: false });
  }
});

// Fuel Types routes
app.get('/api/fuel-types', requireAuth, (req, res) => {
  db.query('SELECT * FROM FuelType', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

app.post('/api/fuel-types', requireAuth, (req, res) => {
  const { Name, PricePerLiter } = req.body;
  db.query('INSERT INTO FuelType (Name, PricePerLiter) VALUES (?, ?)',
    [Name, PricePerLiter], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Fuel type added', id: result.insertId });
  });
});

app.put('/api/fuel-types/:id', requireAuth, (req, res) => {
  const { Name, PricePerLiter } = req.body;
  db.query('UPDATE FuelType SET Name = ?, PricePerLiter = ? WHERE FuelTypeID = ?',
    [Name, PricePerLiter, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Fuel type updated' });
  });
});

app.delete('/api/fuel-types/:id', requireAuth, (req, res) => {
  db.query('DELETE FROM FuelType WHERE FuelTypeID = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Fuel type deleted' });
  });
});

// Fuel Pumps routes
app.get('/api/pumps', requireAuth, (req, res) => {
  db.query(`SELECT p.*, f.Name as FuelTypeName FROM FuelPump p
            LEFT JOIN FuelType f ON p.FuelTypeID = f.FuelTypeID`, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

app.post('/api/pumps', requireAuth, (req, res) => {
  const { PumpNumber, FuelTypeID, Status } = req.body;
  db.query('INSERT INTO FuelPump (PumpNumber, FuelTypeID, Status) VALUES (?, ?, ?)',
    [PumpNumber, FuelTypeID, Status], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Pump added', id: result.insertId });
  });
});

app.put('/api/pumps/:id', requireAuth, (req, res) => {
  const { PumpNumber, FuelTypeID, Status } = req.body;
  db.query('UPDATE FuelPump SET PumpNumber = ?, FuelTypeID = ?, Status = ? WHERE PumpID = ?',
    [PumpNumber, FuelTypeID, Status, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Pump updated' });
  });
});

// Customers routes
app.get('/api/customers', requireAuth, (req, res) => {
  db.query('SELECT * FROM Customer', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

app.post('/api/customers', requireAuth, (req, res) => {
  const { Name, ContactInfo } = req.body;
  db.query('INSERT INTO Customer (Name, ContactInfo) VALUES (?, ?)',
    [Name, ContactInfo], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Customer added', id: result.insertId });
  });
});

// Transactions routes
app.get('/api/transactions', requireAuth, (req, res) => {
  db.query(`SELECT t.*, c.Name as CustomerName, p.PumpNumber, f.Name as FuelTypeName
            FROM FuelTransaction t
            LEFT JOIN Customer c ON t.CustomerID = c.CustomerID
            LEFT JOIN FuelPump p ON t.PumpID = p.PumpID
            LEFT JOIN FuelType f ON p.FuelTypeID = f.FuelTypeID
            ORDER BY t.Date DESC, t.Time DESC`, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

app.post('/api/transactions', requireAuth, (req, res) => {
  const { CustomerID, PumpID, AmountLiters, TotalPrice } = req.body;
  const date = new Date().toISOString().split('T')[0];
  const time = new Date().toTimeString().split(' ')[0];

  db.query('INSERT INTO FuelTransaction (CustomerID, PumpID, Date, Time, AmountLiters, TotalPrice) VALUES (?, ?, ?, ?, ?, ?)',
    [CustomerID, PumpID, date, time, AmountLiters, TotalPrice], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    // Update inventory
    db.query(`UPDATE FuelInventory fi
              JOIN FuelPump fp ON fi.FuelTypeID = fp.FuelTypeID
              SET fi.StockLiters = fi.StockLiters - ?, fi.LastUpdated = CURDATE()
              WHERE fp.PumpID = ?`, [AmountLiters, PumpID], (err) => {
      if (err) console.error('Inventory update error:', err);
    });

    res.json({ message: 'Transaction added', id: result.insertId });
  });
});

// Payments routes
app.get('/api/payments', requireAuth, (req, res) => {
  db.query(`SELECT p.*, t.TotalPrice, c.Name as CustomerName
            FROM Payment p
            LEFT JOIN FuelTransaction t ON p.TransactionID = t.TransactionID
            LEFT JOIN Customer c ON t.CustomerID = c.CustomerID
            ORDER BY p.PaymentDate DESC`, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

app.post('/api/payments', requireAuth, (req, res) => {
  const { TransactionID, CustomerID, AmountPaid, PaymentMethod, PaymentDate } = req.body;
  const finalPaymentDate = PaymentDate || new Date().toISOString().split('T')[0];

  // Validate required fields
  if (!TransactionID || !AmountPaid || !PaymentMethod) {
    return res.status(400).json({ error: 'Missing required fields: TransactionID, AmountPaid, PaymentMethod' });
  }

  db.query('INSERT INTO Payment (TransactionID, AmountPaid, PaymentMethod, PaymentDate) VALUES (?, ?, ?, ?)',
    [TransactionID, AmountPaid, PaymentMethod, finalPaymentDate], (err, result) => {
    if (err) {
      console.error('Payment insertion error:', err);
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }
    res.json({ message: 'Payment recorded successfully', id: result.insertId });
  });
});

// Inventory routes
app.get('/api/inventory', requireAuth, (req, res) => {
  db.query(`SELECT i.*, f.Name as FuelTypeName, f.PricePerLiter
            FROM FuelInventory i
            LEFT JOIN FuelType f ON i.FuelTypeID = f.FuelTypeID`, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

app.put('/api/inventory/:id', requireAuth, (req, res) => {
  const { StockLiters } = req.body;
  db.query('UPDATE FuelInventory SET StockLiters = ?, LastUpdated = CURDATE() WHERE InventoryID = ?',
    [StockLiters, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Inventory updated' });
  });
});

// Tasks routes
app.get('/api/tasks', requireAuth, (req, res) => {
  db.query('SELECT * FROM StationTask ORDER BY DueDate ASC', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

app.post('/api/tasks', requireAuth, (req, res) => {
  const { Description, AssignedTo, Status, DueDate } = req.body;
  db.query('INSERT INTO StationTask (Description, AssignedTo, Status, DueDate) VALUES (?, ?, ?, ?)',
    [Description, AssignedTo, Status, DueDate], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Task added', id: result.insertId });
  });
});

app.put('/api/tasks/:id', requireAuth, (req, res) => {
  const { Description, AssignedTo, Status, DueDate } = req.body;
  db.query('UPDATE StationTask SET Description = ?, AssignedTo = ?, Status = ?, DueDate = ? WHERE TaskID = ?',
    [Description, AssignedTo, Status, DueDate, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Task updated' });
  });
});

// Reports routes
app.get('/api/report/daily', requireAuth, (req, res) => {
  const { date } = req.query;
  const reportDate = date || new Date().toISOString().split('T')[0];

  const queries = {
    transactions: `SELECT COUNT(*) as count, SUM(AmountLiters) as totalLiters, SUM(TotalPrice) as totalSales
                   FROM FuelTransaction WHERE Date = ?`,
    payments: `SELECT SUM(AmountPaid) as totalPayments, PaymentMethod, COUNT(*) as count
               FROM Payment WHERE PaymentDate = ? GROUP BY PaymentMethod`,
    inventory: `SELECT f.Name, i.StockLiters FROM FuelInventory i
                JOIN FuelType f ON i.FuelTypeID = f.FuelTypeID`,
    fuelSales: `SELECT f.Name, SUM(t.AmountLiters) as liters, SUM(t.TotalPrice) as sales
                FROM FuelTransaction t
                JOIN FuelPump p ON t.PumpID = p.PumpID
                JOIN FuelType f ON p.FuelTypeID = f.FuelTypeID
                WHERE t.Date = ? GROUP BY f.FuelTypeID`
  };

  const report = {};
  let completed = 0;

  Object.keys(queries).forEach(key => {
    const params = key === 'inventory' ? [] : [reportDate];
    db.query(queries[key], params, (err, results) => {
      if (err) {
        console.error(`Error in ${key} query:`, err);
        report[key] = [];
      } else {
        report[key] = results;
      }

      completed++;
      if (completed === Object.keys(queries).length) {
        res.json({ date: reportDate, ...report });
      }
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
