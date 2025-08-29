import { validationResult } from "express-validator";
import { CourseModel } from "../Models/courseModel.js";
import cloudinary from "../Config/cloudinaryConfig.js";
import { CourseEnrollmentModel } from "../Models/CourseEnrollmentModel.js";

// get all courses
const getAllCourses = async (req, res) => {
  try {
    // checking the role
    if (req.user.role !== "instructor" && req.user.role !== "student") {
      return res
        .status(403)
        .json({ errMsg: "only student or instructor can get courses details" });
    }

    // getting the courses
    const coursesData = await CourseModel.find().populate({
      path: "instructor",
      select: "-password",
    });

    if (coursesData.length === 0) {
      return res.status(404).json({ errMsg: "no course data found" });
    }

    // sending the response
    res.status(200).json(coursesData);
  } catch (err) {
    console.error("error in getting courses", err);
    res.status(500).json({ errMsg: "error in getting courses" });
  }
};

// get course by id (both)
const getCourseById = async (req, res) => {
  try {
    // checking the role
    if (req.user.role !== "instructor" && req.user.role !== "student") {
      return res
        .status(403)
        .json({ errMsg: "only student or instructor can get course details" });
    }

    const courseId = req.params.courseId;
    if (!courseId) {
      return res.status(400).json({ errMsg: "course id is required in path" });
    }

    // getting the courses
    const courseData = await CourseModel.findById(courseId).populate({
      path: "instructor",
      select: "-password",
    });

    if (!courseData) {
      return res.status(404).json({ errMsg: "no course data found" });
    }

    // sending the response
    res.status(200).json(courseData);
  } catch (err) {
    console.error("error in getting course", err);
    res.status(500).json({ errMsg: "error in getting course" });
  }
};

// get all courses created by instructor
const getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.user.id;

    // checking the role
    if (req.user.role !== "instructor") {
      return res
        .status(403)
        .json({ errMsg: "only instructor can get their courses details" });
    }
    // getting courses
    const coursesData = await CourseModel.find({
      instructor: instructorId,
    }).populate({
      path: "instructor",
      select: "-password",
    });

    if (coursesData.length === 0) {
      return res.status(404).json({ errMsg: "no course data found" });
    }

    return res.status(200).json(coursesData);
  } catch (err) {
    console.error("error in getting instructors course", err);
    res.status(500).json({ errMsg: "error in getting instructors course" });
  }
};

// create course only by instructor
const createCourse = async (req, res) => {
  try {
    // checking user is instructor
    const instructor = req.user;
    if (instructor.role !== "instructor") {
      return res
        .status(403)
        .json({ errMsg: "You are not authorized to create course" });
    }

    // checking req body
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ errMsg: "Missing Fields" });
    }

    // validating req body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errMsg: errors
          .array()
          .map((err) => ({ field: err.param, message: err.msg })),
      });
    }

    // checking if file is present
    if (!req.file) {
      return res.status(400).json({ errMsg: "image url not found" });
    }

    // uploading image to cloudinary
    let cloudinaryImageUrl;
    if (req.file && req.file.path) {
      cloudinaryImageUrl = req.file.path;
    }

    // creating course document
    const courseDocument = new CourseModel({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      level: req.body.level,
      outcomes: req.body.outcomes,
      skillsGained: JSON.parse(req.body.skillsGained),
      instructor: instructor.id,
      price: req.body.price,
      discount: req.body.discount,
      imageUrl: cloudinaryImageUrl,
      lectures: JSON.parse(req.body.lectures),
    });
    //  saving course document
    const course = await courseDocument.save();

    // sending response
    res.status(201).json({ msg: "Course Created Successfully", course });
  } catch (err) {
    res.status(500).json({ errMsg: `Server Error for Create Course` });
    console.error(`Server Error for Create Course: ${err}`);
  }
};

// update course only by instructor
// update course image by courseId
const updateCourseImage = async (req, res) => {
  try {
    // checking user is instructor
    const instructor = req.user;
    if (instructor.role !== "instructor") {
      res
        .status(403)
        .json({ errMsg: "You are not authorized to update course image" });
    }

    // course id
    const courseId = req.params.courseId;
    if (!courseId) {
      return res.status(400).json({ errMsg: "course id is required in path" });
    }

    // checking if previous image filename is send in body
    if (!req.body || !req.body.imageId) {
      return res
        .status(400)
        .json({ errMsg: "Previous Image Id/filename is required" });
    }

    // checking image is present
    if (!req.file) {
      return res.status(400).json({ errMsg: "image url not found" });
    }

    // deleting the previous course image
    const previousImageId = req.body.imageId;
    await cloudinary.uploader.destroy(previousImageId);

    // updating the document
    const updatedCourseData = await CourseModel.findByIdAndUpdate(
      courseId,
      {
        imageUrl: req.file.path,
      },
      { new: true }
    ).populate({
      path: "instructor",
      select: "-password",
    });

    if (!updatedCourseData) {
      return res.status(400).json({
        errMsg: "Error in updating the image url or course not found",
      });
    }

    res
      .status(200)
      .json({ msg: "Image updated successfully", updatedCourseData });
  } catch (err) {
    console.error("Error in updating the course image");
    res.status(500).json({ errMsg: "Error in updating the course image" });
  }
};
// update course data by courseId
const updateCourseData = async (req, res) => {
  try {
    // checking if user is instructor
    const instructor = req.user;
    if (instructor.role !== "instructor") {
      return res
        .status(403)
        .json({ errMsg: "You are not authorized to update course image" });
    }

    // course id
    const courseId = req.params.courseId;
    if (!courseId) {
      return res.status(400).json({ errMsg: "course id is required in path" });
    }

    // checking if request body is send
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ errMsg: "Request body is required to update the course data" });
    }

    // validating req body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errMsg: errors
          .array()
          .map((err) => ({ field: err.param, message: err.msg })),
      });
    }

    // updating the course
    const updatedCourseData = await CourseModel.findByIdAndUpdate(
      courseId,
      req.body,
      { new: true }
    ).populate({
      path: "instructor",
      select: "-password",
    });

    if (!updateCourseData) {
      return res.status(400).json({
        errMsg: "Error in updating the Course Data or course not found",
      });
    }

    // sending the res
    res.status(200).json({ msg: "Course Data Updated", updatedCourseData });
  } catch (err) {
    console.error("Error in updating the Course Data");
    res.status(500).json({ errMsg: "Error in updating the Course Data" });
  }
};

// update lecture by courseId & lecture.order (Instructor)
const updateCourseLecture = async (req, res) => {
  try {
    // checking if user is instructor
    const instructor = req.user;
    if (instructor.role !== "instructor") {
      return res
        .status(403)
        .json({ errMsg: "You are not authorized to update course image" });
    }

    // course id
    const courseId = req.params.courseId;
    if (!courseId) {
      return res.status(400).json({ errMsg: "course id is required in path" });
    }

    // checking if request body is send
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ errMsg: "Request body is required to update the course data" });
    }

    const updateData = req.body;
    console.log(req.body);

    // updating the course lecture by order
    const updatedLectureData = await CourseModel.findOneAndUpdate(
      { _id: courseId, "lectures.order": updateData.order },
      {
        $set: {
          "lectures.$.title": updateData.title,
          "lectures.$.lectureDescription": updateData.lectureDescription,
          "lectures.$.preview": updateData.preview,
          "lectures.$.videoUrl": updateData.videoUrl,
        },
      },
      { new: true }
    ).populate({
      path: "instructor",
      select: "-password",
    });
    console.log(updatedLectureData);

    if (!updatedLectureData) {
      res.status(404).json({
        errMsg: "Error in updating the course lecture no course found",
      });
    }

    res.status(200).json({ msg: "lecture updated", updatedLectureData });
  } catch (err) {
    console.error("Error in updating the Course Lecture Data");
    res
      .status(500)
      .json({ errMsg: "Error in updating the Course Lecture Data" });
  }
};

// enroll to course by course id and auth middleware by (Student)
const enrollToCourse = async (req, res) => {
  try {
    // checking if user is student
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ errMsg: "only student can enroll to course" });
    }

    // checking if course is present in param
    const courseId = req.params.courseId;
    if (!courseId) {
      res.status(400).json({ errMsg: "Course Id is required in param" });
    }

    // creating new document
    const enrollmentCourseDoc = new CourseEnrollmentModel({
      user: req.user.id,
      course: courseId,
    });

    // saving
    const enrollmentCourseData = await enrollmentCourseDoc.save();

    // sending the response
    res.status(201).json(enrollmentCourseData);
  } catch (err) {
    console.error("Error in enrolling to course");
    res.status(500).json("Error in enrolling to course");
  }
};

// get enrolled courses data (student)
// by user id
const getEnrolledCourses = async (req, res) => {
  try {
    // checking if user is student
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ errMsg: "only student can enroll to course" });
    }

    // getting the enrolled courses
    const enrolledCourses = await CourseEnrollmentModel.find({
      user: req.user.id,
    }).populate({
      path: "course",
      populate: { path: "instructor", select: "-password" },
    });

    if (enrolledCourses.length === 0) {
      res.status(404).json({ errMsg: "No Course Found" });
    }

    // sending res
    res.status(200).json(enrolledCourses);
  } catch (err) {
    console.error("Error in getting the enrolled courses data");
    res
      .status(500)
      .json({ errMsg: "Error in getting the enrolled courses data" });
  }
};

// get all enrolled user for a specific course by courseId (instructor)
const getUsersCourse = async (req, res) => {
  try {
    // checking if user is student
    if (req.user.role !== "instructor") {
      return res.status(403).json({
        errMsg: "only instructor can get user enrolled data of course",
      });
    }

    // course id form params
    const courseId = req.params.courseId;
    if (!courseId) {
      return res.status(400).json({ errMsg: "course id is required in path" });
    }

    // getting the user data from the enrolledCourseModel
    const enrolledUsers = await CourseEnrollmentModel.find({
      course: courseId,
    }).populate({
      path: "user",
      select: "-password",
    });

    if (!enrolledUsers || enrolledUsers.length === 0) {
      res.status(404).json({ errMsg: "Error in getting th enrolledUsers" });
    }

    // sending res
    res.status(200).json(enrolledUsers);
  } catch (err) {
    console.error("Error in getting the user enrolled data for the course");
    res.status(500).json({
      errMsg: "Error in getting the user enrolled data for the course",
    });
  }
};

// update the lecture progress by getting the data on some events like page refresh, page/tab/browser close
// by courseId (params), lecture order, video duration, watched time
const updateLectureProgress = async (req, res) => {
  try {
    // checking if user is instructor
    const student = req.user;
    if (student.role !== "student") {
      return res.status(403).json({
        errMsg: "You are not authorized to update course lecture progress",
      });
    }

    // course id
    const courseId = req.params.courseId;
    if (!courseId) {
      return res.status(400).json({ errMsg: "course id is required in path" });
    }

    // checking req body
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ errMsg: "Missing Fields" });
    }

    // destructuring the req body
    const { lectureId, lectureDuration, timeWatched, isCompleted } = req.body;
    console.log(lectureId, typeof lectureDuration, timeWatched, isCompleted);

    // Finding the  enrollment document
    const enrollment = await CourseEnrollmentModel.findOne({
      user: student.id,
      course: courseId,
    });
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    // checking if lecture is in lectureProgress
    const lectureIndex = enrollment.lectureProgress.some((item) => {
      console.log(item.lectureId, lectureId);

      return item.lectureId == lectureId;
    });
    console.log(lectureIndex);

    if (!lectureIndex) {
      // Adding new lecture progress if not present
      enrollment.lectureProgress.push({
        lectureId: Number(lectureId),
        lectureDuration: Number(lectureDuration),
        timeWatched: Number(timeWatched),
        isCompleted: isCompleted ?? false,
      });
    } else {
      // Updating existing lecture progress
      const lecture = enrollment.lectureProgress.filter(
        (l) => l.lectureId == lectureId
      );
      console.log(lecture);

      lecture[0].lectureDuration = Number(lectureDuration);
      lecture[0].timeWatched = Number(timeWatched);
      lecture[0].isCompleted = isCompleted ?? false;
    }

    const allCompleted = enrollment.lectureProgress.every(
      (lecture) => lecture.isCompleted
    );
    enrollment.courseCompleted = allCompleted;

    await enrollment.save();

    res.status(200).json(enrollment.lectureProgress);
  } catch (err) {
    res.status(500).json({ errMsg: "Error in updating the lecture progress" });
    console.error("Error in updating the lecture progress", err);
  }
};

export {
  getAllCourses,
  getCourseById,
  getInstructorCourses,
  createCourse,
  updateCourseImage,
  updateCourseData,
  updateCourseLecture,
  enrollToCourse,
  getEnrolledCourses,
  getUsersCourse,
  updateLectureProgress,
};
