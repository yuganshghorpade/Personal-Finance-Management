import { Category } from "../models/category.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import populateByIds from "../utils/populateByIds.js";

const addCategory = async (req,res)=>{
    try {
        const {categoryName} = req.body
        const user = req.user
    
        if (!user) {
            throw new ApiError(400,"Unauthorized Request")
        }
        if (!categoryName) {
            throw new ApiError(403,"Category name is required")
        }
        const category = await Category.create({
            name:categoryName
        })
        const loggedInUser = await User.findByIdAndUpdate(user.id,{
            $push:{
                categoryChoices:category._id
            }
        },{
            new:true
        })
        if (!loggedInUser) {
            throw new ApiError(503,"Could not add category")
        }
    
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {loggedInUser},
                "Category created"
            )
        )
    } catch (error) {
        throw new ApiError(
            504,
            "An unexpected error occured while creating category. Error:-",
            error
        );
    }
}

// const createCategoriesdemo = async (req,res)=>{
//     const {category1 ,category2, category3, category4, category5, category6, category7, category8, category9} = req.body
//     const categories = [
//         category1, category2, category3,
//         category4, category5, category6,
//         category7, category8, category9
//     ];
//     const ids = []
//     for (let index = 0; index < categories.length; index++) {
//         const element = categories[index];
//         const data1 = await Category.findOne({
//             name:element
//         })
//         ids.push(data1._id)
//     }
//     console.log(ids);

//     return res
//     .status(200)
//     .json(
//         new ApiResponse(
//             200,
//             {},
//             "Categories crated"
//         )
//     )
// }

const deleteCategory = async (req,res)=>{
    try {
        const {categoryId} = req.body
        const user = req.user
        if (!user) {
            throw new ApiError(402,"Unauthorised Request")
        }
        if (!categoryId) {
            throw new ApiError(403,"Category not provided")
        }
        const loggedInUser = await User.findById(user.id)
        if (!loggedInUser) {
            throw new ApiError(402,"User id is incorrect")
        }
        const categories = loggedInUser.categoryChoices.filter((category)=>category._id!=categoryId)
        loggedInUser.categoryChoices = categories
        await loggedInUser.save()

        await Category.findByIdAndDelete(categoryId)

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Category deleted"
            )
        )

    } catch (error) {
        throw new ApiError(
            504,
            "An unexpected error occured while deleting category. Error:-",
            error
        );
    }
}

const fetchCategories = async (req,res)=>{

    const user = req.user
    if (!user) {
        throw new ApiError(402,"Unauthorised Request")
    }
    const loggedInUser = await User.findById(user.id);

    if (!loggedInUser) {
        throw new ApiError(403,"Incorrect User Id")
    }
    const categoriesArr = loggedInUser.categoryChoices

    const ObjectsArray = await populateByIds(categoriesArr,Category)


    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {ObjectsArray},
            "Categories fetched successfully"
        )
    )
}

export {
    addCategory,
    deleteCategory,
    fetchCategories
}