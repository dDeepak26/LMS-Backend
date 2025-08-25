import express from "express";
const router = express.Router();

import authMiddleware from "../Middleware/authMiddleware.js";
import courseValidator from "../utils/courseValidator.js";
import { uploadMiddleware } from "../Middleware/uploadMiddleWare.js";
import { logRequestMiddleware } from "../Middleware/logRequestMiddleware.js";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  getInstructorCourses,
  updateCourseData,
  updateCourseImage,
  updateCourseLecture,
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
  // courseValidator,
  logRequestMiddleware,
  createCourse
);

// update course image by Id and previous imageId (Instructor)
router.put(
  "/image/:courseId",
  authMiddleware,
  uploadMiddleware,
  logRequestMiddleware,
  updateCourseImage
);

// update course data (except lectures) by Id (Instructor)
router.put(
  "/data/:courseId",
  authMiddleware,
  courseValidator,
  updateCourseData
);

// update course lecture by Id (Instructor)
router.put("/lecture/:courseId", authMiddleware, updateCourseLecture);

export default router;
