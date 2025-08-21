import express from "express";
const router = express.Router();

import authMiddleware from "../Middleware/authMiddleware.js";
import { uploadImage } from "../Middleware/imageUploadMiddleware.js";

import { createCourse } from "../Controllers/courseController.js";

// create course (Instructor)
router.post("/", authMiddleware, uploadImage.single("imageUrl"), createCourse);

export default router;
