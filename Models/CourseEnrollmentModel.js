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
        // this field contain will CourseModel lectures.$.order
        lectureId: {
          type: Number,
          trim: true,
        },
        lectureDuration: {
          type: Number,
          trim: true,
        },
        timeWatched: {
          type: Number,
          trim: true,
        },
        isCompleted: {
          type: Boolean,
          default: false,
        },
      },
    ],
    // add total lectures count so that we can manage the course complete
    courseCompleted: {
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
