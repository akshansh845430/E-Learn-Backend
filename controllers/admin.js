

import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { promisify } from "util";
import fs from "fs";
import { User } from "../models/User.js";

const unlinkAsync = promisify(fs.unlink);

// Create a new course
export const createCourse = TryCatch(async (req, res) => {
    const { description, title, category, createdBy, duration, price, image } = req.body;

    await Courses.create({
        title,
        description,
        category,
        createdBy,
        image,
        duration,
        price
    });

    res.status(201).json({
        message: "Course created successfully"
    });
});

// Add lecture using video URL
export const addLectures = TryCatch(async (req, res) => {
    const course = await Courses.findById(req.params.id);

    if (!course) {
        return res.status(404).json({ message: "No course with this ID" });
    }

    const { title, description, video } = req.body;

    const lecture = await Lecture.create({
        title,
        description,
        video, // now video is a URL
        course: course._id,
    });

    res.status(201).json({
        message: "Lecture added",
        lecture,
    });
});

// Delete lecture (for URL, we just delete DB entry)
export const deleteLecture = TryCatch(async (req, res) => {
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) {
        return res.status(404).json({ message: "Lecture not found" });
    }

    await lecture.deleteOne();
    res.json({ message: "Lecture deleted" });
});

// Delete course and its lectures
export const deleteCourse = TryCatch(async (req, res) => {
    const course = await Courses.findById(req.params.id);

    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }

    await Lecture.deleteMany({ course: course._id });

    // Optional: delete image if it's a local file (not needed for URLs)
    // if (course.image && course.image.startsWith("uploads/")) {
    //     await unlinkAsync(course.image);
    // }

    await course.deleteOne();
    await User.updateMany({}, { $pull: { subscription: req.params.id } });

    res.json({ message: "Course deleted" });
});

// Get platform stats
export const getAllStats = TryCatch(async (req, res) => {
    const totalCourse = await Courses.countDocuments();
    const totalLectures = await Lecture.countDocuments();
    const totalUsers = await User.countDocuments();

    const stats = {
        totalCourse,
        totalLectures,
        totalUsers
    };

    res.json({ stats });
});
