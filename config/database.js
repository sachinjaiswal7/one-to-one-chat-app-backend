import mongoose from "mongoose"

const connectDb = () => {
    mongoose.connect(process.env.DB_URI,{
        dbName : "chat-app"
    }).then(()=>{   
        console.log("Connected to the Database");
    }).catch((err) => {
        console.log("err while connecting to the db" + err);
    })
}

export default connectDb;