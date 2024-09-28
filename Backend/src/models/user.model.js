import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import {ApiError} from '../utils/ApiError.js'
import jwt from "jsonwebtoken"

const defaultCategoryIds = [
    new mongoose.Types.ObjectId('66b37cb949046739967d4e7e'),
    new mongoose.Types.ObjectId('66b37cb949046739967d4e80'),
    new mongoose.Types.ObjectId('66b37cba49046739967d4e82'),
    new mongoose.Types.ObjectId('66b37cba49046739967d4e84'),
    new mongoose.Types.ObjectId('66b37cba49046739967d4e86'),
    new mongoose.Types.ObjectId('66b37cba49046739967d4e88'),
    new mongoose.Types.ObjectId('66b37cba49046739967d4e8a'),
    new mongoose.Types.ObjectId('66b37cba49046739967d4e8c'),
    new mongoose.Types.ObjectId('66b37cba49046739967d4e8e')
];

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        minLength:2,
        maxLength:20,
        trim:true,
        match:/^(?=.*[a-z])[a-z0-9_]+$/

    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    },
    password:{
        type:String,
        required:true
    },
    event:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Event'
        }
    ],
    friends:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Friend'
        }
    ],
    refreshToken:{
        type:String
    },
    savings:{
        type:String,
        default:0
    },
    wallet:{
        type:String,
        default:0
    },
    monthlyExpense:{
        type:String,
        default:0
    },
    salary:{
        type:String,
        default:0
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    verifyCode:{
        type:String,
        match: /^[0-9]{6}$/
    },
    verifyCodeExpiry:{
        type:Date
    },
    categoryChoices:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Category'
        }
    ]
},
{timestamps:true})

userSchema.pre("save",async function (next) {

    if (this.isNew) {
        // If this is a new user, set default category choices
        if (!this.categoryChoices || this.categoryChoices.length === 0) {
            this.categoryChoices = defaultCategoryIds;
        }
    }


    
    if(!this.isModified("password")) return next();

    try {
        this.password = await bcrypt.hash(this.password,10)
        next()
    } catch (error) {
        throw new ApiError(505,`An unexpected error occured while hashing the password. Error:-${error}`)
    }
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        id:this._id,
        username:this.username,
        email:this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        id:this._id,
        username:this.username,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
}


export const User = mongoose.model('User',userSchema)
