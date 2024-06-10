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
    const checkUsernameForEdit = async (username, userId) => {
        try {
            const user = await userModel_1.default.findOne({ username, _id: { $ne: userId } });
            return user;
        }
        catch (error) {
            console.log(error);
            throw new Error('Error in checkUsenameForEdit');
        }
    };
    const checkEmailForEdit = async (email, userId) => {
        try {
            const user = await userModel_1.default.findOne({ email, _id: { $ne: userId } });
            return user;
        }
        catch (error) {
            console.log('error in checkemail for edit', error);
            throw new Error('error in checkemailfor edit');
        }
    };
    const addRefreshTokenAndExpiry = async (email, refreshToken) => {
        try {
            const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            const user = await userModel_1.default.findOneAndUpdate({ email }, { refreshToken, refreshTokenExpiresAt }, { new: true });
            // console.log('user is ', user)
            return user;
        }
        catch (error) {
            console.log(error);
            throw new Error("Error adding refresh token and expiry!");
        }
    };
    const editProfile = async (profileInfo) => {
        try {
            let user;
            console.log('profile link is ', profileInfo);
            if (profileInfo.profilePic) {
                user = await userModel_1.default.findByIdAndUpdate(profileInfo.userId, profileInfo, {
                    new: true,
                });
            }
            else {
                user = await userModel_1.default.findByIdAndUpdate(profileInfo.userId, {
                    name: profileInfo.name,
                    username: profileInfo.username,
                    phoneNumber: profileInfo.phoneNumber,
                    bio: profileInfo.bio,
                    email: profileInfo.email,
                }, {
                    new: true,
                });
            }
            // console.log('updated user is ',user)
            return user;
        }
        catch (error) {
            console.log(error);
            throw new Error("Error updating profile!");
        }
    };
    const getAllUsersForAdmin = async () => {
        try {
            const users = await userModel_1.default.find({ role: 'client' }, {
                _id: 1,
                username: 1,
                profilePic: 1,
                name: 1,
                email: 1,
                bio: 1,
                isBlock: 1,
                isGoogleSignedIn: 1
            });
            return users;
        }
        catch (error) {
            console.log(error);
            throw new Error('Error in finding the users for admin');
        }
    };
    const blockUser = async (userId) => {
        try {
            const userData = await userModel_1.default.findByIdAndUpdate(userId, { $set: { isBlock: true } }, { new: true });
            return userData;
        }
        catch (error) {
            console.log(error);
            throw new Error('Erron in blocking the user');
        }
    };
    const unBlockUser = async (userId) => {
        try {
            return await userModel_1.default.findByIdAndUpdate(userId, { $set: { isBlock: false } });
        }
        catch (error) {
            console.log(error);
            throw new Error('Erron in unblocking the user');
        }
    };
    const getUserById = async (userId) => {
        try {
            return await userModel_1.default.findById(userId);
        }
        catch (error) {
            console.log(error);
            throw new Error('error in get User by Id');
        }
    };
    const updatePosts = async (userId, postId) => {
        try {
            const data = await userModel_1.default.updateOne({ _id: userId }, { $push: { posts: postId } });
            console.log(data);
        }
        catch (error) {
            console.log(error);
            throw new Error("Error updating posts!");
        }
    };
    const resetPassword = async (email, password) => {
        try {
            const data = await userModel_1.default.updateOne({ email }, { password });
            return data;
        }
        catch (error) {
            console.log(error);
            throw new Error('Error in changing password');
        }
    };
    return {
        addUser,
        getUserByEmail,
        getUserByUsername,
        addRefreshTokenAndExpiry,
        editProfile,
        checkUsernameForEdit,
        checkEmailForEdit,
        getAllUsersForAdmin,
        blockUser,
        unBlockUser,
        getUserById,
        updatePosts,
        resetPassword
    };
};
exports.userRepositoryMongoDb = userRepositoryMongoDb;
