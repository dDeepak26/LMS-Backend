import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../Config/cloudinaryConfig.js";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "LMS/images",
    resource_type: "image",
    allowed_format: ["jpg", "png", "jpeg", "webp"],
    transformation: [{ width: 800, height: 450, crop: "limit" }],
  },
});

export const uploadMiddleware = multer({ storage: storage }).single("imageUrl");
