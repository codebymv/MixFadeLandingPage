const https = require('https');

const BACKEND_URL = 'https://mixfade-backend-production.up.railway.app';
const FRONTEND_ORIGIN = 'https://mixfade-frontend-production.up.railway.app'; // Example Railway frontend domain

// Test CORS preflight request
function testCORSPreflight() {
  console.log('🔄 Testing CORS preflight request...');
  
  const options = {
    hostname: 'mixfade-backend-production.up.railway.app',
    port: 443,
    path: '/api/email/collect',
    method: 'OPTIONS',
    headers: {
      'Origin': FRONTEND_ORIGIN,
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'Content-Type'
    }
  };

  const req = https.request(options, (res) => {
    console.log(`✅ OPTIONS Response Status: ${res.statusCode}`);
    console.log('📋 Response Headers:', res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('📄 Response Body:', data || '(empty)');
      console.log('\n' + '='.repeat(50) + '\n');
      testActualRequest();
    });
  });

  req.on('error', (error) => {
    console.error('❌ OPTIONS Request Error:', error.message);
    console.log('\n' + '='.repeat(50) + '\n');
    testActualRequest();
  });

  req.setTimeout(10000, () => {
    console.error('❌ OPTIONS Request Timeout');
    req.destroy();
    testActualRequest();
  });

  req.end();
}

// Test actual POST request
function testActualRequest() {
  console.log('📧 Testing actual email collection request...');
  
  const postData = JSON.stringify({
    email: 'test@example.com',
    platform: 'windows',
    version: '0.9.4'
  });

  const options = {
    hostname: 'mixfade-backend-production.up.railway.app',
    port: 443,
    path: '/api/email/collect',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'Origin': FRONTEND_ORIGIN
    }
  };

  const req = https.request(options, (res) => {
    console.log(`✅ POST Response Status: ${res.statusCode}`);
    console.log('📋 Response Headers:', res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('📄 Response Body:', data);
      console.log('\n' + '='.repeat(50) + '\n');
      testHealthCheck();
    });
  });

  req.on('error', (error) => {
    console.error('❌ POST Request Error:', error.message);
    console.log('\n' + '='.repeat(50) + '\n');
    testHealthCheck();
  });

  req.setTimeout(10000, () => {
    console.error('❌ POST Request Timeout');
    req.destroy();
    testHealthCheck();
  });

  req.write(postData);
  req.end();
}

// Test health check
function testHealthCheck() {
  console.log('🏥 Testing health check...');
  
  const options = {
    hostname: 'mixfade-backend-production.up.railway.app',
    port: 443,
    path: '/health',
    method: 'GET'
  };

  const req = https.request(options, (res) => {
    console.log(`✅ Health Check Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('📄 Health Response:', data);
      console.log('\n🎉 All tests completed!');
    });
  });

  req.on('error', (error) => {
    console.error('❌ Health Check Error:', error.message);
  });

  req.setTimeout(5000, () => {
    console.error('❌ Health Check Timeout');
    req.destroy();
  });

  req.end();
}

console.log('🚀 Starting CORS and API tests...');
console.log(`🎯 Backend: ${BACKEND_URL}`);
console.log(`🌐 Frontend Origin: ${FRONTEND_ORIGIN}`);
console.log('\n' + '='.repeat(50) + '\n');

testCORSPreflight();