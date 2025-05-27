const express = require('express');
const db = require('../config/database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(requireAuth);

// Generate bill for a payment
router.get('/:paymentId', (req, res) => {
  const { paymentId } = req.params;

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
      p.PackageNumber,
      p.PackageName,
      p.PackageDescription,
      p.PackagePrice
    FROM Payment pay
    JOIN ServicePackage sp ON pay.RecordNumber = sp.RecordNumber
    JOIN Car c ON sp.PlateNumber = c.PlateNumber
    JOIN Package p ON sp.PackageNumber = p.PackageNumber
    WHERE pay.PaymentNumber = ?
  `;
  
  db.query(query, [paymentId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch bill information'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    const billData = results[0];
    
    // Generate bill number (format: BILL-YYYY-MM-DD-XXXXX)
    const billDate = new Date().toISOString().split('T')[0];
    const billNumber = `BILL-${billDate}-${String(billData.PaymentNumber).padStart(5, '0')}`;

    // Calculate any additional charges or discounts (if applicable)
    const subtotal = parseFloat(billData.PackagePrice);
    const discount = 0; // No discount for now
    const tax = 0; // No tax for now
    const total = parseFloat(billData.AmountPaid);

    const bill = {
      billNumber,
      billDate,
      company: {
        name: 'SmartPark Car Wash',
        address: 'Rubavu District, Western Province, Rwanda',
        phone: '+250 788 000 000',
        email: 'info@smartpark.rw'
      },
      customer: {
        name: billData.DriverName,
        phone: billData.PhoneNumber,
        plateNumber: billData.PlateNumber,
        carType: billData.CarType,
        carSize: billData.CarSize
      },
      service: {
        recordNumber: billData.RecordNumber,
        serviceDate: billData.ServiceDate,
        packageNumber: billData.PackageNumber,
        packageName: billData.PackageName,
        packageDescription: billData.PackageDescription,
        packagePrice: parseFloat(billData.PackagePrice.toFixed(2))
      },
      payment: {
        paymentNumber: billData.PaymentNumber,
        paymentDate: billData.PaymentDate,
        amountPaid: parseFloat(billData.AmountPaid.toFixed(2)),
        paymentMethod: 'Cash' // Default payment method
      },
      billing: {
        subtotal: subtotal.toFixed(2),
        discount: discount.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2)
      }
    };

    res.json({
      success: true,
      data: bill
    });
  });
});

// Generate bill by service record number
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
      p.PackageNumber,
      p.PackageName,
      p.PackageDescription,
      p.PackagePrice
    FROM ServicePackage sp
    JOIN Car c ON sp.PlateNumber = c.PlateNumber
    JOIN Package p ON sp.PackageNumber = p.PackageNumber
    LEFT JOIN Payment pay ON sp.RecordNumber = pay.RecordNumber
    WHERE sp.RecordNumber = ?
  `;
  
  db.query(query, [serviceId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch service information'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service record not found'
      });
    }

    const serviceData = results[0];

    if (!serviceData.PaymentNumber) {
      return res.status(400).json({
        success: false,
        message: 'No payment found for this service. Please complete payment first.'
      });
    }
    
    // Generate bill number (format: BILL-YYYY-MM-DD-XXXXX)
    const billDate = new Date().toISOString().split('T')[0];
    const billNumber = `BILL-${billDate}-${String(serviceData.PaymentNumber).padStart(5, '0')}`;

    // Calculate billing details
    const subtotal = parseFloat(serviceData.PackagePrice);
    const discount = 0;
    const tax = 0;
    const total = parseFloat(serviceData.AmountPaid);

    const bill = {
      billNumber,
      billDate,
      company: {
        name: 'SmartPark Car Wash',
        address: 'Rubavu District, Western Province, Rwanda',
        phone: '+250 788 000 000',
        email: 'info@smartpark.rw'
      },
      customer: {
        name: serviceData.DriverName,
        phone: serviceData.PhoneNumber,
        plateNumber: serviceData.PlateNumber,
        carType: serviceData.CarType,
        carSize: serviceData.CarSize
      },
      service: {
        recordNumber: serviceData.RecordNumber,
        serviceDate: serviceData.ServiceDate,
        packageNumber: serviceData.PackageNumber,
        packageName: serviceData.PackageName,
        packageDescription: serviceData.PackageDescription,
        packagePrice: parseFloat(serviceData.PackagePrice.toFixed(2))
      },
      payment: {
        paymentNumber: serviceData.PaymentNumber,
        paymentDate: serviceData.PaymentDate,
        amountPaid: parseFloat(serviceData.AmountPaid.toFixed(2)),
        paymentMethod: 'Cash'
      },
      billing: {
        subtotal: subtotal.toFixed(2),
        discount: discount.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2)
      }
    };

    res.json({
      success: true,
      data: bill
    });
  });
});

module.exports = router;
