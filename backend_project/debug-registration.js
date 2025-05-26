const axios = require('axios');
const bcrypt = require('bcryptjs');
const db = require('./config/database');

async function debugRegistration() {
  console.log('🔍 Debugging Registration System...\n');

  // Test 1: Database Connection
  console.log('1. Testing database connection...');
  try {
    await new Promise((resolve, reject) => {
      db.query('SELECT 1 as test', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    console.log('✅ Database connection working');
  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
    return;
  }

  // Test 2: Check User table
  console.log('\n2. Checking User table...');
  try {
    await new Promise((resolve, reject) => {
      db.query('DESCRIBE User', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    console.log('✅ User table exists');
  } catch (error) {
    console.log('❌ User table issue:', error.message);
    console.log('Creating User table...');
    
    try {
      await new Promise((resolve, reject) => {
        const createQuery = `
          CREATE TABLE User (
            UserID INT AUTO_INCREMENT PRIMARY KEY,
            Username VARCHAR(50) UNIQUE NOT NULL,
            Password VARCHAR(100) NOT NULL,
            CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `;
        db.query(createQuery, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
      console.log('✅ User table created');
    } catch (createError) {
      console.log('❌ Failed to create User table:', createError.message);
      return;
    }
  }

  // Test 3: Test backend server
  console.log('\n3. Testing backend server...');
  try {
    const healthResponse = await axios.get('http://localhost:5001/health');
    console.log('✅ Backend server responding:', healthResponse.data.status);
  } catch (error) {
    console.log('❌ Backend server not responding:', error.message);
    console.log('💡 Make sure backend is running on port 5001');
    return;
  }

  // Test 4: Test registration endpoint directly
  console.log('\n4. Testing registration endpoint...');
  const testUser = {
    username: 'testuser_' + Date.now(),
    password: 'testpass123'
  };

  try {
    const response = await axios.post('http://localhost:5001/api/auth/register', testUser, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    console.log('✅ Registration endpoint working:', response.data);
    
    // Clean up test user
    db.query('DELETE FROM User WHERE Username = ?', [testUser.username], () => {
      console.log('🧹 Test user cleaned up');
    });
    
  } catch (error) {
    console.log('❌ Registration endpoint failed:');
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    } else {
      console.log('   Error:', error.message);
    }
  }

  // Test 5: Test CORS
  console.log('\n5. Testing CORS configuration...');
  try {
    const corsResponse = await axios.options('http://localhost:5001/api/auth/register', {
      headers: {
        'Origin': 'http://localhost:5173',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    console.log('✅ CORS preflight working');
  } catch (error) {
    console.log('❌ CORS issue detected:', error.message);
  }

  console.log('\n🎯 Debug Summary:');
  console.log('- If all tests pass, the issue is likely in the frontend');
  console.log('- If database tests fail, check your MySQL/MariaDB connection');
  console.log('- If server tests fail, make sure backend is running on port 5001');
  console.log('- If CORS tests fail, there might be a browser/network issue');
  
  db.end();
}

debugRegistration();
