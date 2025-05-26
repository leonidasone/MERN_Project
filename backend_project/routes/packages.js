const express = require('express');
const db = require('../config/database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(requireAuth);

// Get all packages
router.get('/', (req, res) => {
  const query = 'SELECT * FROM Package ORDER BY PackageNumber';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch packages'
      });
    }

    res.json({
      success: true,
      data: results
    });
  });
});

// Get package by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM Package WHERE PackageNumber = ?';
  
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch package'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    res.json({
      success: true,
      data: results[0]
    });
  });
});

// Add new package
router.post('/', (req, res) => {
  const { packageName, packageDescription, packagePrice } = req.body;

  // Validation
  if (!packageName || !packagePrice) {
    return res.status(400).json({
      success: false,
      message: 'Package name and price are required'
    });
  }

  if (isNaN(packagePrice) || packagePrice <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Package price must be a positive number'
    });
  }

  // Insert new package
  const insertQuery = `
    INSERT INTO Package (PackageName, PackageDescription, PackagePrice) 
    VALUES (?, ?, ?)
  `;
  
  db.query(insertQuery, [packageName, packageDescription || '', packagePrice], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to add package'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Package added successfully',
      data: {
        packageNumber: result.insertId,
        packageName,
        packageDescription: packageDescription || '',
        packagePrice: parseFloat(packagePrice)
      }
    });
  });
});

// Update package
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { packageName, packageDescription, packagePrice } = req.body;

  // Validation
  if (!packageName || !packagePrice) {
    return res.status(400).json({
      success: false,
      message: 'Package name and price are required'
    });
  }

  if (isNaN(packagePrice) || packagePrice <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Package price must be a positive number'
    });
  }

  // Check if package exists
  const checkQuery = 'SELECT * FROM Package WHERE PackageNumber = ?';
  db.query(checkQuery, [id], (err, results) => {
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
        message: 'Package not found'
      });
    }

    // Update package
    const updateQuery = `
      UPDATE Package 
      SET PackageName = ?, PackageDescription = ?, PackagePrice = ? 
      WHERE PackageNumber = ?
    `;
    
    db.query(updateQuery, [packageName, packageDescription || '', packagePrice, id], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to update package'
        });
      }

      res.json({
        success: true,
        message: 'Package updated successfully',
        data: {
          packageNumber: parseInt(id),
          packageName,
          packageDescription: packageDescription || '',
          packagePrice: parseFloat(packagePrice)
        }
      });
    });
  });
});

// Delete package
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  // Check if package exists
  const checkQuery = 'SELECT * FROM Package WHERE PackageNumber = ?';
  db.query(checkQuery, [id], (err, results) => {
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
        message: 'Package not found'
      });
    }

    // Check if package is being used in any service
    const checkUsageQuery = 'SELECT COUNT(*) as count FROM ServicePackage WHERE PackageNumber = ?';
    db.query(checkUsageQuery, [id], (err, usageResults) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error'
        });
      }

      if (usageResults[0].count > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete package. It is being used in service records.'
        });
      }

      // Delete package
      const deleteQuery = 'DELETE FROM Package WHERE PackageNumber = ?';
      db.query(deleteQuery, [id], (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            success: false,
            message: 'Failed to delete package'
          });
        }

        res.json({
          success: true,
          message: 'Package deleted successfully'
        });
      });
    });
  });
});

module.exports = router;
