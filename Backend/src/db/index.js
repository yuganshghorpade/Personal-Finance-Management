import mongoose from "mongoose"
import {ApiError} from "../utils/ApiError.js"

const dbConnect = async () =>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
    } catch (error) {
        throw new ApiError(505,`An unexpected error occured while connecting to Database. Error:-${error}`)
    }
}

export default dbConnect