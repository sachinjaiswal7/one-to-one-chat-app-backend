import jwt from "jsonwebtoken"
import CustomError from "../utils/CustomError.js";
import User from "../models/User.js"
const isAuthenticated = async (req,res,next) => {
try{
  // finding the authorization token in the headers 
  const str = req.headers.authorization;
   if(str){

    // finding token from the authrization header 
     const token = str.split(" ")[1];
     //decoding token
     const {user_id} = jwt.verify(token,process.env.JWT_SECRET_KEY);

     //finding the user from the data base 
     const user = await User.findById(user_id);


     // if user is not found then throwing an error
     if(!user){
      return next(new CustomError(400,"You are not logged in"));
     }
     else{
      req.user = user;
      next();
     }
   }
   else{
    return next(new CustomError(400,"No authrization token is found"));
   }
}catch(err){
  next(err);
}
}

export default isAuthenticated