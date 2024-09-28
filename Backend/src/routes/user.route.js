import { Router } from "express"
import {
    verifyUser,
    loginUser,
    registerUser,
    logoutUser,
    checkUsernameUnique,
    fetchUserDetails,
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser)
router.route("/verify/:username").post(verifyUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/check-username-unique").get(checkUsernameUnique)
router.route("/fetch-user-details").get(verifyJWT,fetchUserDetails)

export default router

