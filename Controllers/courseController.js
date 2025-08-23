import { validationResult } from "express-validator";
import { CourseModel } from "../Models/courseModel.js";

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
    console.log("called", instructorId);

    // checking the role
    if (req.user.role !== "instructor") {
      return res
        .status(403)
        .json({ errMsg: "only instructor can get their courses details" });
    }
    // getting courses
    const coursesData = await CourseModel.find({
      instructor: instructorId,
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
      res
        .status(403)
        .json({ errMsg: "You are not authorized to create course" });
    }

    // checking req body
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({ errMsg: "Missing Fields" });
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
      res.status(400).json({ errMsg: "image url not found" });
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

export { getAllCourses, getCourseById, getInstructorCourses, createCourse };
