import mongoose from 'mongoose'

const expenseSchema = new mongoose.Schema({
    expenseTitle:{
        type:String,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    amount:{
        type:Number
    },
    expenseImage:{
        type:String
    },
    date:{
        type:Date
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'
    }
},{timestamps:true})

export const Expense = mongoose.model('Expense',expenseSchema)