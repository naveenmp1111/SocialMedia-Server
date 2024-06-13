"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const postAuth_1 = require("../../application/user-cases/post/postAuth");
const postController = (userDbRepositoryImpl, userDbRepositoryInterface, authServiceImpl, authServiceInterface, postDbRepositoryImpl, postDbRepositoryInterface) => {
    const dbUserRepository = userDbRepositoryInterface(userDbRepositoryImpl());
    const authService = authServiceInterface(authServiceImpl());
    const dbPostRepository = postDbRepositoryInterface(postDbRepositoryImpl());
    const createPost = (0, express_async_handler_1.default)(async (req, res) => {
        const postData = req.body;
        // console.log('body data',req.body)
        const post = await (0, postAuth_1.handleCreatePost)(postData, dbPostRepository);
        res.json({
            status: "success",
            message: "Post created successfully",
            post
        });
    });
    const getPostsByUser = (0, express_async_handler_1.default)(async (req, res) => {
        const { userId } = req.params;
        const UserPosts = await (0, postAuth_1.handleGetPostsByUser)(userId, dbPostRepository);
        res.json({
            status: 'success',
            message: 'My posts fetched successfully',
            posts: UserPosts
        });
    });
    const updatePostById = (0, express_async_handler_1.default)(async (req, res) => {
        const { postId, description } = req.body;
        const updatedPost = await (0, postAuth_1.handleEditPostbyId)(postId, description, dbPostRepository);
        res.json({
            status: 'success',
            message: 'Post updated successfully',
            post: updatedPost
        });
    });
    const getAllPosts = (0, express_async_handler_1.default)(async (req, res) => {
        const { userId } = req.body;
        const posts = await (0, postAuth_1.handleGetAllPosts)(userId, dbPostRepository);
        res.json({
            status: 'success',
            message: 'Posts fetched successfully',
            posts
        });
    });
    const deletePost = (0, express_async_handler_1.default)(async (req, res) => {
        const { postId } = req.params;
        const post = await (0, postAuth_1.handleDeletePost)(postId, dbPostRepository);
        res.json({
            status: 'success',
            message: 'Post deleted successfully'
        });
    });
    return {
        createPost,
        getPostsByUser,
        updatePostById,
        getAllPosts,
        deletePost
    };
};
exports.default = postController;
