import jwt from 'jsonwebtoken'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { generateAccessAndRefreshTokens } from '../controllers/user.controller.js'

export const verifyJWT = async (req,res,next) =>{
    try {
        const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ", "");
        if (!token) {
            throw new ApiError(401,"Unauthorized access")
        }
    
        const data = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(data.id)
    
        if (!user) {
            throw new ApiError(402,"Invalid Access Token")
        }

        const currentTime = Math.floor(Date.now() / 1000);

        if (!data.exp || data.exp < currentTime) {
            await generateAccessAndRefreshTokens(user._id);
        }

        req.user = user
        next()
    }  catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({
                success: false,
                statusCode: error.statusCode,
                message: error.message,
                errors: error.errors,
                data: error.data
            });
        }
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: "An unexpected error occurred while checking user login status...",
            errors: [],
            data: null
        });
    }
}