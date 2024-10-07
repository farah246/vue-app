import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import {corsOptions} from './config/cors.js';
import {connect} from './config/database.js';
import {credentials} from "./middleware/credentials.js";
import {errorHandler} from "./middleware/error_handler.js";
import authRouter from './routes/api/auth.js';
import mongoose from "mongoose";
import authentication from "./middleware/authentication.js";
connect();
const app =express();

//Allow Credentails
app.use(credentials);

//cors
app.use(cors(corsOptions));

//application.x-www-form-urlencoded
app.use(express.urlencoded({extended:true}));

//application/json response
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

app.use(authentication)
//static files
//app.use('/static',express.static(path.join(__dirname,'public')));

//Default error handler
app.use(errorHandler);
const PORT = 3500;

//Routes
app.use('/api/auth',authRouter);

app.all('*',(req,res)=>{
    res.status(404).json({message:'Route not found'});
});
mongoose.connection.once('open',()=>{
    console.log('DB connected')
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    });
});
