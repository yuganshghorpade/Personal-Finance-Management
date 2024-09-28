import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {
    createSplit,
    fetchSplits,
    markSplitAsPaid
} from "../controllers/split.controller.js";


const router = Router()

router.route("/create-split").post(verifyJWT,createSplit)
router.route("/mark-split-paid").patch(verifyJWT,markSplitAsPaid)
router.route("/fetch-splits").get(verifyJWT,fetchSplits)

export default router