# Cloudinary Setup Guide

## Quick Setup

1. **Get your Cloudinary credentials:**
   - Go to [Cloudinary Dashboard](https://cloudinary.com/console)
   - Copy your Cloud Name, API Key, and API Secret

2. **Create a `.env` file in the backend directory:**
   ```bash
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name_here
   CLOUDINARY_API_KEY=your_api_key_here
   CLOUDINARY_API_SECRET=your_api_secret_here
   
   # Other environment variables...
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name
   JWT_SECRET=your_jwt_secret_here
   PORT=4000
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
   ```

3. **Test the connection:**
   ```bash
   cd backend
   node test-cloudinary.js
   ```

## What's Fixed

✅ **ES Module Compatibility**: Converted from CommonJS to ES modules
✅ **Consolidated Configuration**: Single Cloudinary setup instead of duplicates
✅ **Environment Variable Flexibility**: Supports both `CLOUDINARY_*` and `CLOUD_*` prefixes
✅ **Connection Testing**: Automatic connection validation on startup
✅ **Fallback Storage**: Local file storage when Cloudinary is not configured
✅ **Better Error Handling**: Clear error messages for missing configuration
✅ **File Type Support**: Images and videos (jpg, png, mp4, mov, webm)
✅ **File Size Limits**: 10MB upload limit with proper validation

## Troubleshooting

### "Cloudinary configuration missing" error
- Make sure your `.env` file exists in the backend directory
- Check that all three Cloudinary environment variables are set
- Verify the variable names match exactly (case-sensitive)

### "Cloudinary connection failed" error
- Double-check your credentials in the Cloudinary dashboard
- Ensure your Cloudinary account is active
- Try regenerating your API secret if needed

### Uploads not working
- Check the server console for error messages
- Verify file size is under 10MB
- Ensure file type is supported (images/videos only)
- Check that the uploads directory exists (for fallback storage)

## File Storage Behavior

- **With Cloudinary**: Files are uploaded to Cloudinary and URLs are stored in database
- **Without Cloudinary**: Files are stored locally in the `uploads/` directory
- **Mixed Mode**: The system automatically detects and uses the appropriate storage method
