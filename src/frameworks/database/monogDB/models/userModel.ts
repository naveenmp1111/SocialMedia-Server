import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    username: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        minlength: 6
    },
    bio: {
        type: String
    },
    profilePic: {
        type: String
    },
    phoneNumber:{
        type:Number
    },
    isBlock: {
        type: Boolean,
        default: false
    },
    isGoogleSignin: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'client',
    },
    refreshToken: {
        type: String,
        default: null,
    },
    refreshTokenExpiresAt: {
        type: Date,
        default: null,
    },
    posts:[]
})

const User = model('User', userSchema);
export default User;