// Simple test script to verify API endpoints
const API_BASE = 'http://localhost:4000';

async function testAPI() {
  console.log('🧪 Testing API endpoints...');
  
  try {
    // Test verification routes test endpoint
    const testResponse = await fetch(`${API_BASE}/api/verification/test`);
    const testData = await testResponse.json();
    console.log('✅ Test endpoint:', testData);
    
    // Test health endpoint
    const healthResponse = await fetch(`${API_BASE}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health endpoint:', healthData);
    
    // Test reports endpoint
    const reportsResponse = await fetch(`${API_BASE}/api/reports`);
    const reportsData = await reportsResponse.json();
    console.log('✅ Reports endpoint:', reportsData);
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

testAPI();
