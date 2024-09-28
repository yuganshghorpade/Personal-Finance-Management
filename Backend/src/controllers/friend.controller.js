import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Friend } from "../models/friend.model.js";
import { User } from "../models/user.model.js";
import { Expense } from "../models/expense.model.js"
import { Event } from "../models/event.model.js"
import { Category } from "../models/category.model.js"
import populateByIds from "../utils/populateByIds.js";

const createFriend = async (req, res) => {

    const {name,contactNo} = req.body
    const user = req.user
    if (!user) {
        throw new ApiError(403,"Unauthorised Request")
    }

    console.log(name);
    console.log(contactNo);
    if (!name.trim()) {
        throw new ApiError(402,"Friend name is required")
    }

    const friend = await Friend.create({
        name:name,
        contactNo: contactNo || ""
    })
    console.log(friend);
    if (!friend) {
        throw new ApiError(503,"An error occured while creating friend")
    }
    
    const updatedUser = await User.findByIdAndUpdate(user.id,{
        $push:{
            friends:friend
        }
    },{
        new:true
    })
    if (!updatedUser) {
        throw new ApiError(403,"User not found")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            {
                friend
            },
            "Friend created successfully"
        )
    )
};

const fetchFriends = async (req,res)=>{

    const user = req.user

    if (!user) {
        throw new ApiError(403,"Unauthorized Request")
    }
    const loggedInUser = await User.findById(user.id)

    if (!loggedInUser) {
        throw new ApiError(404,"User not found")
    }

    const friendsArr = loggedInUser.friends

    if (friendsArr.length == 0) {
        return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                {},
                "No Friends Found"
            )
        )
    }

    const ObjectsArray = await populateByIds(friendsArr,Friend)

    
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {ObjectsArray},
            "Friends fetched successfully"
        )
    )
}

const deleteFriend = async ( req, res )=>{
    try {
        const {friendId} = req.body
        const user = req.user
    
        if (!user) {
           throw new ApiError(402, "Unauthorised Request");
        }
        if (!friendId) {
            throw new ApiError(401, "No friend selected for deletion");
        }
    
        const loggedInUser = await User.findById(user.id).select("-password -refreshToken")
    
        if (!loggedInUser) {
            throw new ApiError(404,"User not found")
        }
    
        const newFriends = loggedInUser.friends.filter((friend)=>friend._id!=friendId)
        loggedInUser.friends = newFriends
        await loggedInUser.save()
            
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {loggedInUser},
                "Friend deleted"
                )
            )
    } catch (error) {
        throw new ApiError(400,`An unexpected error occured while deleting friend. Error:-`,error)
    }
        
}

const addFriendExpense = async (req,res)=>{
    try {
        const friendId = req.query.friendId
        
        let {expenseTitle,amount,categoryId} = req.body
        if (!friendId) {
            throw new ApiError(402,"Link is broken")
        } 
        if (!(expenseTitle && amount)) {
            throw new ApiError(403,"Title and Amount are needed for expense creation")
        }
        if (!categoryId) {
            categoryId = await Category.findOne({
                name:"Uncategorized"
            })
        }

        if (!categoryId) {
            throw new ApiError(404,"Category not found")
        }

        const expense = await Expense.create({
            expenseTitle,
            amount,
            date: new Date(Date.now()),
            category:categoryId
        })
        if (!expense) {
            throw new ApiError(504,"Could not create expense")
        }

        const friend = await Friend.findById(friendId)
        if (!friend) {
            throw new ApiError(403,"Friend not found")
        }
        friend.transactionHistory.push(expense)

        await friend.save()

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {friend},
                "Expense added successfully"
            )
        )
    } catch (error) {
        throw new ApiError(
            505,
            `An unexpected error occured while creating expense. Error:-${error}`
        );
    }
}

const fetchTransactionHistory = async ( req, res)=>{
    const friendId = req.query.friendId

    if (!friendId) {
        throw new ApiError(401,"Link is broken")
    }

    const friend = await Friend.findById(friendId)

    if (!friend) {
        throw new ApiError(404,"Friend not found")
    }
    
    const transactionHistory = friend.transactionHistory;

    const ObjectsArray = await populateByIds(transactionHistory,Expense)

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {ObjectsArray},
            "Transactions fetched successfully"
        )
    )
}

const deleteFriendExpense = async ( req,res )=>{
    try {
        const friendId = req.query.friendId
        const expenseId = req.query.expenseId
    
        if (!(friendId && expenseId)) {
            throw new ApiError(402,"Link is broken")
        }
    
        const friend = await Friend.findById(friendId)
        if (!friend) {
            throw new ApiError(401,"Friend not found")
        }
    
        
        const transactionHistory = friend.transactionHistory.filter((transaction)=> transaction!=expenseId)
        friend.transactionHistory = transactionHistory
        await friend.save()
        
        await Expense.findByIdAndDelete(expenseId)

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Expense deleted successfully"
            )
        )
        
    } catch (error) {
        throw new ApiError(504,`An unexpected error occured while deleting transaction. Error:- ${error}`)
    }
    
}

export {
    createFriend,
    fetchFriends,
    deleteFriend,
    addFriendExpense,
    fetchTransactionHistory,
    deleteFriendExpense
}