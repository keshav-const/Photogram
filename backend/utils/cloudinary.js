const cloudinary = require("cloudinary").v2;
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});

// Convert Buffer to Base64
const uploadToCloudinary = async (fileBuffer) => {
    try {
        console.log("Uploading Image to Cloudinary...");

        const base64Image = `data:image/jpeg;base64,${fileBuffer.toString("base64")}`; // Convert Buffer to Base64
        
        const result = await cloudinary.uploader.upload(base64Image, {
            folder: "posts",
            resource_type: "image",
        });

        console.log("Cloudinary Upload Success:", result);
        return result.secure_url; // Return only the image URL
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw new Error("Failed to upload image to Cloudinary");
    }
};

module.exports = { cloudinary, uploadToCloudinary };
