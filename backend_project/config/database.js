const mysql = require('mysql');
require('dotenv').config();

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'CWSMS',
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

// Create database connection
const db = mysql.createConnection(dbConfig);

// Connect to database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    console.error('Please check your database configuration in .env file');
    return;
  }
  console.log('Connected to MySQL database:', process.env.DB_NAME || 'CWSMS');
});

// Handle connection errors
db.on('error', (err) => {
  console.error('Database error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('Reconnecting to database...');
    db.connect();
  } else {
    throw err;
  }
});

module.exports = db;
