const https = require('https');
const http = require('http');

const GATEWAY_URL = 'http://localhost:15888';

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const url = `${GATEWAY_URL}${path}`;
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function testEndpoints() {
  console.log('Testing Hummingbot Gateway endpoints...\n');
  
  const endpoints = [
    '/',
    '/health',
    '/status',
    '/api',
    '/api/v1',
    '/v1',
    '/connectors',
    '/exchanges',
    '/strategies',
    '/bots',
    '/config',
    '/settings',
    '/info',
    '/version'
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint}...`);
      const result = await makeRequest(endpoint);
      console.log(`  Status: ${result.status}`);
      console.log(`  Response:`, result.data);
      console.log('');
    } catch (error) {
      console.log(`  Error: ${error.message}`);
      console.log('');
    }
  }
}

testEndpoints(); 