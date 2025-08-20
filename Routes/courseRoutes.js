import  express  from 'express';
const router = express.Router();
import authMiddleware from "../Middleware/authMiddleware.js";
import { createCourse } from '../Controllers/courseController.js';

// create course (Instructor) 
router.post("/", authMiddleware, createCourse);

export default router;