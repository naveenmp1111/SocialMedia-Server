"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepositoryMongoDb = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const { ObjectId } = mongoose_1.default.Types;
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
            const user = await userModel_1.default.findOne({ username });
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
                    isPrivate: profileInfo.isPrivate
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
    const getRestOfAllUsers = async (userId) => {
        try {
            const data = await userModel_1.default.find({
                isBlock: false,
                role: 'client',
                _id: { $ne: userId },
            });
            return data;
        }
        catch (error) {
            throw new Error('Error in getRestOfAllUsers');
        }
    };
    const followUser = async (userId, friendUsername) => {
        try {
            if (!userId || !friendUsername) {
                throw new Error('User ID or Friends username is not provided');
            }
            // Validate ObjectId
            if (!ObjectId.isValid(userId)) {
                throw new Error('Invalid User ID or Friend ID');
            }
            const friend = await userModel_1.default.findOne({ username: friendUsername });
            const userObjectId = new ObjectId(userId);
            const followObjectId = friend?._id;
            if (friend?.isPrivate) {
                await userModel_1.default.findByIdAndUpdate(followObjectId, { $addToSet: { requests: userObjectId } });
            }
            else {
                await userModel_1.default.findByIdAndUpdate(userObjectId, { $addToSet: { following: followObjectId } });
                await userModel_1.default.findByIdAndUpdate(followObjectId, { $addToSet: { followers: userObjectId } });
            }
        }
        catch (error) {
            console.log('Error in following user', error);
            throw new Error('Error in followUser');
        }
    };
    const acceptRequest = async (userId, friendUsername) => {
        try {
            if (!userId || !friendUsername) {
                throw new Error('User ID or Friends username is not provided');
            }
            // Validate ObjectId
            if (!ObjectId.isValid(userId)) {
                throw new Error('Invalid User ID or Friend ID');
            }
            const friend = await userModel_1.default.findOne({ username: friendUsername });
            const userObjectId = new ObjectId(userId);
            const followerObjectId = friend?._id;
            await userModel_1.default.findByIdAndUpdate(userObjectId, { $addToSet: { followers: followerObjectId }, $pull: { requests: followerObjectId } });
            await userModel_1.default.findByIdAndUpdate(followerObjectId, { $addToSet: { following: userObjectId } });
        }
        catch (error) {
            console.log('error in accepting request ', error);
            throw new Error('Erron in accepting request');
        }
    };
    const unfollowUser = async (userId, friendUsername) => {
        try {
            if ((!userId || !friendUsername)) {
                throw new Error('Userid or friend Username is missing');
            }
            const friend = await userModel_1.default.findOne({ username: friendUsername });
            const userObjectId = new ObjectId(userId);
            const unfollowObject = friend?._id;
            await userModel_1.default.findByIdAndUpdate(userObjectId, { $pull: { following: unfollowObject } }, { new: true });
            await userModel_1.default.findByIdAndUpdate(unfollowObject, { $pull: { followers: userObjectId } });
        }
        catch (error) {
            console.log('Error in unfolloeing user', error);
            throw new Error('Error in unfollowUser');
        }
    };
    const removeFollower = async (userId, friendUsername) => {
        try {
            if ((!userId || !friendUsername)) {
                throw new Error('Userid or friend Username is missing');
            }
            const friend = await userModel_1.default.findOne({ username: friendUsername });
            const userObjectId = new ObjectId(userId);
            const removeObject = friend?._id;
            await userModel_1.default.findByIdAndUpdate(userObjectId, { $pull: { followers: removeObject } }, { new: true });
            await userModel_1.default.findByIdAndUpdate(removeObject, { $pull: { following: userObjectId } });
        }
        catch (error) {
        }
    };
    const getFollowers = async (username) => {
        try {
            const users = await userModel_1.default.findOne({ username }).populate({
                path: 'followers',
                select: 'name username profilePic ' // Include only name and email fields
            });
            console.log('followers data is ', users);
            return users?.followers;
        }
        catch (error) {
            console.log('Error in Fetching followers');
            throw new Error('Error in fetching followers');
        }
    };
    const getFollowing = async (username) => {
        try {
            const users = await userModel_1.default.findOne({ username }).populate({
                path: 'following',
                select: 'name username profilePic ' // Include only name and email fields
            });
            console.log('following data is ', users);
            return users?.following;
        }
        catch (error) {
            console.log('Error in Fetching following');
            throw new Error('Error in fetching following');
        }
    };
    const getRequests = async (username) => {
        try {
            const user = await userModel_1.default.findOne({ username }).populate({
                path: 'requests',
                select: 'name username profilePic -_id'
            });
            return user?.requests;
        }
        catch (error) {
            console.log(error);
            throw new Error('Error in fetching requests');
        }
    };
    const savePost = async (postId, userId) => {
        try {
            await userModel_1.default.findByIdAndUpdate(userId, { $addToSet: { savedPosts: postId } });
        }
        catch (error) {
            console.log('error in saving the post');
        }
    };
    const unsavePost = async (postId, userId) => {
        try {
            // console.log('coming to unsave part')
            const unsaveData = await userModel_1.default.findByIdAndUpdate(userId, { $pull: { savedPosts: postId } });
            // console.log('unlikeData is ',unsaveData)
        }
        catch (error) {
            console.log('error in unliking the post');
        }
    };
    // const getSavedPosts=async(userId:string)=>{
    //   try
    // }
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
        resetPassword,
        getRestOfAllUsers,
        followUser,
        unfollowUser,
        getFollowers,
        getFollowing,
        getRequests,
        acceptRequest,
        removeFollower,
        savePost,
        unsavePost
    };
};
exports.userRepositoryMongoDb = userRepositoryMongoDb;
