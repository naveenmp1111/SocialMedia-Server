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
            const user = await userModel_1.default.findOne({ email });
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
            // Update user profile based on the presence of profilePic
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
            if (!user) {
                throw new Error('User not found');
            }
            // If profile is set to public, move users from request to followers and clear request field
            if (profileInfo.isPrivate === false && user.requests.length > 0) {
                // Get the list of users to update their following list
                const requestedUserIds = user.requests.map(id => id);
                // Update the current user's followers and clear requests
                user = await userModel_1.default.findByIdAndUpdate(profileInfo.userId, {
                    $addToSet: { followers: { $each: user.requests } }, // Add users in request to followers
                    $set: { requests: [] } // Clear the request field
                }, { new: true });
                // Add the current user's ID to the following list of the requested users
                await userModel_1.default.updateMany({ _id: { $in: requestedUserIds } }, { $addToSet: { following: new ObjectId(profileInfo.userId) } });
            }
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
    const cancelRequest = async (userId, friendsUsername) => {
        try {
            await userModel_1.default.findOneAndUpdate({ username: friendsUsername }, { $pull: { requests: userId } });
        }
        catch (error) {
            console.log('Error in cancelling the request', error);
        }
    };
    const declineRequest = async (userId, friendUsername) => {
        try {
            const friend = await userModel_1.default.findOne({ username: friendUsername });
            await userModel_1.default.findByIdAndUpdate(userId, { $pull: { requests: friend?._id } });
        }
        catch (error) {
            console.log('error in declining the reqeust', error);
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
            const unsaveData = await userModel_1.default.findByIdAndUpdate(userId, { $pull: { savedPosts: postId } });
        }
        catch (error) {
            console.log('error in unliking the post');
        }
    };
    const blockUserByUsername = async (userId, username) => {
        try {
            const blockingUser = await userModel_1.default.findOne({ username });
            await userModel_1.default.findByIdAndUpdate(userId, { $addToSet: { blocklist: blockingUser?._id } });
        }
        catch (error) {
            console.log('error in blocking user by username');
        }
    };
    const unblockUserByUsername = async (userId, username) => {
        try {
            const blockingUser = await userModel_1.default.findOne({ username });
            console.log('unblocking user id is ', blockingUser?._id);
            await userModel_1.default.findByIdAndUpdate(userId, { $pull: { blocklist: blockingUser?._id } });
        }
        catch (error) {
            console.log('error in blocking user by username');
        }
    };
    // const getSavedPosts=async(userId:string)=>{
    //   try {
    //     const savedPosts = await User.aggregate([
    //       {
    //           $match: { _id: new ObjectId(userId) }
    //       },
    //       {
    //           $project: {
    //               savedPosts: {
    //                   $map: {
    //                       input: "$savedPosts",
    //                       as: "postId",
    //                       in: { $toObjectId: "$$postId" }
    //                   }
    //               }
    //           }
    //       },
    //       {
    //           $lookup: {
    //               from: 'posts', // The collection name in the database
    //               localField: 'savedPosts',
    //               foreignField: '_id',
    //               as: 'savedPostsDetails'
    //           }
    //       },
    //       {
    //         $project: {
    //           savedPostsDetails: {
    //               $filter: {
    //                   input: "$savedPostsDetails",
    //                   as: "post",
    //                   cond: { $eq: ["$$post.isBlock", false] }
    //               }
    //           },
    //           _id: 0 // Optional: Exclude the userId from the result if not needed
    //       }
    //       }
    //   ]);
    //     return savedPosts.length > 0 ? savedPosts[0].savedPostsDetails : [];
    //   } catch (error) {
    //     console.log('error in fetching saved posts')
    //   }
    // }
    // const getSavedPosts = async (userId:string) => {
    //   try {
    //     const savedPosts = await User.aggregate([
    //       {
    //         $match: { _id: new ObjectId(userId) }
    //       },
    //       {
    //         $project: {
    //           savedPosts: {
    //             $map: {
    //               input: "$savedPosts",
    //               as: "postId",
    //               in: { $toObjectId: "$$postId" }
    //             }
    //           },
    //           blocklist: 1 // Include the blocklist in the projection
    //         }
    //       },
    //       {
    //         $lookup: {
    //           from: 'posts', // The collection name in the database
    //           localField: 'savedPosts',
    //           foreignField: '_id',
    //           as: 'savedPostsDetails'
    //         }
    //       },
    //       {
    //         $project: {
    //           savedPostsDetails: {
    //             $filter: {
    //               input: "$savedPostsDetails",
    //               as: "post",
    //               cond: {
    //                 $and: [
    //                   { $eq: ["$$post.isBlock", false] },
    //                   { $not: { $in: ["$$post.userId", "$blocklist"] } } // Exclude posts by users in the blocklist
    //                 ]
    //               }
    //             }
    //           },
    //           _id: 0 // Optional: Exclude the userId from the result if not needed
    //         }
    //       }
    //     ]);
    //    console.log('saved posts is ',savedPosts)
    //     return savedPosts.length > 0 ? savedPosts[0].savedPostsDetails : [];
    //   } catch (error) {
    //     console.log('error in fetching saved posts', error);
    //   }
    // };
    const getSavedPosts = async (userId) => {
        try {
            const savedPosts = await userModel_1.default.aggregate([
                {
                    $match: { _id: new ObjectId(userId) }
                },
                {
                    $project: {
                        savedPosts: {
                            $map: {
                                input: "$savedPosts",
                                as: "postId",
                                in: { $toObjectId: "$$postId" }
                            }
                        },
                        blocklist: 1 // Include the blocklist in the projection
                    }
                },
                {
                    $lookup: {
                        from: 'posts', // The collection name in the database
                        localField: 'savedPosts',
                        foreignField: '_id',
                        as: 'savedPostsDetails'
                    }
                },
                {
                    $project: {
                        savedPostsDetails: {
                            $filter: {
                                input: "$savedPostsDetails",
                                as: "post",
                                cond: {
                                    $and: [
                                        { $eq: ["$$post.isBlock", false] },
                                        { $not: { $in: ["$$post.userId", "$blocklist"] } } // Exclude posts by users in the blocklist
                                    ]
                                }
                            }
                        },
                        _id: 0 // Optional: Exclude the userId from the result if not needed
                    }
                },
                {
                    $unwind: "$savedPostsDetails" // Unwind the saved posts array
                },
                {
                    $lookup: {
                        from: 'users', // The collection name for users
                        localField: 'savedPostsDetails.userId',
                        foreignField: '_id',
                        as: 'userDetails'
                    }
                },
                {
                    $unwind: "$userDetails" // Unwind the user details array
                },
                {
                    $addFields: {
                        'savedPostsDetails.user': {
                            name: "$userDetails.name",
                            username: "$userDetails.username",
                            profilePic: "$userDetails.profilePic",
                            email: "$userDetails.email"
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        savedPostsDetails: { $push: "$savedPostsDetails" }
                    }
                },
                {
                    $project: {
                        _id: 0, // Exclude the _id field from the result
                        savedPostsDetails: 1
                    }
                }
            ]);
            console.log('saved posts is', savedPosts);
            return savedPosts.length > 0 ? savedPosts[0].savedPostsDetails : [];
        }
        catch (error) {
            console.log('error in fetching saved posts', error);
        }
    };
    const getBlockedUsers = async (userId) => {
        try {
            // First, find the user by userId to get their blocklist
            const user = await userModel_1.default.findById(userId).select('blocklist');
            if (!user) {
                throw new Error('User not found');
            }
            const blocklist = user.blocklist;
            // Check if blocklist is empty
            if (blocklist.length === 0) {
                return []; // Return an empty array if there are no blocked users
            }
            // Now, perform the aggregation to get the details of blocked users
            const blockedUsers = await userModel_1.default.aggregate([
                {
                    $match: { _id: { $in: blocklist } } // Match users whose _id is in the blocklist
                },
                {
                    $project: {
                        _id: 0, // Exclude the _id field
                        name: 1,
                        username: 1,
                        profilePic: 1
                    }
                }
            ]);
            console.log('Blocked Users:', blockedUsers);
            return blockedUsers;
        }
        catch (error) {
            console.log('error in getting blocked users ', error);
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
        unsavePost,
        getSavedPosts,
        cancelRequest,
        declineRequest,
        blockUserByUsername,
        unblockUserByUsername,
        getBlockedUsers
    };
};
exports.userRepositoryMongoDb = userRepositoryMongoDb;
