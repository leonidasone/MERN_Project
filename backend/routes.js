// Additional routes for SmartPark PTMS
// This file contains parking ticket, payment, and report routes

// ==================== PARKING TICKET ROUTES ====================

// Get all parking tickets
const getParkingTickets = (req, res, db) => {
  const query = `
    SELECT 
      pt.*,
      v.VehicleType,
      v.DriverName,
      v.PhoneNumber,
      pp.PackageName,
      pp.RatePerHour
    FROM ParkingTicket pt
    JOIN Vehicle v ON pt.PlateNumber = v.PlateNumber
    JOIN ParkingPackage pp ON pt.PackageNumber = pp.PackageNumber
    ORDER BY pt.EntryTime DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.json(results);
  });
};

// Get single parking ticket
const getParkingTicket = (req, res, db) => {
  const ticketNumber = req.params.id;
  const query = `
    SELECT 
      pt.*,
      v.VehicleType,
      v.DriverName,
      v.PhoneNumber,
      pp.PackageName,
      pp.RatePerHour
    FROM ParkingTicket pt
    JOIN Vehicle v ON pt.PlateNumber = v.PlateNumber
    JOIN ParkingPackage pp ON pt.PackageNumber = pp.PackageNumber
    WHERE pt.TicketNumber = ?
  `;
  
  db.query(query, [ticketNumber], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    res.json(results[0]);
  });
};

// Create new parking ticket
const createParkingTicket = (req, res, db) => {
  const { PlateNumber, PackageNumber } = req.body;
  
  if (!PlateNumber || !PackageNumber) {
    return res.status(400).json({ message: 'Plate number and package number are required' });
  }
  
  // Check if vehicle exists
  const checkVehicleQuery = 'SELECT * FROM Vehicle WHERE PlateNumber = ?';
  
  db.query(checkVehicleQuery, [PlateNumber], (err, vehicleResults) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    
    if (vehicleResults.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    // Check if vehicle has active ticket
    const checkActiveQuery = 'SELECT * FROM ParkingTicket WHERE PlateNumber = ? AND Status = "ACTIVE"';
    
    db.query(checkActiveQuery, [PlateNumber], (err, activeResults) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
      
      if (activeResults.length > 0) {
        return res.status(400).json({ message: 'Vehicle already has an active parking ticket' });
      }
      
      // Create new ticket
      const entryTime = new Date();
      const insertQuery = 'INSERT INTO ParkingTicket (EntryTime, PlateNumber, PackageNumber, Status) VALUES (?, ?, ?, "ACTIVE")';
      
      db.query(insertQuery, [entryTime, PlateNumber, PackageNumber], (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Internal server error' });
        }
        
        res.status(201).json({
          message: 'Parking ticket created successfully',
          ticketNumber: results.insertId,
          entryTime: entryTime
        });
      });
    });
  });
};

// Calculate and complete parking ticket
const completeParkingTicket = (req, res, db) => {
  const ticketNumber = req.params.id;
  
  // Get ticket details
  const getTicketQuery = `
    SELECT 
      pt.*,
      pp.RatePerHour
    FROM ParkingTicket pt
    JOIN ParkingPackage pp ON pt.PackageNumber = pp.PackageNumber
    WHERE pt.TicketNumber = ? AND pt.Status = "ACTIVE"
  `;
  
  db.query(getTicketQuery, [ticketNumber], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'Active ticket not found' });
    }
    
    const ticket = results[0];
    const exitTime = new Date();
    const entryTime = new Date(ticket.EntryTime);
    
    // Calculate duration in hours (minimum 1 hour)
    const durationMs = exitTime - entryTime;
    const durationHours = Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60)));
    
    // Calculate total fee
    const totalFee = durationHours * ticket.RatePerHour;
    
    // Update ticket
    const updateQuery = 'UPDATE ParkingTicket SET ExitTime = ?, Duration = ?, TotalFee = ?, Status = "COMPLETED" WHERE TicketNumber = ?';
    
    db.query(updateQuery, [exitTime, durationHours, totalFee, ticketNumber], (err, updateResults) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
      
      res.json({
        message: 'Parking ticket completed successfully',
        ticketNumber: ticketNumber,
        duration: durationHours,
        totalFee: totalFee,
        exitTime: exitTime
      });
    });
  });
};

// ==================== PAYMENT ROUTES ====================

// Get all payments
const getPayments = (req, res, db) => {
  const query = `
    SELECT 
      p.*,
      pt.PlateNumber,
      pt.EntryTime,
      pt.ExitTime,
      pt.TotalFee
    FROM Payment p
    JOIN ParkingTicket pt ON p.TicketNumber = pt.TicketNumber
    ORDER BY p.PaymentDate DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.json(results);
  });
};

// Create payment
const createPayment = (req, res, db) => {
  const { TicketNumber, AmountPaid, PaymentMethod } = req.body;
  
  if (!TicketNumber || !AmountPaid) {
    return res.status(400).json({ message: 'Ticket number and amount paid are required' });
  }
  
  // Check if ticket exists and is completed
  const checkTicketQuery = 'SELECT * FROM ParkingTicket WHERE TicketNumber = ? AND Status = "COMPLETED"';
  
  db.query(checkTicketQuery, [TicketNumber], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'Completed ticket not found' });
    }
    
    // Check if payment already exists
    const checkPaymentQuery = 'SELECT * FROM Payment WHERE TicketNumber = ?';
    
    db.query(checkPaymentQuery, [TicketNumber], (err, paymentResults) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
      
      if (paymentResults.length > 0) {
        return res.status(400).json({ message: 'Payment already exists for this ticket' });
      }
      
      // Create payment
      const insertQuery = 'INSERT INTO Payment (TicketNumber, AmountPaid, PaymentMethod, PaymentDate) VALUES (?, ?, ?, NOW())';
      
      db.query(insertQuery, [TicketNumber, AmountPaid, PaymentMethod || 'CASH'], (err, insertResults) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Internal server error' });
        }
        
        res.status(201).json({
          message: 'Payment created successfully',
          paymentNumber: insertResults.insertId
        });
      });
    });
  });
};

// ==================== REPORT ROUTES ====================

// Get daily report
const getDailyReport = (req, res, db) => {
  const { date } = req.query;
  
  if (!date) {
    return res.status(400).json({ message: 'Date parameter is required (YYYY-MM-DD format)' });
  }
  
  const query = `
    SELECT 
      DATE(pt.EntryTime) as ReportDate,
      COUNT(pt.TicketNumber) as TotalTickets,
      COUNT(CASE WHEN pt.Status = 'COMPLETED' THEN 1 END) as CompletedTickets,
      COUNT(CASE WHEN pt.Status = 'ACTIVE' THEN 1 END) as ActiveTickets,
      COALESCE(SUM(pt.TotalFee), 0) as TotalFees,
      COALESCE(SUM(p.AmountPaid), 0) as TotalPayments
    FROM ParkingTicket pt
    LEFT JOIN Payment p ON pt.TicketNumber = p.TicketNumber
    WHERE DATE(pt.EntryTime) = ?
    GROUP BY DATE(pt.EntryTime)
  `;
  
  db.query(query, [date], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    
    if (results.length === 0) {
      return res.json({
        ReportDate: date,
        TotalTickets: 0,
        CompletedTickets: 0,
        ActiveTickets: 0,
        TotalFees: 0,
        TotalPayments: 0
      });
    }
    
    res.json(results[0]);
  });
};

module.exports = {
  getParkingTickets,
  getParkingTicket,
  createParkingTicket,
  completeParkingTicket,
  getPayments,
  createPayment,
  getDailyReport
};
