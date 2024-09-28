import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

export const checkNewMonth = async (req, res, next) => {
    try {
        const date = new Date(Date.now());
        const todayDate = date.getDate();
        if (todayDate === 1) {
            const user = req.user
            if (!user) {
                throw new ApiError(402,"Unauthorised Access")
            }
            const loggedInUser = await User.findById(user.id).select("-password refreshToken")
            if (!loggedInUser) {
                throw new ApiError(404,"User not found")
            }
            loggedInUser.savings = loggedInUser.savings + loggedInUser.wallet
            loggedInUser.wallet = loggedInUser.salary
            loggedInUser.monthlyExpense = 0
            await loggedInUser.save()
        }
        next()
    } catch (error) {
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({
                success: false,
                statusCode: error.statusCode,
                message: error.message,
                errors: error.errors,
                data: error.data,
            });
        }
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: "An unexpected error occured while Checking Date...",
            errors: [],
            data: null,
        });
    }
};
