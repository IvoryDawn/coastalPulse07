// Test script to check reports API
const API_BASE = 'http://localhost:4000';

async function testReportsAPI() {
  console.log('🧪 Testing Reports API...');
  
  try {
    // Test 1: Check if reports table has data
    console.log('\n1. Testing database connection...');
    const healthResponse = await fetch(`${API_BASE}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test 2: Test verification routes
    console.log('\n2. Testing verification routes...');
    const verificationResponse = await fetch(`${API_BASE}/api/verification/test`);
    const verificationData = await verificationResponse.json();
    console.log('✅ Verification routes:', verificationData);
    
    // Test 3: Test reports endpoint (this will fail without auth, but we can see the error)
    console.log('\n3. Testing reports endpoint...');
    try {
      const reportsResponse = await fetch(`${API_BASE}/api/reports`);
      const reportsData = await reportsResponse.json();
      console.log('✅ Reports endpoint (no auth):', reportsData);
    } catch (error) {
      console.log('⚠️  Reports endpoint error (expected without auth):', error.message);
    }
    
    // Test 4: Test profile endpoints
    console.log('\n4. Testing profile endpoints...');
    try {
      const profileResponse = await fetch(`${API_BASE}/api/profile/me`);
      console.log('⚠️  Profile endpoint status (no auth):', profileResponse.status);
    } catch (error) {
      console.log('⚠️  Profile endpoint error (expected without auth):', error.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testReportsAPI();
