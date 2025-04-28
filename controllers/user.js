import { User } from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import sendMail from "../middlewares/sendMail.js";
import TryCatch from "../middlewares/TryCatch.js";

export const register = TryCatch(async(req, res)=>{
    const { email, name, password } = req.body;

    console.log(req.body)

    let user = await User.findOne({ email });
    console.log(user, "User found");
    if (user)
        return res.status(400).json({
    message: "User Already exists",
    });

    const hashPassword = await bcrypt.hash(password, 10);

    user = {
        name,
        email,
        password: hashPassword,
    };

    const otp = Math.floor(Math.random() * 1000000);

    const activationToken = jwt.sign(
     
        {
            user,
            otp,
        },
        process.env.Activation_Secret,
        {
            expiresIn: "5m",
        }
    );
    console.log(activationToken);

    const data = {
        name,
        otp,
    };

    await sendMail(email, "E learning", data);

    res.status(200).json({
        user,
        message: "Otp send to your mail",
        activationToken,
    });
})

export const verifyUser = TryCatch(async(req, res)=>{
    const {otp, activationToken} = req.body

    const verify = jwt.verify(activationToken, process.env.Activation_Secret)

    if(!verify) 
        return res.status(400).json({
        message:"Otp Expired",
    });

    if(verify.otp !== otp) 
        return res.status(400).json({
        message:"Wrong Otp",
    });

    await User.create({
        name: verify.user.name,
        email: verify.user.email,
        password: verify.user.password,
    })

    res.json({
        message: "User Registered",
    });

});

export const loginUser = TryCatch(async(req, res)=>{
    const {email, password} = req.body

    const user = await User.findOne({email})

    console.log("USer " ,user, req.body);
    

    if(!user) return res.status(400).json({
        message: "No User with this email",
    });

    const mathPassword = await bcrypt.compare(password, user.password);

    if(!mathPassword) 
        return res.status(400).json({
        message: "Wrong Password"
        
    });

    const token = jwt.sign({_id: user._id}, process.env.jwt_sec,{
        expiresIn: "15d",

    });

    res.json({
        message: `Welcome back ${user.name}`,
        token,
        user,
    });
});

export const myProfile = TryCatch(async(req, res)=>{
    const user = await User.findById(req.user._id)

    res.json({ user });
});