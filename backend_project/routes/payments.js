const express = require('express');
const db = require('../config/database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(requireAuth);

// Get all payments with service details
router.get('/', (req, res) => {
  const query = `
    SELECT 
      pay.PaymentNumber,
      pay.AmountPaid,
      pay.PaymentDate,
      pay.RecordNumber,
      sp.ServiceDate,
      sp.PlateNumber,
      c.CarType,
      c.DriverName,
      c.PhoneNumber,
      p.PackageName,
      p.PackageDescription,
      p.PackagePrice
    FROM Payment pay
    LEFT JOIN ServicePackage sp ON pay.RecordNumber = sp.RecordNumber
    LEFT JOIN Car c ON sp.PlateNumber = c.PlateNumber
    LEFT JOIN Package p ON sp.PackageNumber = p.PackageNumber
    ORDER BY pay.PaymentDate DESC, pay.PaymentNumber DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch payments'
      });
    }

    res.json({
      success: true,
      data: results
    });
  });
});

// Get payment by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT 
      pay.PaymentNumber,
      pay.AmountPaid,
      pay.PaymentDate,
      pay.RecordNumber,
      sp.ServiceDate,
      sp.PlateNumber,
      c.CarType,
      c.CarSize,
      c.DriverName,
      c.PhoneNumber,
      p.PackageName,
      p.PackageDescription,
      p.PackagePrice
    FROM Payment pay
    LEFT JOIN ServicePackage sp ON pay.RecordNumber = sp.RecordNumber
    LEFT JOIN Car c ON sp.PlateNumber = c.PlateNumber
    LEFT JOIN Package p ON sp.PackageNumber = p.PackageNumber
    WHERE pay.PaymentNumber = ?
  `;
  
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch payment'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json({
      success: true,
      data: results[0]
    });
  });
});

// Get payment by service ID
router.get('/service/:serviceId', (req, res) => {
  const { serviceId } = req.params;
  const query = `
    SELECT 
      pay.PaymentNumber,
      pay.AmountPaid,
      pay.PaymentDate,
      pay.RecordNumber,
      sp.ServiceDate,
      sp.PlateNumber,
      c.CarType,
      c.CarSize,
      c.DriverName,
      c.PhoneNumber,
      p.PackageName,
      p.PackageDescription,
      p.PackagePrice
    FROM Payment pay
    LEFT JOIN ServicePackage sp ON pay.RecordNumber = sp.RecordNumber
    LEFT JOIN Car c ON sp.PlateNumber = c.PlateNumber
    LEFT JOIN Package p ON sp.PackageNumber = p.PackageNumber
    WHERE pay.RecordNumber = ?
  `;
  
  db.query(query, [serviceId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch payment'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found for this service'
      });
    }

    res.json({
      success: true,
      data: results[0]
    });
  });
});

// Add new payment
router.post('/', (req, res) => {
  const { recordNumber, amountPaid, paymentDate } = req.body;

  // Validation
  if (!recordNumber || !amountPaid) {
    return res.status(400).json({
      success: false,
      message: 'Service record number and amount paid are required'
    });
  }

  if (isNaN(amountPaid) || amountPaid <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Amount paid must be a positive number'
    });
  }

  const finalPaymentDate = paymentDate || new Date().toISOString().split('T')[0];

  // Check if service record exists
  const checkServiceQuery = 'SELECT * FROM ServicePackage WHERE RecordNumber = ?';
  db.query(checkServiceQuery, [recordNumber], (err, serviceResults) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Database error'
      });
    }

    if (serviceResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service record not found'
      });
    }

    // Check if payment already exists for this service
    const checkPaymentQuery = 'SELECT * FROM Payment WHERE RecordNumber = ?';
    db.query(checkPaymentQuery, [recordNumber], (err, paymentResults) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error'
        });
      }

      if (paymentResults.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Payment already exists for this service record'
        });
      }

      // Insert new payment
      const insertQuery = `
        INSERT INTO Payment (AmountPaid, PaymentDate, RecordNumber) 
        VALUES (?, ?, ?)
      `;
      
      db.query(insertQuery, [amountPaid, finalPaymentDate, recordNumber], (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            success: false,
            message: 'Failed to add payment'
          });
        }

        res.status(201).json({
          success: true,
          message: 'Payment added successfully',
          data: {
            paymentNumber: result.insertId,
            amountPaid: parseFloat(amountPaid),
            paymentDate: finalPaymentDate,
            recordNumber: parseInt(recordNumber)
          }
        });
      });
    });
  });
});

// Update payment
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { amountPaid, paymentDate } = req.body;

  // Validation
  if (!amountPaid || !paymentDate) {
    return res.status(400).json({
      success: false,
      message: 'Amount paid and payment date are required'
    });
  }

  if (isNaN(amountPaid) || amountPaid <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Amount paid must be a positive number'
    });
  }

  // Check if payment exists
  const checkQuery = 'SELECT * FROM Payment WHERE PaymentNumber = ?';
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
        message: 'Payment not found'
      });
    }

    // Update payment
    const updateQuery = `
      UPDATE Payment 
      SET AmountPaid = ?, PaymentDate = ? 
      WHERE PaymentNumber = ?
    `;
    
    db.query(updateQuery, [amountPaid, paymentDate, id], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to update payment'
        });
      }

      res.json({
        success: true,
        message: 'Payment updated successfully',
        data: {
          paymentNumber: parseInt(id),
          amountPaid: parseFloat(amountPaid),
          paymentDate,
          recordNumber: results[0].RecordNumber
        }
      });
    });
  });
});

// Delete payment
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  // Check if payment exists
  const checkQuery = 'SELECT * FROM Payment WHERE PaymentNumber = ?';
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
        message: 'Payment not found'
      });
    }

    // Delete payment
    const deleteQuery = 'DELETE FROM Payment WHERE PaymentNumber = ?';
    db.query(deleteQuery, [id], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to delete payment'
        });
      }

      res.json({
        success: true,
        message: 'Payment deleted successfully'
      });
    });
  });
});

module.exports = router;
