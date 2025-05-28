# SmartPark Gas Station Management System (GSMS)

A comprehensive web-based Gas Station Management System built with React.js frontend and Node.js backend, featuring **BOLD** design principles with TailwindCSS v3.

## 🚀 Features

### Core Functionality
- **Fuel Provision Tracking** - Log every drop of fuel dispensed, tied to pumps and customers
- **Task Management** - Handle refills, pump maintenance, and station operations
- **Daily Reports** - Summarize fuel sold, stock levels, and payments
- **Inventory Management** - Real-time stock tracking with automatic updates
- **Customer Management** - Maintain customer database
- **Payment Processing** - Track payments with multiple methods
- **Pump Management** - Monitor pump status and fuel type assignments

### Technical Features
- **Secure Authentication** - Session-based login system
- **Real-time Data** - Live updates across all modules
- **Responsive Design** - Mobile-friendly BOLD interface
- **Print Reports** - Professional daily report generation
- **Database Integration** - MySQL with comprehensive schema

## 🛠 Technology Stack

### Backend
- **Node.js** with Express.js
- **MySQL** database
- **express-session** for authentication
- **CORS** enabled for frontend communication

### Frontend
- **React.js** with Vite
- **TailwindCSS v3** with BOLD design system
- **React Router** for navigation
- **Axios** for API communication

## 📁 Project Structure

```
project5/
├── backend/
│   ├── index.js          # Main server file
│   ├── package.json      # Backend dependencies
│   └── .env             # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── App.jsx      # Main app component
│   │   └── index.css    # TailwindCSS styles
│   ├── package.json     # Frontend dependencies
│   └── tailwind.config.js
└── README.md
```

## 🗄 Database Schema

### Tables
- **FuelType** - Fuel types and pricing
- **FuelPump** - Pump information and status
- **Customer** - Customer database
- **FuelTransaction** - Transaction records
- **Payment** - Payment tracking
- **FuelInventory** - Stock management
- **StationTask** - Task management
- **User** - System users

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MySQL Server
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project5
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Database Setup**
   - Ensure MySQL is running
   - Database `GSMS_v2` is already created with sample data

5. **Environment Configuration**
   - Backend `.env` is configured for local MySQL
   - Default credentials: root user with empty password

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server runs on: http://localhost:5000

2. **Start Frontend Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Application runs on: http://localhost:5173

## 🔐 Default Login

- **Username:** manager
- **Password:** password123

## 📊 Application Modules

### 1. Dashboard
- Real-time statistics
- Recent transactions
- Quick actions
- System overview

### 2. Fuel Types
- Add/Edit fuel types
- Price management
- Fuel type listing

### 3. Pumps
- Pump status monitoring
- Fuel type assignments
- Operational status tracking

### 4. Customers
- Customer registration
- Contact information
- Customer database

### 5. Transactions
- New transaction recording
- Transaction history
- Automatic inventory updates

### 6. Payments
- Payment tracking
- Multiple payment methods
- Payment history

### 7. Inventory
- Stock level monitoring
- Low stock alerts
- Inventory updates

### 8. Tasks
- Task assignment
- Status tracking
- Due date management

### 9. Reports
- Daily sales reports
- Fuel consumption analysis
- Payment summaries
- Printable reports

## 🎨 Design System

The application uses a **BOLD** design approach with:
- **Heavy font weights** (font-bold, font-black)
- **High contrast colors**
- **Large, prominent buttons**
- **Clear visual hierarchy**
- **Strong borders and shadows**

## 🔧 API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/auth/check` - Check authentication

### Fuel Types
- `GET /api/fuel-types` - Get all fuel types
- `POST /api/fuel-types` - Add fuel type
- `PUT /api/fuel-types/:id` - Update fuel type
- `DELETE /api/fuel-types/:id` - Delete fuel type

### Pumps
- `GET /api/pumps` - Get all pumps
- `POST /api/pumps` - Add pump
- `PUT /api/pumps/:id` - Update pump

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction

### Reports
- `GET /api/report/daily?date=YYYY-MM-DD` - Get daily report

## 📱 Mobile Responsive

The application is fully responsive with:
- Mobile-first design
- Collapsible navigation
- Touch-friendly interfaces
- Optimized layouts for all screen sizes

## 🔒 Security Features

- Session-based authentication
- Protected API routes
- Input validation
- SQL injection prevention

## 📈 Future Enhancements

- Multi-station support
- Advanced analytics
- Automated alerts
- Integration with payment gateways
- Mobile app development

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**SmartPark GSMS** - Revolutionizing Gas Station Management with Modern Technology
