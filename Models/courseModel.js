import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    level :{
        type: String,
        required: true,
        trim: true,
        enum : ['Beginner', 'Intermediate', 'Advanced']
    },
    outcomes: {
        type: String,
        required: true,
        trim: true,
    },
    skillsGained :{
        type: String,
        required: true,
        trim: true
    },
    instructor : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    price : {
        type: Number,
        required: true,
        trim: true
    },
    discount : {
        type: Number,
        trim: true
    },
    imageUrl : {
        type: String,
        required: true,
        trim: true
    },
    // lectures : [{
    //     order: {
    //         type: Number,
    //         required: true,
    //         trim: true
    //     },
    //     title: {
    //         type: String,
    //         required: true,
    //         trim: true
    //     },
    //     lectureDescription: {
    //         type: String,
    //         required: true,
    //         trim: true
    //     },
    //     preview: {
    //         type: Boolean,
    //         default: false
    //     },
    //     videoUrl: {
    //         type: String,
    //         required: true,
    //         trim: true
    //     },
    // }]
}, {timestamps: true});


export const CourseModel = mongoose.model('courses', courseSchema);