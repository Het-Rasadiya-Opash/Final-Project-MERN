import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

let isConfigured = false;

const configureCloudinary = () => {
  if (!isConfigured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
      api_key: process.env.CLOUDINARY_API_KEY!,
      api_secret: process.env.CLOUDINARY_API_SECRET!,
    });

    isConfigured = true;
  }
};

const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    configureCloudinary();

    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "listings",
    });

    // console.log(`File Uploaded on Cloudinary : ${response.url}`);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error: any) {
    console.error("Cloudinary upload error:", error.message);
    try {
      fs.unlinkSync(localFilePath);
    } catch (e: any) {
      console.error("Error deleting file:", e.message);
    }
    return null;
  }
};

export { uploadOnCloudinary };
