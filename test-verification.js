// Test script for verification API
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_BASE = process.env.VITE_API_BASE || 'http://localhost:4000';
const client = axios.create({
  baseURL: API_BASE + '/api',
  headers: { 'Content-Type': 'application/json' }
});

async function testVerificationAPI() {
  console.log('🧪 Testing Verification API...');
  
  try {
    // Test 1: Check if verification routes are accessible
    console.log('\n1. Testing verification test endpoint...');
    const testResponse = await client.get('/verification/test');
    console.log('✅ Verification test:', testResponse.data);
    
    // Test 2: Test analyst pending reports (requires analyst token)
    console.log('\n2. Testing analyst pending reports...');
    const token = process.env.TEST_ANALYST_TOKEN; // Set this in your .env for testing
    
    if (!token) {
      console.warn('⚠️  Skipping authenticated tests: TEST_ANALYST_TOKEN not set in .env');
      console.log('To test with authentication:');
      console.log('1. Login as an analyst in the frontend');
      console.log('2. Copy the token from localStorage');
      console.log('3. Set TEST_ANALYST_TOKEN=your_token_here in .env');
      return;
    }
    
    client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Test analyst pending reports
    try {
      const pendingResponse = await client.get('/verification/analyst/pending');
      console.log('✅ Analyst pending reports:', pendingResponse.data);
      
      // If there are reports, test verification
      if (pendingResponse.data.length > 0) {
        const reportId = pendingResponse.data[0].id;
        console.log(`\n3. Testing verification of report ${reportId}...`);
        
        try {
          const verifyResponse = await client.post(`/verification/analyst/verify/${reportId}`, {
            verified: true,
            notes: 'Test verification from script'
          });
          console.log('✅ Verification successful:', verifyResponse.data);
        } catch (verifyError) {
          console.error('❌ Verification failed:', verifyError.response?.data || verifyError.message);
        }
      } else {
        console.log('ℹ️  No pending reports to verify');
      }
      
    } catch (error) {
      console.error('❌ Error testing analyst endpoints:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    }
  }
}

testVerificationAPI();
