import mongoose from "mongoose";


const friendSchema = new mongoose.Schema({
    from : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    to : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    message : [
            {
                whoSentIt : {
                    type : mongoose.Schema.Types.ObjectId,
                    ref : "User",
                },
                text : {
                    type : String
                }
            }
    ]
})

const Friend = mongoose.model("Friend", friendSchema);

export default Friend;