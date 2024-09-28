import mongoose from 'mongoose'

const splitSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    friend:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Friend'
    },
    amount:{
        type: Number,
        required: true
    },
    description:{
        type: String
    },
    isPaid:{
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

export const Split = mongoose.model('Split',splitSchema)