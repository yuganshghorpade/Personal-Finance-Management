import { Expense } from "../models/expense.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const fetchExpenses = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            throw new ApiError(402, "Unauthorised access");
        }

        const loggedInUser = await User.findById(user.id)
        if (!loggedInUser) {
            throw new ApiError(404,"User not found")
        }
        const currentDate = new Date();

        // console.log(loggedInUser);

        // Calculate the start and end of the month using UTC
        const startOfMonth = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 1)); 
        const endOfMonth = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth() + 1, 1));
        
        const expenses = await Expense.find({
            user:loggedInUser._id,
            date: {
                // $gte: startOfMonth, // greater than or equal to the first day of the current month
                // $lt: endOfMonth // less than the first day of the next month
                $gte: startOfMonth,
                $lt: endOfMonth
            },
        });

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { expenses },
                    "Expenses fetched successfully"
                )
            );
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
            message: `An unexpected error occured while Fetching Expenses. Error:-${error}`,
            errors: [],
            data: null,
        });
    }
};

export { fetchExpenses };
