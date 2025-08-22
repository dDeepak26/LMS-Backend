import express from "express";
const router = express.Router();

import authMiddleware from "../Middleware/authMiddleware.js";
import { uploadMiddleware } from "../Middleware/uploadMiddleWare.js";
import { logRequestMiddleware } from "../Middleware/logRequestMiddleware.js";
import { createCourse } from "../Controllers/courseController.js";

// create course (Instructor)
router.post(
  "/",
  authMiddleware,
  uploadMiddleware,
  logRequestMiddleware,
  createCourse
);

export default router;
