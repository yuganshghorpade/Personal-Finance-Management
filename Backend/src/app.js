import express from "express";
import cookieparser from 'cookie-parser'
import cors from 'cors'

const app = express();
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieparser())


import userRouter from './routes/user.route.js'
import eventRouter from './routes/event.route.js'
import friendRouter from './routes/friend.route.js'
import categoryRouter from './routes/category.route.js'
import splitRouter from './routes/split.route.js'

app.use("/api/v1/user",userRouter)
app.use("/api/v1/event",eventRouter)
app.use("/api/v1/friend",friendRouter)
app.use("/api/v1/category",categoryRouter)
app.use("/api/v1/split",splitRouter)

export {app}