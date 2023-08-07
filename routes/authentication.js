import express from "express"
import User from "../models/User.js";
import { hashPassword,createToken, passwordMatched } from "../utils/authentication.js";
import CustomError from "../utils/CustomError.js"
import isAuthenticated from "../middleware/isAuthenticated.js";
import cloudinary from "cloudinary";


const router = express.Router();

// route for registering a user 
router.post("/register",async (req,res,next) => {
    const {name, password,email} = req.body;
    let photo =null;
    if(req.files){
        photo = req.files.photo;
    }
    
try{

    const oldUser = await User.findOne({email});
    if(oldUser){
       return next(new CustomError(400,"User already exists"));
    }
    const options = {
        folder : "chat/users",
        width : 300,
        height:300,
        crop : 'thumb'
    }
    let resPhoto = null;
    if(photo){
       resPhoto = await cloudinary.v2.uploader.upload(photo.tempFilePath,options);
    }
    const hashedPassword = await hashPassword(password);
    let newUser = null;
    if(!resPhoto){
     newUser = await User.create({name,password : hashedPassword,email});
    }
    else {
        newUser = await User.create({name,password : hashedPassword, email, photoUrl : resPhoto.secure_url});
    }
    createToken(newUser._id,res,"Register successful");
  
}catch(err){
   next(err);
}
})



router.post("/login",async(req,res,next) => {

try{
    const {email , password} = req.body;
    //get the user with his/her password so that you do not face any problem.
    const oldUser = await User.findOne({email}).select("+password");
    if(!oldUser){
        return res.status(400).json({
            success : false,
            message : "User doesn't exists"
        })
    }
    // comparing the password with compare function which is written inside the utils folder of the directory
    const isMatched = await passwordMatched(password,oldUser.password);

    // checking if the password is equal to the old password 
    if(isMatched === true){
        createToken(oldUser._id,res,"Login Successful")
    }
    // if password is wrong then do the belowstuff
    else{
       return next(new CustomError(400,"Invalid password or email"));
    }
}catch(err){
  next(err);
}
    
})


router.get("/data",isAuthenticated,(req,res,next) => {
    res.status(200).json({
        success : true,
        message : "You are logged in"
    })
})







export default router;