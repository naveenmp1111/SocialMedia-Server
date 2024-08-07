"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetBlockedUsers = exports.handleUnblockUserByUsername = exports.handleBlockUserByUsername = exports.handleDeclineRequest = exports.handleCancelRequest = exports.handleGetSavedPosts = exports.handleUnsavePost = exports.handleSavePost = exports.handleAcceptRequest = exports.handleGetRequests = exports.handleGetFollowers = exports.handleGetFollowing = exports.handleRemoveFollower = exports.handleUnfollowUser = exports.handleFollowUser = exports.handleGetSuggestedUsers = exports.handleGetRestOfAllUsers = void 0;
const appError_1 = __importDefault(require("../../../utils/appError"));
const httpStatus_1 = require("../../../types/httpStatus");
const app_1 = require("../../../app");
const socketConfig_1 = require("../../../frameworks/webSocket/socketConfig");
const handleGetRestOfAllUsers = async (userId, dbUserRepository) => {
    const users = await dbUserRepository.getRestOfAllUsers(userId);
    return users;
};
exports.handleGetRestOfAllUsers = handleGetRestOfAllUsers;
const handleGetSuggestedUsers = async (userId, dbUserRepository) => {
    const users = await dbUserRepository.getSuggestedUsers(userId);
    return users;
};
exports.handleGetSuggestedUsers = handleGetSuggestedUsers;
const handleFollowUser = async (userId, friendusername, dbUserRepository, dbNotificationRepository) => {
    try {
        const response = await dbUserRepository.followUser(userId, friendusername);
        if (response.status && response.friend && response.friend._id) {
            const notification = await dbNotificationRepository.createNotification(userId, response.friend._id, 'follow');
            const recieverSocketId = (0, socketConfig_1.getReceiverSocketId)(response.friend._id);
            app_1.io.to(recieverSocketId).emit('notification', (notification));
        }
    }
    catch (error) {
        console.log(error);
        throw new appError_1.default('no user found', httpStatus_1.HttpStatus.UNAUTHORIZED);
    }
};
exports.handleFollowUser = handleFollowUser;
const handleUnfollowUser = async (userId, friendusername, dbUserRepository, dbNotificationRepository) => {
    const friend = await dbUserRepository.unfollowUser(userId, friendusername);
    await dbNotificationRepository.deleteNotification(userId, friend?._id, 'follow');
    return friend;
};
exports.handleUnfollowUser = handleUnfollowUser;
const handleRemoveFollower = async (userId, friendUsername, dbUserRepository, dbNotificationRepository) => {
    const friend = await dbUserRepository.removeFollower(userId, friendUsername);
    await dbNotificationRepository.deleteNotification(userId, friend?._id, 'follow');
};
exports.handleRemoveFollower = handleRemoveFollower;
const handleGetFollowing = async (friendusername, dbUserRepository) => {
    const users = await dbUserRepository.getFollowing(friendusername);
    return users;
};
exports.handleGetFollowing = handleGetFollowing;
const handleGetFollowers = async (friendusername, dbUserRepository) => {
    const users = await dbUserRepository.getFollowers(friendusername);
    return users;
};
exports.handleGetFollowers = handleGetFollowers;
const handleGetRequests = async (username, dbUserRepository) => {
    const requestedUsers = await dbUserRepository.getRequests(username);
    return requestedUsers;
};
exports.handleGetRequests = handleGetRequests;
const handleAcceptRequest = async (userId, friendUsername, dbUserRepository, dbNotificationRepository) => {
    const friend = await dbUserRepository.acceptRequest(userId, friendUsername);
    const notification = await dbNotificationRepository.createNotification(friend?._id, userId, 'follow');
    const recieverSocketId = (0, socketConfig_1.getReceiverSocketId)(userId);
    app_1.io.to(recieverSocketId).emit('notification', (notification));
};
exports.handleAcceptRequest = handleAcceptRequest;
const handleSavePost = async (userId, postId, dbUserRepository) => {
    await dbUserRepository.savePost(userId, postId);
};
exports.handleSavePost = handleSavePost;
const handleUnsavePost = async (userId, postId, dbUserRepository) => {
    await dbUserRepository.unsavePost(userId, postId);
};
exports.handleUnsavePost = handleUnsavePost;
const handleGetSavedPosts = async (userId, dbUserRepository) => {
    return await dbUserRepository.getSavedPosts(userId);
};
exports.handleGetSavedPosts = handleGetSavedPosts;
const handleCancelRequest = async (userId, friendUsername, dbUserRepository) => {
    return await dbUserRepository.cancelRequest(userId, friendUsername);
};
exports.handleCancelRequest = handleCancelRequest;
const handleDeclineRequest = async (userId, friendsUsername, dbUserRepository) => {
    return await dbUserRepository.declineRequest(userId, friendsUsername);
};
exports.handleDeclineRequest = handleDeclineRequest;
const handleBlockUserByUsername = async (userId, username, dbUserRepository) => {
    const response = await dbUserRepository.blockUserByUsername(userId, username);
    await dbUserRepository.removeFollower(userId, username);
    await dbUserRepository.unfollowUser(userId, username);
    return response;
};
exports.handleBlockUserByUsername = handleBlockUserByUsername;
const handleUnblockUserByUsername = async (userId, username, dbUserRepository) => {
    try {
        return await dbUserRepository.unblockUserByUsername(userId, username);
    }
    catch (error) {
        console.log(error);
        throw new appError_1.default('error in blockUser', httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
exports.handleUnblockUserByUsername = handleUnblockUserByUsername;
const handleGetBlockedUsers = async (userId, dbUserRepository) => {
    return await dbUserRepository.getBlockedUsers(userId);
};
exports.handleGetBlockedUsers = handleGetBlockedUsers;
