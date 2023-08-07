import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const hashPassword = async(password) => {
try{
    const hashedPassword = await bcrypt.hash(password,10);
    return hashedPassword;
}catch(err){
    return new Error();
}
}


export const createToken = (user_id,res,message) => {
   const token = jwt.sign({user_id},process.env.JWT_SECRET_KEY,{
    expiresIn : process.env.EXPIRY_TIME
   })


   res.status(200).json({
     token,
     success : true,
     message
   })
}


export const passwordMatched = async(newPassword,oldPassword) => {
    const isMatched = await bcrypt.compare(newPassword,oldPassword);
    return isMatched;
}