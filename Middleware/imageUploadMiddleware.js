import cloudinary from "../Config/cloudinaryConfig.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "LMS",
    resource_type: "image",
    allowed_format: ["jpg", "png", "jpeg", "webp"],
    transformation: [{ width: 800, height: 450, crop: "limit" }],
  },
});

export const uploadImage = multer({ storage: imageStorage });
