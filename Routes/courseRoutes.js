import express from "express";
const router = express.Router();

import authMiddleware from "../Middleware/authMiddleware.js";
import { uploadMiddleware } from "../Middleware/uploadMiddleWare.js";
import { logRequestMiddleware } from "../Middleware/logRequestMiddleware.js";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  getInstructorCourses,
} from "../Controllers/courseController.js";

// get all courses
router.get("/", authMiddleware, getAllCourses);

// get instructor created courses
router.get("/instructor", authMiddleware, getInstructorCourses);

// get course by id
router.get("/detail/:courseId", authMiddleware, getCourseById);

// create course (Instructor)
router.post(
  "/",
  authMiddleware,
  uploadMiddleware,
  logRequestMiddleware,
  createCourse
);

export default router;
