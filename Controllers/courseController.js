import { validationResult } from "express-validator";
import { CourseModel } from "../Models/courseModel.js";

// get all courses (student)

// get course by id (both)

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

export { createCourse };
