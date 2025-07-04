// Test script to check if production backend is accessible
const https = require('https');
const http = require('http');

const BACKEND_URL = 'https://mixfade-backend-production.up.railway.app';

function testEndpoint(url, path = '/health') {
  return new Promise((resolve, reject) => {
    const fullUrl = `${url}${path}`;
    console.log(`Testing: ${fullUrl}`);
    
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.get(fullUrl, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Response: ${data}`);
        resolve({ status: res.statusCode, data });
      });
    });
    
    req.on('error', (error) => {
      console.error(`Error: ${error.message}`);
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      console.error('Request timeout');
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

async function runTests() {
  console.log('🔍 Testing MixFade Production Backend...');
  console.log('=' .repeat(50));
  
  try {
    // Test health endpoint
    console.log('\n1. Testing health endpoint:');
    await testEndpoint(BACKEND_URL, '/health');
    
    // Test API health endpoint
    console.log('\n2. Testing API health endpoint:');
    await testEndpoint(BACKEND_URL, '/api/health');
    
    // Test root endpoint
    console.log('\n3. Testing root endpoint:');
    await testEndpoint(BACKEND_URL, '/');
    
    console.log('\n✅ All tests completed!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

runTests();