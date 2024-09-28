import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { fetchExpenses } from "../controllers/expense.controller.js";

const router = Router()

router.route("/fetch-expenses").get(verifyJWT,fetchExpenses)


export default router