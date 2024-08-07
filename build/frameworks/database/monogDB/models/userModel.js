"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
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
            type: mongoose_1.default.Types.ObjectId,
            ref: 'User'
        }
    ],
    followers: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: 'User'
        }
    ],
    isPrivate: {
        type: Boolean,
        default: false
    },
    requests: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: 'User'
        }
    ],
    savedPosts: [],
    blocklist: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: 'User'
        }
    ]
}, {
    timestamps: true,
});
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
