import { Split } from "../models/split.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import populateByIds from "../utils/populateByIds.js"

const createSplit = async (req,res)=>{
    const user = req.user
    const friendId = req.query.friendId
    const {amount,description} = req.body

    if (!user) {
        throw new ApiError(402,"Unauthorised Request")
    }
    if (!friendId) {
        throw new ApiError(403,"Link is broken")
    }
    if (!amount) {
        throw new ApiError(401,"Amount is required for creating split")
    }
    const split = await Split.create({
        user:user.id,
        friend:friendId,
        amount,
        description: description || ""
    })
    if (!split) {
        throw new ApiError(502,"Split not created")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                split
            },
            "Split created successfully"
        )
    )
}

const markSplitAsPaid = async ( req,res ) =>{
    const splitId = req.query.splitId
    if (!splitId) {
        throw new ApiError(403,"Link is broken")
    }
    const split = await Split.findById(splitId)

    if (!split) {
        throw new ApiError(403,"Split does not exist")
    }

    split.isPaid = true
    await split.save()

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Split marked as paid"
        )
    )
}

const fetchSplits = async ( req, res )=>{
    const user = req.user
    const friendId = req.query.friendId

    if (!user) {
        throw new ApiError(402,"Unauthorised Request")
    }
    if (!friendId) {
        throw new ApiError(403,"Link is broken")
    }
    const splits = await  Split.find({
        user:user.id,
        friend:friendId
    })

    const ObjectsArray = await populateByIds(splits,Split)

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {ObjectsArray},
            "Splits fetched"
        )
    )
}

export {
    createSplit,
    markSplitAsPaid,
    fetchSplits
}