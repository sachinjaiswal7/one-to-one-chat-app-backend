import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type:String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
        select : false
    },
    photoUrl : {
        type : String,
        default : "https://www.pngkit.com/png/detail/69-692017_rock-rock-pixel-art-png.png"
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
})


const User = mongoose.model("User", userSchema);

export default User;