import express from 'express'
import {
     getAllCourses, 
     getSingleCourse ,
      fetchLectures,
      fetchLecture,
      getMyCourses,
      // checkout,
      // paymentVerification
    } from '../controllers/course.js';
import { isAuth } from '../middlewares/isAuth.js'; 

const router =express.Router();

router.get("/course/all",getAllCourses);
router.get("/course/:id",getSingleCourse);
// isAuth is  removed from fetch lectures 
// we removed isAuth from fetch lectures
router.get("/lectures/:id", fetchLectures);
router.get("/lecture/:id",  fetchLecture);
router.get("/mycourse", isAuth , getMyCourses)
// route.post ('/course/checkout/:id' , isAuth,checkout)
// route.post("/verification/:id", isAuth ,paymentVerification)

export default router ;

