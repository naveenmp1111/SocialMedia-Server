"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDeletePost = exports.handleGetAllPosts = exports.handleEditPostbyId = exports.handleGetPostsByUser = exports.handleCreatePost = void 0;
const httpStatus_1 = require("../../../types/httpStatus");
const appError_1 = __importDefault(require("../../../utils/appError"));
const handleCreatePost = async (postData, postDbRepository) => {
    try {
        const createdPost = await postDbRepository.createPost(postData);
        // console.log('checking created post id ',createdPost?._id)
        // if(createdPost){
        //     // console.log('post created successfully')
        //     const updatedUserdata=await userDbRepository.updatePost(
        //         postData.userId as string,
        //         createdPost._id as string
        //       );
        //     //   console.log('updated user ',updatedUserdata)
        // }
        return createdPost;
    }
    catch (error) {
        console.log('Error creating in post', error);
        throw new appError_1.default('Error creating in post', httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
exports.handleCreatePost = handleCreatePost;
const handleGetPostsByUser = async (userId, postDbRepository) => {
    try {
        const UserPosts = await postDbRepository.getPostsByUser(userId);
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
    // try {
    // throw new AppError('error created', HttpStatus.UNAUTHORIZED)
    const allPosts = await postDbRepository.getAllPosts(userId);
    return allPosts;
    // } catch (error) {
    //     console.log('errror in getting all posts',error)
    // }
};
exports.handleGetAllPosts = handleGetAllPosts;
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
