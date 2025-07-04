#!/usr/bin/env node

/**
 * Simple startup test script to verify the server can start without errors
 * Run with: node test-startup.js
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🧪 Testing MixFade Landing Backend startup...');
console.log('📁 Working directory:', process.cwd());

// Set test environment
process.env.NODE_ENV = 'test';
process.env.PORT = '3002'; // Use different port to avoid conflicts

// Start the server process
const serverProcess = spawn('node', ['src/index.js'], {
  stdio: 'pipe',
  env: { ...process.env }
});

let startupSuccess = false;
let startupTimeout;

// Set timeout for startup test
startupTimeout = setTimeout(() => {
  if (!startupSuccess) {
    console.error('❌ Startup test failed: Server did not start within 10 seconds');
    serverProcess.kill('SIGTERM');
    process.exit(1);
  }
}, 10000);

// Monitor stdout for startup success
serverProcess.stdout.on('data', (data) => {
  const output = data.toString();
  console.log('📝 Server output:', output.trim());
  
  if (output.includes('Server startup completed successfully')) {
    startupSuccess = true;
    clearTimeout(startupTimeout);
    console.log('✅ Startup test passed! Server started successfully.');
    
    // Test health endpoint
    setTimeout(async () => {
      try {
        const response = await fetch('http://localhost:3002/health');
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Health check passed:', data);
        } else {
          console.error('❌ Health check failed:', response.status);
        }
      } catch (error) {
        console.error('❌ Health check error:', error.message);
      } finally {
        console.log('🔄 Shutting down test server...');
        serverProcess.kill('SIGTERM');
        setTimeout(() => process.exit(0), 1000);
      }
    }, 2000);
  }
});

// Monitor stderr for errors
serverProcess.stderr.on('data', (data) => {
  const error = data.toString();
  console.error('❌ Server error:', error.trim());
});

// Handle process exit
serverProcess.on('close', (code) => {
  clearTimeout(startupTimeout);
  if (code !== 0 && !startupSuccess) {
    console.error(`❌ Server process exited with code ${code}`);
    process.exit(1);
  }
});

// Handle script termination
process.on('SIGINT', () => {
  console.log('\n🔄 Terminating test...');
  serverProcess.kill('SIGTERM');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🔄 Terminating test...');
  serverProcess.kill('SIGTERM');
  process.exit(0);
});