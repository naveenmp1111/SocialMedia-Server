"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepositoryMongoDb = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const userRepositoryMongoDb = () => {
    const addUser = async (user) => {
        try {
            const newUser = new userModel_1.default(user);
            return await newUser.save();
        }
        catch (error) {
            console.log(error);
            throw new Error('Error adding user to database');
        }
    };
    const getUserByEmail = async (email) => {
        try {
            // console.log(email)
            const user = await userModel_1.default.findOne({ email });
            // console.log('user',user)
            return user;
        }
        catch (error) {
            console.log(error);
            throw new Error('Error finding user by email');
        }
    };
    const getUserByUsername = async (username) => {
        try {
            // console.log(username)
            const user = await userModel_1.default.findOne({ username });
            // console.log('user',user)
            return user;
        }
        catch (error) {
            console.log(error);
            throw new Error('Error finding user by username');
        }
    };
    return {
        addUser,
        getUserByEmail,
        getUserByUsername
    };
};
exports.userRepositoryMongoDb = userRepositoryMongoDb;
