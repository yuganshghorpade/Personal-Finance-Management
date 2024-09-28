import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
    eventTitle:{
        type:String,
        required:true
    },
    eventExpenses:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Expense'
        }
    ],
    date:{
        type:Date
    }
},{timestamps:true})


export const Event = mongoose.model('Event',eventSchema)