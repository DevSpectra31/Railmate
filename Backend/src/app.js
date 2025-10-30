import express from "express";
import cors from "cors";
const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}));

// express common middlewares
app.use(express.json({limit : '16kb'}))
app.use(express.urlencoded({extended : true,limit:"16kb"}))
app.use(express.static("public"))
//import the routes
import Userrouter from "./routes/user.routes.js";
import  healthcheck  from "./routes/healthcheck.routes.js";


//use routes 
app.use("/api/v1/healthcheck",healthcheck);
app.use("/api/v1/users",Userrouter);
export {app};