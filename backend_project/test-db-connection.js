const db = require('./config/database');

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection and User table...\n');

  // Test 1: Basic connection
  console.log('1. Testing database connection...');
  db.query('SELECT 1 as test', (err, results) => {
    if (err) {
      console.error('❌ Database connection failed:', err.message);
      return;
    }
    console.log('✅ Database connection successful');

    // Test 2: Check if User table exists
    console.log('\n2. Checking User table structure...');
    db.query('DESCRIBE User', (err, results) => {
      if (err) {
        console.error('❌ User table error:', err.message);
        console.log('💡 Creating User table...');
        
        // Create User table if it doesn't exist
        const createTableQuery = `
          CREATE TABLE User (
            UserID INT AUTO_INCREMENT PRIMARY KEY,
            Username VARCHAR(50) UNIQUE NOT NULL,
            Password VARCHAR(100) NOT NULL,
            CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `;
        
        db.query(createTableQuery, (err, result) => {
          if (err) {
            console.error('❌ Failed to create User table:', err.message);
          } else {
            console.log('✅ User table created successfully');
            testRegistration();
          }
        });
      } else {
        console.log('✅ User table exists with structure:');
        results.forEach(column => {
          console.log(`   - ${column.Field}: ${column.Type}`);
        });
        testRegistration();
      }
    });
  });

  function testRegistration() {
    console.log('\n3. Testing user registration...');
    const testUsername = 'testuser_' + Date.now();
    const bcrypt = require('bcryptjs');
    
    bcrypt.hash('testpass123', 10, (err, hashedPassword) => {
      if (err) {
        console.error('❌ Password hashing failed:', err);
        return;
      }
      
      const insertQuery = 'INSERT INTO User (Username, Password) VALUES (?, ?)';
      db.query(insertQuery, [testUsername, hashedPassword], (err, result) => {
        if (err) {
          console.error('❌ Registration test failed:', err.message);
        } else {
          console.log('✅ Registration test successful');
          console.log(`   - User ID: ${result.insertId}`);
          console.log(`   - Username: ${testUsername}`);
          
          // Clean up test user
          db.query('DELETE FROM User WHERE Username = ?', [testUsername], () => {
            console.log('🧹 Test user cleaned up');
            
            // Test admin user
            console.log('\n4. Checking admin user...');
            db.query('SELECT * FROM User WHERE Username = ?', ['admin'], (err, results) => {
              if (err) {
                console.error('❌ Admin check failed:', err.message);
              } else if (results.length === 0) {
                console.log('⚠️  Admin user not found');
              } else {
                console.log('✅ Admin user exists');
              }
              
              console.log('\n🎉 Database tests completed!');
              db.end();
            });
          });
        }
      });
    });
  }
}

testDatabaseConnection();
