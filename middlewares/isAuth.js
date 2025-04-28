import jwt from 'jsonwebtoken'
import { User } from '../models/User.js';

export const isAuth = async(req, res, next)=>{
    try {
        const token = req.headers.token;
        // modified
        // console.log(token)


        if(!token)
           return res.status(403).json({
                message: "Please Login",
            });
    const decodedData = jwt.verify(token, process.env.jwt_sec);

    req.user = await User.findById(decodedData._id)

    next()

    } catch (error) {
        res.status(500).json({
            message: "Login First",
        });
    }
};

export const isAdmin = (req,res,next)=>{
    try {
        // to change here from user to admin
        if(req.user.role !== 'admin') 
            return res.status(403).json({
            message: "You are not an admin",
        });

        next();
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}