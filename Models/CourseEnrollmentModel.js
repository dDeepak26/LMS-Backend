import mongoose from "mongoose";

const courseEnrollmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses",
      required: true,
    },
    lectureProgress: [
      {
        // this will CourseModel lectures.$.order
        lectureId: {
          type: Number,
          trim: true,
        },
        isCompleted: {
          type: Boolean,
          default: false,
        },
      },
    ],
    markAsComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const CourseEnrollmentModel = mongoose.model(
  "EnrollmentCourses",
  courseEnrollmentSchema
);
