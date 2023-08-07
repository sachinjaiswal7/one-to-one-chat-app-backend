import express from "express"
import dotenv from "dotenv";
import authenticationRouter from "./routes/authentication.js";
import dataRouter from "./routes/data.js";
import cors from "cors"
import connectDb from "./config/database.js";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io"
import Friend from "./models/Friends.js";
import jwt from "jsonwebtoken"
import fileUpload from "express-fileupload";
import cloudinary from "cloudinary";



// loading the environment variables 
dotenv.config({
    path: "./config/config.env"
})

//cloudinary configuration 
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

//connecting the database of mongoDB with mongoose 
connectDb();


// inializing the expess project with a variable app
const app = express();

// these are the allowed origins from which the http requests can come 
const allowedOrigins = [process.env.CLIENT_URL];



// middlewares
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : "/tmp/"
}))
app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"]
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())



// home route 
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Sachin Jaiswal",
        port: process.env.PORT
    })
})





//use all the routers of our website 
app.use("/authentication", authenticationRouter);
app.use("/data", dataRouter)

//socket code goes here 
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin:  process.env.CLIENT_URL,
        methods: ["GET", "POST", "PUT"]
    }
})



io.on("connection", (socket) => {

    // an even named as message 
    socket.on("send_message", async (data) => {
        try {
            const { token, to, message } = data;
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const from = decodedToken.user_id;
            //for sender
            let areFriends = await Friend.findOne({ from, to });
            if (!areFriends) {
                areFriends = await Friend.create({ from, to });
            }
            areFriends.message.push({ whoSentIt: from, text: message });
            await areFriends.save();


            // for receiver
            let yesWeFriends = await Friend.findOne({ from: to, to: from });
            if (!yesWeFriends) {
                yesWeFriends = await Friend.create({ from: to, to: from });
            }
            yesWeFriends.message.push({ whoSentIt: from, text: message });
            await yesWeFriends.save();
            socket.broadcast.emit(`receive_message`,{to});
        } catch (err) {
            socket.emit(`error`, "An error occured while sending the message please try again after ");
        }
    })
})







app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    // Set a default error message if not provided
    const errorMessage = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        message: errorMessage
    })
})


// http server is listening to the PORT -> 4000
server.listen(process.env.PORT, () => {
    console.log("My name is Sachin " + process.env.PORT);
})

