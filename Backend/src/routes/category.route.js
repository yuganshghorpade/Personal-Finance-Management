import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    addCategory,
    deleteCategory,
    fetchCategories
} from "../controllers/category.controller.js";

const router = Router()

router.route("/add-category").post(verifyJWT,addCategory)
router.route("/delete-category").post(verifyJWT,deleteCategory)
router.route("/fetch-categories").get(verifyJWT,fetchCategories)
// router.route("/create-categories-demo").post(createCategoriesdemo)

export default router