import express from 'express'
import {isAdmin, isAuth} from "../middlewares/isAuth.js"
import { 
    addLectures, 
    createCourse,  
    deleteCourse, 
    deleteLecture, 
    getAllStats
} from '../controllers/admin.js';
import { uploadFiles } from '../middlewares/multer.js';

const router =express.Router()

// router.post("/course/new", uploadFiles, createCourse );
router.post("/course/new", createCourse );
// we have removed some data
// router.post("/course/:id" , isAuth, isAdmin , uploadFiles ,addLectures);
router.post("/course/:id",  addLectures);
router.delete("/course/:id" , deleteCourse);
router.delete("/lecture/:id" , isAuth , isAdmin , deleteLecture);
router.get('/stats' , isAuth , isAdmin , getAllStats);

export default router ;
