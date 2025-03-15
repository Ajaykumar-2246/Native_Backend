import dotenv from "dotenv";
import multer from "multer"; // Import multer
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Multer storage using Cloudinary
export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "posts",
    format: "png",
    public_id: (req, file) => `post-${Date.now()}`,
  },
});

// Initialize Multer with the Cloudinary storage
export const upload = multer({ storage });
