const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testEndpoints() {
  console.log('🧪 Testing backend endpoints...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:5000/health');
    console.log('✅ Health check:', healthResponse.data);

    // Test 2: Test registration
    console.log('\n2. Testing registration endpoint...');
    const testUser = {
      username: 'testuser' + Date.now(),
      password: 'testpass123'
    };

    try {
      const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('✅ Registration successful:', registerResponse.data);

      // Test 3: Test login with the new user
      console.log('\n3. Testing login endpoint...');
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, testUser, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      console.log('✅ Login successful:', loginResponse.data);

    } catch (regError) {
      console.log('❌ Registration failed:', regError.response?.data || regError.message);
    }

    // Test 4: Test login with admin credentials
    console.log('\n4. Testing admin login...');
    try {
      const adminLogin = await axios.post(`${BASE_URL}/auth/login`, {
        username: 'admin',
        password: 'admin123'
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      console.log('✅ Admin login successful:', adminLogin.data);
    } catch (adminError) {
      console.log('❌ Admin login failed:', adminError.response?.data || adminError.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the backend server is running on port 5000');
    }
  }
}

testEndpoints();
