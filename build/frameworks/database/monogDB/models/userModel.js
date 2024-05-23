"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    username: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        minlength: 6
    },
    dp: {
        type: String
    },
    bio: {
        type: String
    },
    gender: {
        type: String
    },
    isBlock: {
        type: Boolean,
        default: false
    }
});
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
