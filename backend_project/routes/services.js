const express = require('express');
const db = require('../config/database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(requireAuth);

// Get all service records with car and package details
router.get('/', (req, res) => {
  const query = `
    SELECT 
      sp.RecordNumber,
      sp.ServiceDate,
      sp.PlateNumber,
      sp.PackageNumber,
      c.CarType,
      c.CarSize,
      c.DriverName,
      c.PhoneNumber,
      p.PackageName,
      p.PackageDescription,
      p.PackagePrice,
      pay.PaymentNumber,
      pay.AmountPaid,
      pay.PaymentDate
    FROM ServicePackage sp
    LEFT JOIN Car c ON sp.PlateNumber = c.PlateNumber
    LEFT JOIN Package p ON sp.PackageNumber = p.PackageNumber
    LEFT JOIN Payment pay ON sp.RecordNumber = pay.RecordNumber
    ORDER BY sp.ServiceDate DESC, sp.RecordNumber DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch service records'
      });
    }

    res.json({
      success: true,
      data: results
    });
  });
});

// Get service record by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT 
      sp.RecordNumber,
      sp.ServiceDate,
      sp.PlateNumber,
      sp.PackageNumber,
      c.CarType,
      c.CarSize,
      c.DriverName,
      c.PhoneNumber,
      p.PackageName,
      p.PackageDescription,
      p.PackagePrice,
      pay.PaymentNumber,
      pay.AmountPaid,
      pay.PaymentDate
    FROM ServicePackage sp
    LEFT JOIN Car c ON sp.PlateNumber = c.PlateNumber
    LEFT JOIN Package p ON sp.PackageNumber = p.PackageNumber
    LEFT JOIN Payment pay ON sp.RecordNumber = pay.RecordNumber
    WHERE sp.RecordNumber = ?
  `;
  
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch service record'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service record not found'
      });
    }

    res.json({
      success: true,
      data: results[0]
    });
  });
});

// Add new service record
router.post('/', (req, res) => {
  const { plateNumber, packageNumber, serviceDate } = req.body;

  // Validation
  if (!plateNumber || !packageNumber) {
    return res.status(400).json({
      success: false,
      message: 'Plate number and package number are required'
    });
  }

  const finalServiceDate = serviceDate || new Date().toISOString().split('T')[0];

  // Check if car exists
  const checkCarQuery = 'SELECT * FROM Car WHERE PlateNumber = ?';
  db.query(checkCarQuery, [plateNumber], (err, carResults) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Database error'
      });
    }

    if (carResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    // Check if package exists
    const checkPackageQuery = 'SELECT * FROM Package WHERE PackageNumber = ?';
    db.query(checkPackageQuery, [packageNumber], (err, packageResults) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error'
        });
      }

      if (packageResults.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Package not found'
        });
      }

      // Insert new service record
      const insertQuery = `
        INSERT INTO ServicePackage (ServiceDate, PlateNumber, PackageNumber) 
        VALUES (?, ?, ?)
      `;
      
      db.query(insertQuery, [finalServiceDate, plateNumber, packageNumber], (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            success: false,
            message: 'Failed to add service record'
          });
        }

        res.status(201).json({
          success: true,
          message: 'Service record added successfully',
          data: {
            recordNumber: result.insertId,
            serviceDate: finalServiceDate,
            plateNumber,
            packageNumber: parseInt(packageNumber),
            packagePrice: packageResults[0].PackagePrice
          }
        });
      });
    });
  });
});

// Update service record
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { plateNumber, packageNumber, serviceDate } = req.body;

  // Validation
  if (!plateNumber || !packageNumber || !serviceDate) {
    return res.status(400).json({
      success: false,
      message: 'Plate number, package number, and service date are required'
    });
  }

  // Check if service record exists
  const checkQuery = 'SELECT * FROM ServicePackage WHERE RecordNumber = ?';
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
        message: 'Service record not found'
      });
    }

    // Check if car exists
    const checkCarQuery = 'SELECT * FROM Car WHERE PlateNumber = ?';
    db.query(checkCarQuery, [plateNumber], (err, carResults) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error'
        });
      }

      if (carResults.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Car not found'
        });
      }

      // Check if package exists
      const checkPackageQuery = 'SELECT * FROM Package WHERE PackageNumber = ?';
      db.query(checkPackageQuery, [packageNumber], (err, packageResults) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            success: false,
            message: 'Database error'
          });
        }

        if (packageResults.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'Package not found'
          });
        }

        // Update service record
        const updateQuery = `
          UPDATE ServicePackage 
          SET ServiceDate = ?, PlateNumber = ?, PackageNumber = ? 
          WHERE RecordNumber = ?
        `;
        
        db.query(updateQuery, [serviceDate, plateNumber, packageNumber, id], (err, result) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
              success: false,
              message: 'Failed to update service record'
            });
          }

          res.json({
            success: true,
            message: 'Service record updated successfully',
            data: {
              recordNumber: parseInt(id),
              serviceDate,
              plateNumber,
              packageNumber: parseInt(packageNumber)
            }
          });
        });
      });
    });
  });
});

// Delete service record
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  // Check if service record exists
  const checkQuery = 'SELECT * FROM ServicePackage WHERE RecordNumber = ?';
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
        message: 'Service record not found'
      });
    }

    // Delete service record (this will also delete associated payment due to CASCADE)
    const deleteQuery = 'DELETE FROM ServicePackage WHERE RecordNumber = ?';
    db.query(deleteQuery, [id], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to delete service record'
        });
      }

      res.json({
        success: true,
        message: 'Service record deleted successfully'
      });
    });
  });
});

module.exports = router;
