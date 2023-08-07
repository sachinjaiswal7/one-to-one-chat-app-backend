import express from "express"
import isAuthenticated from "../middleware/isAuthenticated.js";
import Friends from "../models/Friends.js"
import User from "../models/User.js";
const router = express.Router();


// route to get all the chated peoples of the currently logged in user 
router.get("/all_chated_people",isAuthenticated,async (req,res,next) => {
try{
    const user_id = req.user._id;
    const friends = await Friends.find({from : user_id});
    res.status(200).json({
        success : true,
        message : "Found all the friends of the current user",
        friends
    })
}catch(err){
    next(err);
}

})

//route to get the currently logged in user information 
router.get("/get_me", isAuthenticated, (req,res,next) =>{
    res.status(200).json({
        success : true,
        message : "Found You",
        me : req.user
    })
})

// route to get one persons all chats
router.get("/get_one_people_chats/:other_person_id", isAuthenticated, async (req,res,next) => {

try{
    const otherPersonId = req.params.other_person_id;
    const currentPersonId = req.user._id;
    const findChats = await Friends.findOne({from : currentPersonId , to : otherPersonId});

    res.status(200).json({
        success : true,
        message : "found chats",
        chats : findChats
    })
}catch(err){
    next(err);
}

})


router.get("/get_peoples_with_string/:searchString", isAuthenticated, async(req,res,next) => {
try{
    const searchString = req.params.searchString;
    const data = await User.find({$or : [{name : {$regex : searchString, $options : 'i'}},{email : {$regex : searchString,$options : 'i'}}]});
    const dataWithoutMe = [];
    for(let i = 0;i < data.length;i++){
        if(data[i]._id.toString() !== req.user._id.toString())dataWithoutMe.push(data[i]);
    }
    res.status(200).json({
        success : true,
        message : "found users with given searchString",
        users : dataWithoutMe

    })
}catch(err){
    next(err);
}
})


// this route is to get one user information with the help of his id
router.get("/get_one_people_infomation/:id", isAuthenticated,async (req,res, next) => {
try{
    const id = req.params.id;
    const data = await User.findById(id);
    res.status(200).json({
        success : true,
        message : "one User data found",
        data
    })
}catch(err){
    next(err);
}
})











export default router;