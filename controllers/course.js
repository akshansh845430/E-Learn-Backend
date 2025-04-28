


import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { User } from "../models/User.js";

// Fetch all courses
export const getAllCourses = TryCatch(async (req, res) => {
  const courses = await Courses.find();
  res.json({ courses });
});

// Fetch a single course
export const getSingleCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }
  res.json({ course });
});

// Fetch lectures for a course
export const fetchLectures = TryCatch(async (req, res) => {
  
  const lectures = await Lecture.find({ course: req.params.id });
  console.log("Fetching lectures for course", req.params.id, lectures);

  if (!lectures || lectures.length === 0) {
    return res.status(404).json({ message: "No lectures found for this course" });
  }



  res.json({ lectures });
});

// Fetch a single lecture
export const fetchLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);
  console.log("Fetching lecture", req.params.id, lecture);
  if (!lecture) {
    return res.status(404).json({ message: "Lecture not found" });
  }

 

  res.json({ lecture });
});

// Fetch courses that the user has subscribed to
export const getMyCourses = TryCatch(async (req, res) => {
  // we changed from req.user.subscription to req.user._id
  const courses = await Courses.find({ _id: req.user._id });
  
  if (!courses || courses.length === 0) {
    return res.status(404).json({ message: "You have not subscribed to any courses" });
  }

  res.json({ courses });
});
