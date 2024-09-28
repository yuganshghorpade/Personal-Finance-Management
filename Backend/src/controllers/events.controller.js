import { Expense } from "../models/expense.model.js";
import { User } from "../models/user.model.js";
import { Event } from "../models/event.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Category } from "../models/category.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import populateByIds from "../utils/populateByIds.js";
import mongoose from "mongoose";

const createEvent = async (req, res) => {
    try {
        const user = req.user;
        const { title } = req.body;

        if (!user) {
            throw new ApiError(402, "Unauthorised Request");
        }

        if (!title) {
            throw new ApiError(401, "Title is required for creating a Event");
        }

        const event = await Event.create({
            eventTitle: title,
            date: new Date(Date.now()),
        });

        const updatedUser = await User.findByIdAndUpdate(
            user.id,
            {
                $push: {
                    event: event,
                },
            },
            {
                new: true,
            }
        );
        if (!updatedUser) {
            throw new ApiError(402, "User not found");
        }
        return res.status(201).json(
            new ApiResponse(
                201,
                {
                    updatedUser,
                },
                "Event created successfully"
            )
        );
    } catch (error) {
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
            message: "An unexpected error occured while Creating Event...",
            errors: [],
            data: null
        });  
    }
};

const fetchEvents = async (req, res) => {
    try {
        const user = req.user;
    
        if (!user) {
            throw new ApiError(403, "Unauthorised Request");
        }
    
        const loggedInUser = await User.findByIdAndUpdate(user.id);
        const eventsArr = loggedInUser.event;
    
        if (eventsArr.length == 0) {
            return res
                .status(201)
                .json(new ApiResponse(201, {}, "No Events Found"));
        }
    
        const ObjectsArr = await populateByIds(eventsArr, Event);
        ObjectsArr.sort((a, b) => b.createdAt - a.createdAt);
    
        return res
            .status(200)
            .json(
                new ApiResponse(200, { ObjectsArr }, "Events  fetched successfully")
            );
    } catch (error) {
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
            message: `An unexpected error occured while Fetching Events...${error}`,
            errors: [],
            data: null
        });  
    }
};

const deleteEvent = async (req, res) => {
    try {
        const { eventId } = req.query;
        const user = req.user;
        console.log(eventId);
    
        if (!user) {
            throw new ApiError(402, "Unauthorised Request");
        }
        if (!eventId) {
            throw new ApiError(401, "No event selected for deletion");
        }
    
        const loggedInUser = await User.findById(user.id).select(
            "-password -refreshToken"
        );
    
        if (!loggedInUser) {
            throw new ApiError(404, "User not found");
        }
    
        const newEvents = loggedInUser.event.filter((eve) => eve._id != eventId);
        loggedInUser.event = newEvents;
        await loggedInUser.save();
    
        return res
            .status(200)
            .json(new ApiResponse(200, { loggedInUser }, "Event deleted"));
    } catch (error) {
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
            message: `An unexpected error occured while Deleting Event. Error:- ${error}`,
            errors: [],
            data: null
        });  
    }
};

const updateEvent = async (req,res) =>{
    try {
        const { newEventTitle } = req.body
        const { eventId } = req.query;
        if (!newEventTitle.trim()) {
            throw new ApiError( 404 ,"New Event Title must be provided.")
        }
        if (!eventId) {
            throw new ApiError( 405, "No event selected for Updation")
        }
        const event = await Event.findById(eventId)
        if (!event) {
            throw new ApiError( 402, "Link is broken")
        }
        event.eventTitle = newEventTitle
        await event.save()

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Event Updated Successfully"
            )
        )

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
            message: `An unexpected error occured while Updating Event. Error:- ${error}`,
            errors: [],
            data: null
        });  
    }
}

const addEventExpense = async (req, res) => {
    try {
        const eventId = req.query.eventId;
        let { expenseTitle, amount, categoryId } = req.body;
        const user = req.user;
        if (!user) {
            throw new ApiError(402, "Unauthorised access");
        }

        // Check if an image is uploaded

        if (!eventId) {
            throw new ApiError(400, "Event ID is required");
        }

        if (!(expenseTitle && amount)) {
            throw new ApiError(400, "Title and Amount are required");
        }

        let expenseImageUrl = "https://res.cloudinary.com/dkl6ivu1f/image/upload/v1726639024/a82iyb7bngopfhnbw35l.jpg";
        if (req.file) {
            console.log(req.file);
            const expenseImageLocalPath = req.file.path;
            const expenseImage = await uploadOnCloudinary(expenseImageLocalPath);
            if (!expenseImage.data.url) {
                throw new ApiError(400, "Error while uploading image");
            }
            expenseImageUrl = expenseImage.data.url;
        }

        if (!categoryId) {
            const category = await Category.findOne({ name: "Uncategorized" });
            if (category) {
                categoryId = category._id;
            } else {
                throw new ApiError(404, "Category not found");
            }
        }

        const expense = await Expense.create({
            user:user.id,
            expenseTitle,
            amount,
            date: new Date(),
            category: categoryId,
            expenseImage: expenseImageUrl,
        });

        if (!expense) {
            throw new ApiError(500, "Could not create expense");
        }

        const event = await Event.findById(eventId);
        if (!event) {
            throw new ApiError(404, "Event not found");
        }
        event.eventExpenses.push(expense);
        await event.save();

        return res.status(200).json(new ApiResponse(200, { event }, "Expense added successfully"));
    } catch (error) {
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
            message: `An unexpected error occurred: ${error.message}`,
            errors: [],
            data: null
        });
    }
};



const updateEventExpense = async (req, res) => {
    try {
        const expenseId = req.query.expenseId;
        const { expenseTitle, amount, category } = req.body;

        console.log(req.file);
        console.log(expenseTitle, amount, category);

        if (!expenseId) {
            throw new ApiError(403, "Link is broken");
        }

        let expenseImageLocalPath;
        if (req.file) {
            expenseImageLocalPath = req.file.path;
        }
        let expenseImage = null;
        console.log(expenseImageLocalPath);
        if (expenseImageLocalPath) {
            expenseImage = await uploadOnCloudinary(expenseImageLocalPath);
        }
        console.log(expenseImage);
        const expense = await Expense.findById(expenseId);

        if (!expense) {
            throw new ApiError(403, "Incorrect Expense Id");
        }

        expense.expenseTitle = expenseTitle || expense.expenseTitle;
        expense.amount = amount || expense.amount;
        expense.category = category || expense.category;
        expense.expenseImage = expenseImage.data.url;

        await expense.save();

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { expense },
                    "Expense updated successfully"
                )
            );
    } catch (error) {
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
            message: `An unexpected error occured while Updating Event Expense. Error:- ${error}`,
            errors: [],
            data: null
        });  
    }
};

const fetchEventExpense = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            throw new ApiError(402, "Unauthorised access");
        }

        const loggedInUser = await User.findById(user.id).select(
            "-password -refreshToken -isVerified -verifyCode -verifyCodeExpiry"
        );
        if (!loggedInUser) {
            throw new ApiError(404, " User not found ");
        }

        const eventsArrayWithId = loggedInUser.event;

        if (!eventsArrayWithId) {
            throw new ApiError(402, "No events");
        }

        const eventsArray = await populateByIds(eventsArrayWithId, Event);

        // console.log("Events", eventsArray);

        let eventExpensesArrayWithIds = [];
        eventsArray.forEach((element) => {
            const expensesArrayWithIds = element.eventExpenses;
            eventExpensesArrayWithIds.push(expensesArrayWithIds);
        });

        const eventExpensesArrayWithoutIds = await Promise.all(
            eventExpensesArrayWithIds.map(async (element) => {
                return await populateByIds(element, Expense);
            })
        );
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { eventExpensesArrayWithoutIds },
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
            message:
                `An unexpected error occured while Fetching Event Expenses...Error:- ${error}`,
            errors: [],
            data: null,
        });
    }
};

const deleteEventExpense = async (req, res) => {
    try {
        const eventId = req.query.eventId;
        const expenseId = req.query.expenseId;

        if (!(eventId && expenseId)) {
            throw new ApiError(402, "Link is broken");
        }

        const event = await Event.findById(eventId);
        if (!event) {
            throw new ApiError(401, "Event not found");
        }

        const eventExpenses = event.eventExpenses.filter(
            (expense) => expense != expenseId
        );
        event.eventExpenses = eventExpenses;

        await event.save();

        await Expense.findByIdAndDelete(expenseId);

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Expense deleted successfully"));
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
            message:
                `An unexpected error occured while Deleting Event Expenses. Error:-${error}`,
            errors: [],
            data: null,
        });
    }
};
 

const fetchEventDetails = async ( req, res ) => {
    try {
        
        const eventId = req.query.eventId;
        if (!(eventId)) {
            throw new ApiError(402, "Link is broken");
        }

        const event = await Event.findById(eventId);
        if (!event) {
            throw new ApiError(401, "Event not found");
        }

        const eventExpenseDetails = await populateByIds(event.eventExpenses,Expense)

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    event,
                    eventExpenseDetails
                },
                "Event Details fetched successfully"
            )
        )
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
            message:
                `An unexpected error occured while Fetching Event Details. Error:-${error}`,
            errors: [],
            data: null,
        });
    }
}

export {
    createEvent,
    fetchEvents,
    deleteEvent,
    addEventExpense,
    updateEventExpense,
    fetchEventExpense,
    deleteEventExpense,
    fetchEventDetails,
    updateEvent
};
