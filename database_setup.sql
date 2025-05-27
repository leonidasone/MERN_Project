-- SmartPark Parking Ticket Management System Database Setup
-- PREPARED BY DB-ROOM SERVICE

CREATE DATABASE IF NOT EXISTS PTMS;
USE PTMS;

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS Payment;
DROP TABLE IF EXISTS ParkingTicket;
DROP TABLE IF EXISTS Vehicle;
DROP TABLE IF EXISTS ParkingPackage;
DROP TABLE IF EXISTS User;

-- Create ParkingPackage table
CREATE TABLE ParkingPackage (
    PackageNumber INT AUTO_INCREMENT PRIMARY KEY,
    PackageName VARCHAR(50) NOT NULL,
    PackageDescription VARCHAR(100),
    RatePerHour DECIMAL(10,2) NOT NULL
);

-- Create Vehicle table
CREATE TABLE Vehicle (
    PlateNumber VARCHAR(20) PRIMARY KEY,
    VehicleType VARCHAR(50) NOT NULL,
    DriverName VARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(20)
);

-- Create ParkingTicket table
CREATE TABLE ParkingTicket (
    TicketNumber INT AUTO_INCREMENT PRIMARY KEY,
    EntryTime DATETIME NOT NULL,
    ExitTime DATETIME NULL,
    Duration INT NULL, -- in hours
    TotalFee DECIMAL(10,2) NULL,
    PlateNumber VARCHAR(20) NOT NULL,
    PackageNumber INT NOT NULL,
    Status ENUM('ACTIVE', 'COMPLETED') DEFAULT 'ACTIVE',
    FOREIGN KEY (PlateNumber) REFERENCES Vehicle(PlateNumber) ON DELETE CASCADE,
    FOREIGN KEY (PackageNumber) REFERENCES ParkingPackage(PackageNumber) ON DELETE RESTRICT
);

-- Create Payment table
CREATE TABLE Payment (
    PaymentNumber INT AUTO_INCREMENT PRIMARY KEY,
    AmountPaid DECIMAL(10,2) NOT NULL,
    PaymentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    PaymentMethod ENUM('CASH', 'CARD', 'MOBILE') DEFAULT 'CASH',
    TicketNumber INT NOT NULL,
    FOREIGN KEY (TicketNumber) REFERENCES ParkingTicket(TicketNumber) ON DELETE CASCADE
);

-- Create User table for authentication
CREATE TABLE User (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(100) NOT NULL,
    FullName VARCHAR(100),
    Role ENUM('RECEPTIONIST', 'ADMIN') DEFAULT 'RECEPTIONIST',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample parking packages
INSERT INTO ParkingPackage (PackageName, PackageDescription, RatePerHour) VALUES
('Hourly Parking', 'Standard parking charged per hour', 1000.00),
('Daily Parking', 'Full day parking package (up to 24 hours)', 15000.00),
('VIP Parking', 'Premium parking with additional services', 2000.00),
('Overnight Parking', 'Special rate for overnight parking (6 PM - 8 AM)', 8000.00);

-- Insert default admin user (password: admin123)
INSERT INTO User (Username, Password, FullName, Role) VALUES
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator', 'ADMIN'),
('receptionist', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Front Desk Receptionist', 'RECEPTIONIST');

-- Insert sample vehicles for testing
INSERT INTO Vehicle (PlateNumber, VehicleType, DriverName, PhoneNumber) VALUES
('ABC-123', 'Sedan', 'John Doe', '+1234567890'),
('XYZ-789', 'SUV', 'Jane Smith', '+0987654321'),
('DEF-456', 'Motorcycle', 'Bob Johnson', '+1122334455');

-- Create indexes for better performance
CREATE INDEX idx_parking_ticket_entry_time ON ParkingTicket(EntryTime);
CREATE INDEX idx_parking_ticket_status ON ParkingTicket(Status);
CREATE INDEX idx_payment_date ON Payment(PaymentDate);

-- Create view for daily reports
CREATE VIEW DailyReport AS
SELECT 
    DATE(pt.EntryTime) as ReportDate,
    COUNT(pt.TicketNumber) as TotalTickets,
    COUNT(CASE WHEN pt.Status = 'COMPLETED' THEN 1 END) as CompletedTickets,
    COUNT(CASE WHEN pt.Status = 'ACTIVE' THEN 1 END) as ActiveTickets,
    COALESCE(SUM(pt.TotalFee), 0) as TotalFees,
    COALESCE(SUM(p.AmountPaid), 0) as TotalPayments
FROM ParkingTicket pt
LEFT JOIN Payment p ON pt.TicketNumber = p.TicketNumber
GROUP BY DATE(pt.EntryTime)
ORDER BY ReportDate DESC;

COMMIT;
