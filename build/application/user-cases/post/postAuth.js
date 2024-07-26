"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetTaggedPosts = exports.handleGetComments = exports.handleAddReply = exports.handleAddComment = exports.handleUnlikePost = exports.handleLikePost = exports.handleGetPostReports = exports.handleReportPost = exports.handleDeletePost = exports.handleGetAllPostsToExplore = exports.handleGetAllPosts = exports.handleEditPostbyId = exports.handleGetPostsByUser = exports.handleCreatePost = void 0;
const httpStatus_1 = require("../../../types/httpStatus");
const appError_1 = __importDefault(require("../../../utils/appError"));
const app_1 = require("../../../app");
const socketConfig_1 = require("../../../frameworks/webSocket/socketConfig");
const handleCreatePost = async (postData, postDbRepository) => {
    try {
        const createdPost = await postDbRepository.createPost(postData);
        return createdPost;
    }
    catch (error) {
        console.log('Error creating in post', error);
        throw new appError_1.default('Error creating in post', httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
exports.handleCreatePost = handleCreatePost;
const handleGetPostsByUser = async (username, postDbRepository) => {
    try {
        const UserPosts = await postDbRepository.getPostsByUser(username);
        return UserPosts;
    }
    catch (error) {
        console.log('error in fetching my posts', error);
        throw new appError_1.default('Error in fetching my posts ', httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
exports.handleGetPostsByUser = handleGetPostsByUser;
const handleEditPostbyId = async (postId, description, postDbRepository) => {
    try {
        const updatedPost = await postDbRepository.updatePostById(postId, description);
        return updatedPost;
    }
    catch (error) {
        console.log('error in  handleEditPostbyId', error);
        throw new appError_1.default('Error in handling the edit post', httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
exports.handleEditPostbyId = handleEditPostbyId;
const handleGetAllPosts = async (userId, postDbRepository) => {
    const allPosts = await postDbRepository.getAllPosts(userId);
    return allPosts;
};
exports.handleGetAllPosts = handleGetAllPosts;
const handleGetAllPostsToExplore = async (userId, postDbRepository) => {
    const allposts = await postDbRepository.getAllPostsToExplore(userId);
    return allposts;
};
exports.handleGetAllPostsToExplore = handleGetAllPostsToExplore;
const handleDeletePost = async (postId, postDbRepository) => {
    try {
        const post = await postDbRepository.deletePost(postId);
        return post;
    }
    catch (error) {
        console.log('errror in handleDeletePost ', error);
    }
};
exports.handleDeletePost = handleDeletePost;
const handleReportPost = async (postId, reason, userId, postDbRepository) => {
    try {
        await postDbRepository.reportPost(postId, reason, userId);
    }
    catch (error) {
        console.log('error in report Post', error);
    }
};
exports.handleReportPost = handleReportPost;
const handleGetPostReports = async (postDbRepository) => {
    try {
        const reports = await postDbRepository.getPostReports();
        return reports;
    }
    catch (error) {
        console.log('error in getting post reports');
    }
};
exports.handleGetPostReports = handleGetPostReports;
const handleLikePost = async (postId, userId, postDbRepository, nofificationDbRepository) => {
    try {
        const postData = await postDbRepository.likePost(postId, userId);
        if (postData && postData.userId != userId) {
            const notification = await nofificationDbRepository.createNotification(userId, postData.userId, 'like', postId);
            const recieverSocketId = (0, socketConfig_1.getReceiverSocketId)(postData.userId);
            app_1.io.to(recieverSocketId).emit('notification', (notification));
        }
    }
    catch (error) {
        console.log('error in liking the post');
    }
};
exports.handleLikePost = handleLikePost;
const handleUnlikePost = async (postId, userId, postDbRepository, nofificationDbRepository) => {
    try {
        const postData = await postDbRepository.unlikePost(postId, userId);
        if (postData && postData.userId != userId) {
            await nofificationDbRepository.deleteNotification(userId, postData.userId, 'like', postId);
        }
    }
    catch (error) {
        console.log('error in liking the post');
    }
};
exports.handleUnlikePost = handleUnlikePost;
const handleAddComment = async (userId, postId, comment, commentDbRepository, postDbRepository, nofificationDbRepository) => {
    try {
        const commentObj = {
            postId,
            commenterId: userId,
            comment
        };
        const postData = await postDbRepository.getPostById(postId);
        const commentResponse = await commentDbRepository.addComment(commentObj);
        if (commentResponse && postData && postData.userId != userId) {
            const notification = await nofificationDbRepository.createNotification(userId, postData.userId, 'comment', postId);
            const recieverSocketId = (0, socketConfig_1.getReceiverSocketId)(postData.userId);
            app_1.io.to(recieverSocketId).emit('notification', (notification));
        }
        return commentResponse;
    }
    catch (error) {
        console.log('error in adding comment ', error);
    }
};
exports.handleAddComment = handleAddComment;
const handleAddReply = async (userId, postId, parentId, comment, commentDbRepository, postDbRepository, nofificationDbRepository) => {
    try {
        const replyObj = {
            postId,
            commenterId: userId,
            comment,
            parentId
        };
        const postData = await postDbRepository.getPostById(postId);
        const commentResponse = await commentDbRepository.addReply(replyObj);
        if (postData && commentResponse) {
            const notification = await nofificationDbRepository.createNotification(userId, postData.userId, 'comment', postId);
            const recieverSocketId = (0, socketConfig_1.getReceiverSocketId)(postData.userId);
            app_1.io.to(recieverSocketId).emit('notification', (notification));
        }
        return commentResponse;
    }
    catch (error) {
        console.log('error in adding reply comment ', error);
    }
};
exports.handleAddReply = handleAddReply;
const handleGetComments = async (postId, commentDbRepository) => {
    try {
        return await commentDbRepository.getComments(postId);
    }
    catch (error) {
        console.log('error in handling get comments ', error);
    }
};
exports.handleGetComments = handleGetComments;
const handleGetTaggedPosts = async (username, postDbRepository) => {
    try {
        return await postDbRepository.getTaggedPosts(username);
    }
    catch (error) {
        console.log('error in getting taggedposts ', error);
    }
};
exports.handleGetTaggedPosts = handleGetTaggedPosts;
