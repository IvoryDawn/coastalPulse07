
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Validate Cloudinary configuration
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY || process.env.CLOUD_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.CLOUD_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error("❌ Cloudinary configuration missing! Please set:");
  console.error("   CLOUDINARY_CLOUD_NAME (or CLOUD_NAME)");
  console.error("   CLOUDINARY_API_KEY (or CLOUD_API_KEY)");
  console.error("   CLOUDINARY_API_SECRET (or CLOUD_API_SECRET)");
  console.error("   Falling back to local file storage...");
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

// Test Cloudinary connection
const testConnection = async () => {
  if (!cloudName || !apiKey || !apiSecret) {
    return false;
  }
  
  try {
    await cloudinary.api.ping();
    console.log("✅ Cloudinary connection successful");
    return true;
  } catch (error) {
    console.error("❌ Cloudinary connection failed:", error.message);
    return false;
  }
};

// Test connection on startup
testConnection();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "hazard_reports", 
    allowed_formats: ["jpg", "jpeg", "png", "mp4", "mov", "webm"],
    resource_type: "auto", // auto-detects image/video
    transformation: [
      { quality: "auto" },
      { fetch_format: "auto" }
    ]
  },
});

export { cloudinary, storage, testConnection };
