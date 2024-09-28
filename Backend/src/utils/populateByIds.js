import { Category } from "../models/category.model.js";
import { User } from "../models/user.model.js";
import { Event } from "../models/event.model.js";
import { Friend } from "../models/friend.model.js"
import { Expense } from "../models/expense.model.js"



const populateByIds = async (arrayOfIds,Model) =>{

    
    try {
        const arrayOfObjects = await Promise.all(arrayOfIds.map((id)=>Model.findById(id)))
        return arrayOfObjects
    }
    catch (error) {
        console.error(`Error populating Arrays with objects using ids for schema ${Model}`, error);
    }



    //Method - 2
    // for (const element of arrayOfIds) {
    //     try {
    //         const data = await Schema.findById(element)
    //         arrayOfObjects.push(data)
    //     }
    //     catch (error) {
    //         console.error(`Error populating Arrays with objects using ids for schema ${schema}`, error);
    //     }
    // }
    // return arrayOfObjects




}

export default populateByIds