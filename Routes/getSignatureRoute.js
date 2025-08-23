import express from "express";
import cloudinary from "../Config/cloudinaryConfig.js";
import authMiddleware from "../Middleware/authMiddleware.js";
import toSnakeCaseOnlyLetters from "../utils/camelCaseText.js";

const router = express.Router();

router.get(
  "/get-video-signature/:courseName",
  authMiddleware,
  async (req, res) => {
    // checking if user is instructor
    if (req.user.role !== "instructor") {
      return res.status(403).json({
        errMsg: "You are not authorized only instructor can access it",
      });
    }

    // converting course name into snake case
    const courseName = toSnakeCaseOnlyLetters(req.params.courseName);

    // generate timestamp as key to send in cloudinary api_sign_request method that accepts the only new key/timestamp
    const timestamp = Math.floor(Date.now() / 1000);
    const params_to_sign = {
      timestamp,
      folder: `LMS/videos/${req.user.email}/${courseName}`,
    };
    const api_secret = process.env.CLOUDINARY_SECRET_KEY;
    //   configuring the cloudinary
    const signature = await cloudinary.utils.api_sign_request(
      params_to_sign,
      api_secret
    );
    // sending the signature
    res.json({
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      folder: `LMS/videos/${req.user.email}/${toSnakeCaseOnlyLetters(
        courseName
      )}`,
    });
  }
);

export default router;
