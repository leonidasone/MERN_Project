# Car Wash Management System (CWSMS) - Backend

## Database Setup

### Prerequisites
- MariaDB/MySQL installed and running
- Database user with appropriate privileges

### Database Creation and Setup

Run the following SQL queries in your MariaDB shell to set up the CWSMS database:

```sql
-- Create the database
CREATE DATABASE CWSMS;
USE CWSMS;

-- Create Package table
CREATE TABLE Package (
    PackageNumber INT AUTO_INCREMENT PRIMARY KEY,
    PackageName VARCHAR(50) NOT NULL,
    PackageDescription VARCHAR(100),
    PackagePrice DECIMAL(10,2) NOT NULL
);

-- Create Car table
CREATE TABLE Car (
    PlateNumber VARCHAR(20) PRIMARY KEY,
    CarType VARCHAR(50) NOT NULL,
    CarSize VARCHAR(20) NOT NULL,
    DriverName VARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(20) NOT NULL
);

-- Create ServicePackage table
CREATE TABLE ServicePackage (
    RecordNumber INT AUTO_INCREMENT PRIMARY KEY,
    ServiceDate DATE NOT NULL,
    PlateNumber VARCHAR(20) NOT NULL,
    PackageNumber INT NOT NULL,
    FOREIGN KEY (PlateNumber) REFERENCES Car(PlateNumber) ON DELETE CASCADE,
    FOREIGN KEY (PackageNumber) REFERENCES Package(PackageNumber) ON DELETE CASCADE
);

-- Create Payment table
CREATE TABLE Payment (
    PaymentNumber INT AUTO_INCREMENT PRIMARY KEY,
    AmountPaid DECIMAL(10,2) NOT NULL,
    PaymentDate DATE NOT NULL,
    RecordNumber INT NOT NULL,
    FOREIGN KEY (RecordNumber) REFERENCES ServicePackage(RecordNumber) ON DELETE CASCADE
);

-- Create User table for authentication
CREATE TABLE User (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(100) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
-- Insert default package
INSERT INTO Package (PackageName, PackageDescription, PackagePrice) 
VALUES ('Basic wash', 'Exterior hand wash', 5000.00);

-- Insert additional sample packages
INSERT INTO Package (PackageName, PackageDescription, PackagePrice) VALUES
('Premium wash', 'Exterior and interior cleaning', 8000.00),
('Deluxe wash', 'Full service with wax and polish', 12000.00),
('Quick wash', 'Basic exterior rinse', 3000.00);

-- Insert default admin user (password: admin123)
INSERT INTO User (Username, Password) 
VALUES ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Insert sample car data
INSERT INTO Car (PlateNumber, CarType, CarSize, DriverName, PhoneNumber) VALUES
('RAB123A', 'Toyota Corolla', 'Medium', 'John Doe', '+250788123456'),
('RAC456B', 'Honda Civic', 'Medium', 'Jane Smith', '+250788654321'),
('RAD789C', 'Toyota Land Cruiser', 'Large', 'Bob Johnson', '+250788987654');

-- Insert sample service records
INSERT INTO ServicePackage (ServiceDate, PlateNumber, PackageNumber) VALUES
(CURDATE(), 'RAB123A', 1),
(CURDATE(), 'RAC456B', 2),
(DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'RAD789C', 3);

-- Insert sample payments
INSERT INTO Payment (AmountPaid, PaymentDate, RecordNumber) VALUES
(5000.00, CURDATE(), 1),
(8000.00, CURDATE(), 2),
(12000.00, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 3);
```

## Environment Variables

Create a `.env` file in the backend_project directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_database_password
DB_NAME=CWSMS

# Server Configuration
PORT=5000

# JWT Secret (change this to a secure random string)
JWT_SECRET=your_jwt_secret_key_here

# Session Secret (change this to a secure random string)
SESSION_SECRET=your_session_secret_key_here
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check` - Check authentication status

### Cars
- `GET /api/cars` - Get all cars
- `POST /api/cars` - Add new car
- `GET /api/cars/:plateNumber` - Get car by plate number
- `PUT /api/cars/:plateNumber` - Update car
- `DELETE /api/cars/:plateNumber` - Delete car

### Packages
- `GET /api/packages` - Get all packages
- `POST /api/packages` - Add new package
- `GET /api/packages/:id` - Get package by ID
- `PUT /api/packages/:id` - Update package
- `DELETE /api/packages/:id` - Delete package

### Service Packages
- `GET /api/services` - Get all service records
- `POST /api/services` - Add new service record
- `GET /api/services/:id` - Get service by ID
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Payments
- `GET /api/payments` - Get all payments
- `POST /api/payments` - Add new payment
- `GET /api/payments/:id` - Get payment by ID
- `PUT /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment
- `GET /api/payments/service/:serviceId` - Get payment by service ID

### Reports
- `GET /api/reports/daily/:date` - Get daily report for specific date
- `GET /api/reports/monthly/:year/:month` - Get monthly report
- `GET /api/reports/summary` - Get summary statistics

### Bills
- `GET /api/bills/:paymentId` - Generate bill for payment

## Installation and Running

1. Install dependencies:
```bash
npm install
```

2. Set up your database using the SQL queries above
3. Create and configure your `.env` file
4. Start the server:
```bash
npm start
```

The server will run on `http://localhost:5000` by default.

## Database Schema

### Entity Relationship Diagram (ERD)
- Package (1) → (N) ServicePackage
- Car (1) → (N) ServicePackage  
- ServicePackage (1) → (1) Payment
- User table for authentication

### Tables:
1. **Package**: PackageNumber (PK), PackageName, PackageDescription, PackagePrice
2. **Car**: PlateNumber (PK), CarType, CarSize, DriverName, PhoneNumber
3. **ServicePackage**: RecordNumber (PK), ServiceDate, PlateNumber (FK), PackageNumber (FK)
4. **Payment**: PaymentNumber (PK), AmountPaid, PaymentDate, RecordNumber (FK)
5. **User**: UserID (PK), Username, Password, CreatedAt
