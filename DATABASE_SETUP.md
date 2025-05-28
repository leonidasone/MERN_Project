# Database Setup Guide

Your Node.js backend is trying to connect to MySQL but the database server is not running. Here are several ways to fix this:

## Option 1: Using Docker (Recommended for Development)

### Prerequisites
- Install Docker Desktop from https://www.docker.com/products/docker-desktop

### Steps
1. Open terminal in the project root directory (`project5`)
2. Run the following command:
   ```bash
   docker-compose up -d
   ```
3. Wait for the containers to start (first time may take a few minutes)
4. Your MySQL database will be available at `localhost:3306`
5. phpMyAdmin will be available at `http://localhost:8080`

### Access phpMyAdmin
- URL: http://localhost:8080
- Username: root
- Password: rootpassword

### Stop the database
```bash
docker-compose down
```

## Option 2: Install MySQL Server Locally

### Windows
1. Download MySQL Installer from https://dev.mysql.com/downloads/installer/
2. Install MySQL Server
3. Set root password to `rootpassword` (or update .env file)
4. Create database named `testdb`
5. Start MySQL service

### Using Chocolatey (Windows)
```bash
choco install mysql
```

### macOS
```bash
brew install mysql
brew services start mysql
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

## Option 3: Use XAMPP (Easiest for Beginners)

1. Download XAMPP from https://www.apachefriends.org/
2. Install and start Apache and MySQL services
3. Access phpMyAdmin at http://localhost/phpmyadmin
4. Create database named `testdb`
5. Import the `backend/init.sql` file

## Testing the Connection

Once your database is running, restart your backend server:

```bash
cd backend
npm run dev
```

Test the database connection by visiting:
- http://localhost:5000/api/db-test
- http://localhost:5000/api/users

## Environment Variables

The database configuration is in `backend/.env`:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=testdb
```

Update these values according to your MySQL setup.

## Troubleshooting

### Connection Refused Error
- Make sure MySQL service is running
- Check if port 3306 is available
- Verify credentials in .env file

### Access Denied Error
- Check username and password
- Make sure user has proper permissions

### Database Not Found
- Create the database manually
- Run the init.sql script to create tables

## Database Schema

The `init.sql` file creates:
- `users` table with id, username, email, password
- `posts` table with id, title, content, user_id
- Sample data for testing
