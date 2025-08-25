const fetch = require('node-fetch');

const GATEWAY_URL = 'http://localhost:15888';

async function testGateway() {
  console.log('Testing Hummingbot Gateway...\n');

  try {
    // Test basic health check
    console.log('1. Testing health check...');
    const health = await fetch(`${GATEWAY_URL}/`);
    const healthData = await health.json();
    console.log('Health:', healthData);

    // Test available endpoints
    console.log('\n2. Testing available exchanges...');
    try {
      const exchanges = await fetch(`${GATEWAY_URL}/exchanges`);
      const exchangesData = await exchanges.json();
      console.log('Exchanges:', exchangesData);
    } catch (error) {
      console.log('Exchanges endpoint error:', error.message);
    }

    // Test strategies
    console.log('\n3. Testing strategies...');
    try {
      const strategies = await fetch(`${GATEWAY_URL}/strategies`);
      const strategiesData = await strategies.json();
      console.log('Strategies:', strategiesData);
    } catch (error) {
      console.log('Strategies endpoint error:', error.message);
    }

    // Test bots
    console.log('\n4. Testing bots...');
    try {
      const bots = await fetch(`${GATEWAY_URL}/bots`);
      const botsData = await bots.json();
      console.log('Bots:', botsData);
    } catch (error) {
      console.log('Bots endpoint error:', error.message);
    }

    // Test system status
    console.log('\n5. Testing system status...');
    try {
      const status = await fetch(`${GATEWAY_URL}/system`);
      const statusData = await status.json();
      console.log('System:', statusData);
    } catch (error) {
      console.log('System endpoint error:', error.message);
    }

  } catch (error) {
    console.error('Gateway test failed:', error);
  }
}

testGateway(); 