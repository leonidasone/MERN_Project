// Simple test script to verify server setup
const http = require('http');

const testEndpoints = [
  { path: '/', description: 'Root endpoint' },
  { path: '/health', description: 'Health check' },
  { path: '/api/test', description: 'API test endpoint' }
];

function testEndpoint(path, description) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          path,
          description,
          status: res.statusCode,
          success: res.statusCode === 200,
          response: data
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        path,
        description,
        status: 'ERROR',
        success: false,
        error: err.message
      });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        path,
        description,
        status: 'TIMEOUT',
        success: false,
        error: 'Request timeout'
      });
    });

    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing Car Wash Management System Backend...\n');
  
  for (const endpoint of testEndpoints) {
    const result = await testEndpoint(endpoint.path, endpoint.description);
    
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.description} (${result.path})`);
    console.log(`   Status: ${result.status}`);
    
    if (result.success) {
      try {
        const parsed = JSON.parse(result.response);
        console.log(`   Response: ${JSON.stringify(parsed, null, 2)}`);
      } catch (e) {
        console.log(`   Response: ${result.response}`);
      }
    } else {
      console.log(`   Error: ${result.error || 'Unknown error'}`);
    }
    console.log('');
  }
  
  console.log('🏁 Test completed!');
}

// Check if server is running
console.log('Checking if server is running on port 5000...');
runTests();
