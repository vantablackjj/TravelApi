import express from 'express';

import dotenv from 'dotenv';
import { connectDB } from './libs/db.js';
import authRoute from  "./routes/authRoute.js"
import cookieParser from 'cookie-parser';
import userRoute from './routes/userRoute.js'
import { protectRoute } from './middlewares/authMiddleware.js';

dotenv.config();

const app = express()
const PORT = process.env.PORT||3001
//middleware

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())

// public routes
app.use('/api/auth',authRoute)

//private routes

app.use('/api/users',protectRoute, userRoute)
// Connect to database  

connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`server is running at ${PORT}`)
    })
})