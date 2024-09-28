import mongoose from "mongoose"

const friendSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    contactNo:{
        type:String
    },
    transactionHistory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Expense'
        }
    ]
},{timestamps:true})

export const Friend = mongoose.model('Friend',friendSchema)