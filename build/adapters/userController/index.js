"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const userAuth_1 = require("../../application/user-cases/user/userAuth");
const userController = (userDbRepositoryImpl, userDbRepositoryInterface) => {
    const dbUserRepository = userDbRepositoryInterface(userDbRepositoryImpl());
    const getRestOfAllUsers = (0, express_async_handler_1.default)(async (req, res) => {
        const { userId } = req.body;
        const users = await (0, userAuth_1.handleGetRestOfAllUsers)(userId, dbUserRepository);
        res.json({
            users
        });
    });
    const followUser = (0, express_async_handler_1.default)(async (req, res) => {
        const { userId, friendUsername } = req.body;
        console.log('userId is ', userId);
        // console.log('friendId is ',friendId)
        const userData = await (0, userAuth_1.handleFollowUser)(userId, friendUsername, dbUserRepository);
        res.json({
            status: 'success',
            message: 'Following successfull',
        });
    });
    const unfollowUser = (0, express_async_handler_1.default)(async (req, res) => {
        const { userId, friendUsername } = req.body;
        console.log('userid is ', userId, friendUsername);
        const userData = await (0, userAuth_1.handleUnfollowUser)(userId, friendUsername, dbUserRepository);
        res.json({
            status: 'success',
            message: 'Unfollowed successfully',
        });
    });
    const removeFollower = (0, express_async_handler_1.default)(async (req, res) => {
        const { userId } = req.body;
        const { followerUsername } = req.params;
        await (0, userAuth_1.handleRemoveFollower)(userId, followerUsername, dbUserRepository);
        res.json({
            status: 'success',
            message: 'Follower removed successfully'
        });
    });
    const getFollowing = (0, express_async_handler_1.default)(async (req, res) => {
        const { userId } = req.params;
        const users = await (0, userAuth_1.handleGetFollowing)(userId, dbUserRepository);
        res.json({
            status: 'success',
            message: 'Following fetched successfully',
            users: users
        });
    });
    const getFollowers = (0, express_async_handler_1.default)(async (req, res) => {
        const { userId } = req.params;
        const users = await (0, userAuth_1.handleGetFollowers)(userId, dbUserRepository);
        res.json({
            status: 'success',
            message: 'Followers fetched successfully',
            users: users
        });
    });
    const getRequests = (0, express_async_handler_1.default)(async (req, res) => {
        const { username } = req.params;
        const requestedUsers = await (0, userAuth_1.handleGetRequests)(username, dbUserRepository);
        res.json({
            status: 'success',
            message: 'user requests fetched successfully',
            users: requestedUsers
        });
    });
    const acceptRequest = (0, express_async_handler_1.default)(async (req, res) => {
        const { userId, friendUsername } = req.body;
        await (0, userAuth_1.handleAcceptRequest)(userId, friendUsername, dbUserRepository);
        res.json({
            status: 'success',
            message: 'Request accepted successfully'
        });
    });
    const savePost = (0, express_async_handler_1.default)(async (req, res) => {
        const { userId } = req.body;
        const { postId } = req.params;
        await (0, userAuth_1.handleSavePost)(userId, postId, dbUserRepository);
        res.json({
            status: 'success',
            message: 'Post saved successfully'
        });
    });
    const unsavePost = (0, express_async_handler_1.default)(async (req, res) => {
        const { userId } = req.body;
        const { postId } = req.params;
        await (0, userAuth_1.handleUnsavePost)(userId, postId, dbUserRepository);
        res.json({
            status: 'success',
            message: 'Post unsaved successfully'
        });
    });
    const getSavedPosts = (0, express_async_handler_1.default)(async (req, res) => {
        console.log('coming');
        const { userId } = req.body;
        const savedPosts = await (0, userAuth_1.handleGetSavedPosts)(userId, dbUserRepository);
        res.json({
            status: 'success',
            message: 'Saved Posts fetched successfully',
            posts: savedPosts
        });
    });
    return {
        getRestOfAllUsers,
        followUser,
        unfollowUser,
        getFollowing,
        getFollowers,
        getRequests,
        acceptRequest,
        removeFollower,
        savePost,
        unsavePost,
        getSavedPosts
    };
};
exports.default = userController;