import dotenv from 'dotenv';
import { testConnection } from './src/utils/cloudinary.js';

// Load environment variables
dotenv.config();

console.log('🔍 Testing Cloudinary Connection...\n');

// Check environment variables
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY || process.env.CLOUD_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.CLOUD_API_SECRET;

console.log('Environment Variables:');
console.log(`  CLOUDINARY_CLOUD_NAME: ${cloudName ? '✅ Set' : '❌ Missing'}`);
console.log(`  CLOUDINARY_API_KEY: ${apiKey ? '✅ Set' : '❌ Missing'}`);
console.log(`  CLOUDINARY_API_SECRET: ${apiSecret ? '✅ Set' : '❌ Missing'}\n`);

if (!cloudName || !apiKey || !apiSecret) {
  console.log('❌ Please set your Cloudinary environment variables:');
  console.log('   CLOUDINARY_CLOUD_NAME=your_cloud_name');
  console.log('   CLOUDINARY_API_KEY=your_api_key');
  console.log('   CLOUDINARY_API_SECRET=your_api_secret');
  console.log('\n   You can find these in your Cloudinary Dashboard:');
  console.log('   https://cloudinary.com/console');
  process.exit(1);
}

// Test the connection
try {
  const isConnected = await testConnection();
  if (isConnected) {
    console.log('🎉 Cloudinary is properly configured and connected!');
    console.log('   Your uploads will be stored in Cloudinary.');
  } else {
    console.log('❌ Cloudinary connection failed.');
    console.log('   Please check your credentials and try again.');
  }
} catch (error) {
  console.error('❌ Error testing Cloudinary:', error.message);
}
