"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const adminAuth_1 = require("../../application/user-cases/admin/adminAuth");
const postAuth_1 = require("../../application/user-cases/post/postAuth");
const adminController = (authServiceImpl, authServieInterface, userDbRepositoryImpl, userDbRepositoryInterface, postDbRepositoryImpl, postDbRepositoryInterface) => {
    const dbUserRepository = userDbRepositoryInterface(userDbRepositoryImpl());
    const authService = authServieInterface(authServiceImpl());
    const dbPostRepository = postDbRepositoryInterface(postDbRepositoryImpl());
    const getAllUsersForAdmin = (0, express_async_handler_1.default)(async (req, res) => {
        const users = await (0, adminAuth_1.handleGetAllUsersForAdmin)(dbUserRepository);
        res.json({
            users
        });
        console.log(users);
    });
    const blockUser = (0, express_async_handler_1.default)(async (req, res) => {
        const { userId } = req.params;
        console.log('userdddddd ', userId);
        await (0, adminAuth_1.handleBlockUser)(userId, dbUserRepository);
        res.json({
            status: 'success',
            message: 'User blocked successfully'
        });
    });
    const unblockUser = (0, express_async_handler_1.default)(async (req, res) => {
        const { userId } = req.params;
        await (0, adminAuth_1.handleUnblockUser)(userId, dbUserRepository);
        res.json({
            status: 'success',
            message: 'User unblocked successfully'
        });
    });
    const blockPost = (0, express_async_handler_1.default)(async (req, res) => {
        const { postId } = req.params;
        console.log('userdddddd ', postId);
        await (0, adminAuth_1.handleBlockPost)(postId, dbPostRepository);
        res.json({
            status: 'success',
            message: 'Post blocked successfully'
        });
    });
    const unblockPost = (0, express_async_handler_1.default)(async (req, res) => {
        const { postId } = req.params;
        await (0, adminAuth_1.handleUnblockPost)(postId, dbPostRepository);
        res.json({
            status: 'success',
            message: 'Post unblocked successfully'
        });
    });
    const getPostReports = (0, express_async_handler_1.default)(async (req, res) => {
        const reports = await (0, postAuth_1.handleGetPostReports)(dbPostRepository);
        res.json({
            status: 'success',
            message: 'Reports fetched successfully',
            reports
        });
    });
    return {
        getAllUsersForAdmin,
        blockUser,
        unblockUser,
        getPostReports,
        blockPost,
        unblockPost
    };
};
exports.default = adminController;
