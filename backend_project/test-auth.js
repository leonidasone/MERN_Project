const bcrypt = require('bcryptjs');
const db = require('./config/database');

async function testAuth() {
  try {
    console.log('🧪 Testing authentication system...\n');
    
    // Test 1: Check if admin user exists
    console.log('1. Checking if admin user exists...');
    const checkQuery = 'SELECT * FROM User WHERE Username = ?';
    db.query(checkQuery, ['admin'], async (err, results) => {
      if (err) {
        console.error('❌ Database error:', err);
        return;
      }
      
      if (results.length === 0) {
        console.log('❌ Admin user not found');
        
        // Create admin user
        console.log('2. Creating admin user...');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const insertQuery = 'INSERT INTO User (Username, Password) VALUES (?, ?)';
        
        db.query(insertQuery, ['admin', hashedPassword], (err, result) => {
          if (err) {
            console.error('❌ Error creating admin user:', err);
          } else {
            console.log('✅ Admin user created successfully!');
            testLogin();
          }
        });
      } else {
        console.log('✅ Admin user found');
        testLogin();
      }
    });
    
    async function testLogin() {
      console.log('\n3. Testing login with admin credentials...');
      
      const loginQuery = 'SELECT * FROM User WHERE Username = ?';
      db.query(loginQuery, ['admin'], async (err, results) => {
        if (err) {
          console.error('❌ Login query error:', err);
          db.end();
          return;
        }
        
        if (results.length === 0) {
          console.log('❌ User not found during login test');
          db.end();
          return;
        }
        
        const user = results[0];
        const isValidPassword = await bcrypt.compare('admin123', user.Password);
        
        if (isValidPassword) {
          console.log('✅ Password verification successful!');
          console.log('✅ Authentication system is working correctly!');
          console.log('\n🎉 You can now login with:');
          console.log('   Username: admin');
          console.log('   Password: admin123');
        } else {
          console.log('❌ Password verification failed');
        }
        
        db.end();
      });
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
    db.end();
  }
}

testAuth();
