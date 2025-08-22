import { validationResult } from "express-validator";
import cloudinary from "../Config/cloudinaryConfig.js";
import { CourseModel } from "../Models/courseModel.js";
import streamifier from "streamifier";

// upload to cloudinary
const uploadToCloudinary = (fileBuffer, folderName, resourceType) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `LMS/${folderName}`,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

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
    if (!req.files) {
      res.status(400).json({ errMsg: "image/video url not found" });
    }

    // uploading image to cloudinary
    let cloudinaryImageUrl = null;
    if (req.files?.imageUrl && req.files.imageUrl[0]) {
      const imageFile = req.files.imageUrl[0].buffer;
      const uploadImage = await uploadToCloudinary(
        imageFile,
        "images",
        "image"
      );
      cloudinaryImageUrl = uploadImage.secure_url;
    }

    // uploading each file to cloudinary (parallel)
    let uploadResults = [];
    if (req.files?.videos && req.files.videos.length > 0) {
      uploadResults = await Promise.all(
        req.files.videos.map((file) =>
          uploadToCloudinary(file.buffer, "videos", "video")
        )
      );
    }

    // merge metadata + video urls by index
    const lectures = JSON.parse(req.body.lectures);
    const finalLectures = lectures.map((lec, i) => ({
      ...lec,
      videoUrl: uploadResults[i].secure_url || null,
    }));

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
      lectures: finalLectures,
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
