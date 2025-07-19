import express from 'express';
import 'dotenv/config' 
import cookieParser from 'cookie-parser';
import cors from 'cors'
//import { dbConnect } from './database/dbConnection.js';
import authRouter from './routes/authRoutes.js';
//import userRouter from './routes/userRouter.js';
import connectDB  from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';


const app = express();


app.use(cors({
//    origin:[process.env.FRONTEND_URL],
  //  methods:["GET","POST","PUT","DELETE"],
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));

app.get("/", (req,res)=>{
    res.send("API Working");
})
//auth-routers
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

//user-router
//app.use("/api/user", userRouter);

const port = process.env.PORT || 4000;
connectDB();


app.listen(port , ()=>{
console.log(`Server Listening on http://localhost:${port}`);
});