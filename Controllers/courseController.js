import { validationResult } from "express-validator";
import cloudinary  from "../Config/cloudinaryConfig.js";
import { CourseModel } from "../Models/courseModel.js";

// get all courses


// get course by id

// create course only by instructor
// only with image 
// further with video

const createCourse = async (req, res) => {
    try {
        // checking user is instructor
        const instructor = req.user;
        if (instructor.role !== "instructor") {
            res.status(403).json({ errMsg: "You are not authorized to create course" });
        }

        // checking req body
        const data = req.body;
        if (Object.keys(data).length === 0) {
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

        // uploading image to cloudinary
        let cloudinaryImageUrl;
        await cloudinary.uploader.upload(data.imageUrl, {
            folder: "LMS",
            resource_type: "image",
            allowed_formats: ["jpg", "png", "jpeg"],
            transformation: [{
                width: 800,
                height: 450,
                crop: "fill"
            }]
        })
        .then((res) => {
            cloudinaryImageUrl = res.secure_url;
        })
        .catch((err) => {
            res.status(500).json({ errMsg: `Cloudinary Error for Uploading Course Image: ${err.message}` });
            console.error(`Cloudinary Error for Uploading Course Image: ${err.message}`);
        });

        // creating course document
        const courseDocument = new CourseModel({
            name: data.name,
            description: data.description,
            category: data.category,
            level: data.level,
            outcomes: data.outcomes,
            skillsGained: data.skillsGained,
            instructor: instructor.id,
            price: data.price,
            discount: data.discount,
            imageUrl: cloudinaryImageUrl
        });

        //  saving course document
        const course = await courseDocument.save();

        // sending response
        res.status(201).json({ msg: "Course Created Successfully", course });

    } catch (err) {
        res.status(500).json({ errMsg: `Server Error for Create Course: ${err.message}` });
        console.error(`Server Error for Create Course: ${err.message}`);
    }
}

// update course only by instructor



export { createCourse };