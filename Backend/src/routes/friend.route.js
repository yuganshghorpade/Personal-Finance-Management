import { Router } from "express";
import {
    addFriendExpense,
    createFriend,
    deleteFriend,
    deleteFriendExpense,
    fetchFriends,
    fetchTransactionHistory
} from '../controllers/friend.controller.js'

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()


router.route("/create-friend").post(verifyJWT,createFriend)
router.route("/fetch-friends").get(verifyJWT,fetchFriends)
router.route("/delete-friend").get(verifyJWT,deleteFriend)
router.route("/add-friend-expense").post(verifyJWT,addFriendExpense)
router.route("/fetch-transactions").get(verifyJWT,fetchTransactionHistory)
router.route("/delete-friend-expense").delete(verifyJWT,deleteFriendExpense)


export default router