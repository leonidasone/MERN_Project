const express = require('express');
const db = require('../config/database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(requireAuth);

// Get all cars
router.get('/', (req, res) => {
  const query = 'SELECT * FROM Car ORDER BY PlateNumber';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch cars'
      });
    }

    res.json({
      success: true,
      data: results
    });
  });
});

// Get car by plate number
router.get('/:plateNumber', (req, res) => {
  const { plateNumber } = req.params;
  const query = 'SELECT * FROM Car WHERE PlateNumber = ?';
  
  db.query(query, [plateNumber], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch car'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    res.json({
      success: true,
      data: results[0]
    });
  });
});

// Add new car
router.post('/', (req, res) => {
  const { plateNumber, carType, carSize, driverName, phoneNumber } = req.body;

  // Validation
  if (!plateNumber || !carType || !carSize || !driverName || !phoneNumber) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }

  // Check if car already exists
  const checkQuery = 'SELECT * FROM Car WHERE PlateNumber = ?';
  db.query(checkQuery, [plateNumber], (err, results) => {
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
        message: 'Car with this plate number already exists'
      });
    }

    // Insert new car
    const insertQuery = `
      INSERT INTO Car (PlateNumber, CarType, CarSize, DriverName, PhoneNumber) 
      VALUES (?, ?, ?, ?, ?)
    `;
    
    db.query(insertQuery, [plateNumber, carType, carSize, driverName, phoneNumber], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to add car'
        });
      }

      res.status(201).json({
        success: true,
        message: 'Car added successfully',
        data: {
          plateNumber,
          carType,
          carSize,
          driverName,
          phoneNumber
        }
      });
    });
  });
});

// Update car
router.put('/:plateNumber', (req, res) => {
  const { plateNumber } = req.params;
  const { carType, carSize, driverName, phoneNumber } = req.body;

  // Validation
  if (!carType || !carSize || !driverName || !phoneNumber) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }

  // Check if car exists
  const checkQuery = 'SELECT * FROM Car WHERE PlateNumber = ?';
  db.query(checkQuery, [plateNumber], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Database error'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    // Update car
    const updateQuery = `
      UPDATE Car 
      SET CarType = ?, CarSize = ?, DriverName = ?, PhoneNumber = ? 
      WHERE PlateNumber = ?
    `;
    
    db.query(updateQuery, [carType, carSize, driverName, phoneNumber, plateNumber], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to update car'
        });
      }

      res.json({
        success: true,
        message: 'Car updated successfully',
        data: {
          plateNumber,
          carType,
          carSize,
          driverName,
          phoneNumber
        }
      });
    });
  });
});

// Delete car
router.delete('/:plateNumber', (req, res) => {
  const { plateNumber } = req.params;

  // Check if car exists
  const checkQuery = 'SELECT * FROM Car WHERE PlateNumber = ?';
  db.query(checkQuery, [plateNumber], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Database error'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    // Delete car
    const deleteQuery = 'DELETE FROM Car WHERE PlateNumber = ?';
    db.query(deleteQuery, [plateNumber], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to delete car'
        });
      }

      res.json({
        success: true,
        message: 'Car deleted successfully'
      });
    });
  });
});

module.exports = router;
