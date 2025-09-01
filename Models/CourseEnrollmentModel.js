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
        videoDuration: {
          type: Number,
          trim: true,
        },
        watchedTime: {
          type: Number,
          trim: true,
        },
        lastWatchedTime: {
          type: Number,
          trim: true,
        },
        isCompleted: {
          type: Boolean,
          default: false,
        },
      },
      { _id: false },
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
