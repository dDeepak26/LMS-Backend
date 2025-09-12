import express from "express";
const router = express.Router();

import authMiddleware from "../Middleware/authMiddleware.js";
import courseValidator from "../utils/courseValidator.js";
import { uploadMiddleware } from "../Middleware/uploadMiddleWare.js";
import { logRequestMiddleware } from "../Middleware/logRequestMiddleware.js";
import {
  createCourse,
  createCourseQuiz,
  enrollToCourse,
  getAllCourses,
  getCourseById,
  getEnrolledCourses,
  getInstructorCourses,
  getUsersCourse,
  updateCourseData,
  updateCourseImage,
  updateCourseLecture,
  updateLectureProgress,
} from "../Controllers/courseController.js";
import cloudinary from "../Config/cloudinaryConfig.js";

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

// create course quiz (Instructor)
router.post("/create-quiz/:courseId", authMiddleware, createCourseQuiz);

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
  logRequestMiddleware,
  courseValidator,
  updateCourseData
);

// update course lecture by Id (Instructor)
router.put("/lecture/:courseId", authMiddleware, updateCourseLecture);

// enroll to course
router.post("/enroll/:courseId", authMiddleware, enrollToCourse);

// get enrolled courses
router.get("/enrolled-courses", authMiddleware, getEnrolledCourses);

router.get("/enrolled-users/:courseId", authMiddleware, getUsersCourse);

// delete uploaded video
router.post("/delete-video", authMiddleware, async (req, res) => {
  const { publicId } = req.body;
  console.log("public id in backend to delete", publicId);

  try {
    if (!publicId) {
      res.status(400).json({ errMsg: "public id required" });
    }
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ errMsg: "Error in deleting the video" });
    console.error("Error in deleting the video");
  }
});

// update the lecture progress
router.put("/lectureProgress/:courseId", authMiddleware, updateLectureProgress);

export default router;
