const express = require('express');
const db = require('../config/database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(requireAuth);

// Get daily report for a specific date
router.get('/daily/:date', (req, res) => {
  const { date } = req.params;

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid date format. Use YYYY-MM-DD'
    });
  }

  const query = `
    SELECT 
      sp.RecordNumber,
      sp.ServiceDate,
      sp.PlateNumber,
      c.CarType,
      c.DriverName,
      c.PhoneNumber,
      p.PackageName,
      p.PackageDescription,
      p.PackagePrice,
      pay.AmountPaid,
      pay.PaymentDate,
      pay.PaymentNumber
    FROM ServicePackage sp
    LEFT JOIN Car c ON sp.PlateNumber = c.PlateNumber
    LEFT JOIN Package p ON sp.PackageNumber = p.PackageNumber
    LEFT JOIN Payment pay ON sp.RecordNumber = pay.RecordNumber
    WHERE sp.ServiceDate = ?
    ORDER BY sp.RecordNumber
  `;
  
  db.query(query, [date], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch daily report'
      });
    }

    // Calculate totals
    const totalServices = results.length;
    const totalRevenue = results.reduce((sum, record) => {
      return sum + (record.AmountPaid || 0);
    }, 0);
    const paidServices = results.filter(record => record.AmountPaid !== null).length;
    const unpaidServices = totalServices - paidServices;

    res.json({
      success: true,
      data: {
        date,
        summary: {
          totalServices,
          paidServices,
          unpaidServices,
          totalRevenue: parseFloat(totalRevenue.toFixed(2))
        },
        services: results
      }
    });
  });
});

// Get monthly report
router.get('/monthly/:year/:month', (req, res) => {
  const { year, month } = req.params;

  // Validate year and month
  if (!/^\d{4}$/.test(year) || !/^(0?[1-9]|1[0-2])$/.test(month)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid year or month format'
    });
  }

  const paddedMonth = month.padStart(2, '0');
  const startDate = `${year}-${paddedMonth}-01`;
  const endDate = `${year}-${paddedMonth}-31`;

  const query = `
    SELECT 
      sp.ServiceDate,
      COUNT(sp.RecordNumber) as totalServices,
      COUNT(pay.PaymentNumber) as paidServices,
      SUM(pay.AmountPaid) as totalRevenue,
      AVG(pay.AmountPaid) as averageRevenue
    FROM ServicePackage sp
    LEFT JOIN Payment pay ON sp.RecordNumber = pay.RecordNumber
    WHERE sp.ServiceDate BETWEEN ? AND ?
    GROUP BY sp.ServiceDate
    ORDER BY sp.ServiceDate
  `;
  
  db.query(query, [startDate, endDate], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch monthly report'
      });
    }

    // Calculate monthly totals
    const monthlyTotals = results.reduce((totals, day) => {
      return {
        totalServices: totals.totalServices + day.totalServices,
        paidServices: totals.paidServices + day.paidServices,
        totalRevenue: totals.totalRevenue + (day.totalRevenue || 0)
      };
    }, { totalServices: 0, paidServices: 0, totalRevenue: 0 });

    res.json({
      success: true,
      data: {
        year: parseInt(year),
        month: parseInt(month),
        summary: {
          ...monthlyTotals,
          unpaidServices: monthlyTotals.totalServices - monthlyTotals.paidServices,
          totalRevenue: parseFloat(monthlyTotals.totalRevenue.toFixed(2)),
          averageDailyRevenue: results.length > 0 ? 
            parseFloat((monthlyTotals.totalRevenue / results.length).toFixed(2)) : 0
        },
        dailyBreakdown: results.map(day => ({
          ...day,
          totalRevenue: parseFloat((day.totalRevenue || 0).toFixed(2)),
          averageRevenue: parseFloat((day.averageRevenue || 0).toFixed(2)),
          unpaidServices: day.totalServices - day.paidServices
        }))
      }
    });
  });
});

// Get summary statistics
router.get('/summary', (req, res) => {
  const queries = {
    totalCars: 'SELECT COUNT(*) as count FROM Car',
    totalPackages: 'SELECT COUNT(*) as count FROM Package',
    totalServices: 'SELECT COUNT(*) as count FROM ServicePackage',
    totalPayments: 'SELECT COUNT(*) as count FROM Payment',
    totalRevenue: 'SELECT SUM(AmountPaid) as total FROM Payment',
    todayServices: 'SELECT COUNT(*) as count FROM ServicePackage WHERE ServiceDate = CURDATE()',
    todayRevenue: `
      SELECT SUM(pay.AmountPaid) as total 
      FROM Payment pay 
      JOIN ServicePackage sp ON pay.RecordNumber = sp.RecordNumber 
      WHERE sp.ServiceDate = CURDATE()
    `,
    unpaidServices: `
      SELECT COUNT(*) as count 
      FROM ServicePackage sp 
      LEFT JOIN Payment pay ON sp.RecordNumber = pay.RecordNumber 
      WHERE pay.PaymentNumber IS NULL
    `,
    recentServices: `
      SELECT 
        sp.RecordNumber,
        sp.ServiceDate,
        sp.PlateNumber,
        c.DriverName,
        p.PackageName,
        p.PackagePrice,
        pay.AmountPaid
      FROM ServicePackage sp
      LEFT JOIN Car c ON sp.PlateNumber = c.PlateNumber
      LEFT JOIN Package p ON sp.PackageNumber = p.PackageNumber
      LEFT JOIN Payment pay ON sp.RecordNumber = pay.RecordNumber
      ORDER BY sp.ServiceDate DESC, sp.RecordNumber DESC
      LIMIT 10
    `
  };

  // Execute all queries
  const executeQuery = (queryName, sql) => {
    return new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve({ [queryName]: results });
        }
      });
    });
  };

  Promise.all([
    executeQuery('totalCars', queries.totalCars),
    executeQuery('totalPackages', queries.totalPackages),
    executeQuery('totalServices', queries.totalServices),
    executeQuery('totalPayments', queries.totalPayments),
    executeQuery('totalRevenue', queries.totalRevenue),
    executeQuery('todayServices', queries.todayServices),
    executeQuery('todayRevenue', queries.todayRevenue),
    executeQuery('unpaidServices', queries.unpaidServices),
    executeQuery('recentServices', queries.recentServices)
  ])
  .then(results => {
    const summary = {};
    results.forEach(result => {
      Object.assign(summary, result);
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalCars: summary.totalCars[0].count,
          totalPackages: summary.totalPackages[0].count,
          totalServices: summary.totalServices[0].count,
          totalPayments: summary.totalPayments[0].count,
          totalRevenue: parseFloat((summary.totalRevenue[0].total || 0).toFixed(2)),
          unpaidServices: summary.unpaidServices[0].count
        },
        today: {
          services: summary.todayServices[0].count,
          revenue: parseFloat((summary.todayRevenue[0].total || 0).toFixed(2))
        },
        recentServices: summary.recentServices.map(service => ({
          ...service,
          PackagePrice: parseFloat((service.PackagePrice || 0).toFixed(2)),
          AmountPaid: parseFloat((service.AmountPaid || 0).toFixed(2))
        }))
      }
    });
  })
  .catch(err => {
    console.error('Database error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch summary statistics'
    });
  });
});

// Get revenue trends (last 30 days)
router.get('/trends', (req, res) => {
  const query = `
    SELECT 
      sp.ServiceDate,
      COUNT(sp.RecordNumber) as services,
      COALESCE(SUM(pay.AmountPaid), 0) as revenue
    FROM ServicePackage sp
    LEFT JOIN Payment pay ON sp.RecordNumber = pay.RecordNumber
    WHERE sp.ServiceDate >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    GROUP BY sp.ServiceDate
    ORDER BY sp.ServiceDate
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch revenue trends'
      });
    }

    res.json({
      success: true,
      data: results.map(day => ({
        date: day.ServiceDate,
        services: day.services,
        revenue: parseFloat(day.revenue.toFixed(2))
      }))
    });
  });
});

module.exports = router;
