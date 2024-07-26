import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema(
    {
        name: {
            type: String,
            minlength: 3,
            required: true
        },
        username: {
            type: String,
            required: true
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
            type: String,
            default: "https://static.vecteezy.com/system/resources/thumbnails/002/387/693/small/user-profile-icon-free-vector.jpg"
        },
        phoneNumber: {
            type: Number
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
        following: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'User'
            }
        ],
        followers: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'User'
            }
        ],
        isPrivate: {
            type: Boolean,
            default: false
        },
        requests: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'User'
            }
        ],
        savedPosts: [],
        blocklist: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        timestamps: true,
    }
)

const User = model('User', userSchema);
export default User;