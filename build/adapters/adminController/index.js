"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const adminAuth_1 = require("../../application/user-cases/admin/adminAuth");
const postAuth_1 = require("../../application/user-cases/post/postAuth");
const adminController = (authServiceImpl, authServieInterface, userDbRepositoryImpl, userDbRepositoryInterface, postDbRepositoryImpl, postDbRepositoryInterface, mailSenderServiceImpl, mailSenderServiceInterface) => {
    const dbUserRepository = userDbRepositoryInterface(userDbRepositoryImpl());
    const authService = authServieInterface(authServiceImpl());
    const dbPostRepository = postDbRepositoryInterface(postDbRepositoryImpl());
    const mailSenderService = mailSenderServiceInterface(mailSenderServiceImpl());
    const getAllUsersForAdmin = (0, express_async_handler_1.default)(async (req, res) => {
        const users = await (0, adminAuth_1.handleGetAllUsersForAdmin)(dbUserRepository);
        res.json({
            users
        });
    });
    const blockUser = (0, express_async_handler_1.default)(async (req, res) => {
        const { userId } = req.params;
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
        await (0, adminAuth_1.handleBlockPost)(postId, dbPostRepository, dbUserRepository, mailSenderService);
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
    const getWeeklyData = (0, express_async_handler_1.default)(async (req, res) => {
        const weeklyData = await (0, adminAuth_1.handleGetWeeklyData)(dbPostRepository);
        res.json({
            status: 'success',
            message: 'weekly data fetched succesffully',
            weeklyData
        });
    });
    const getMonthlyData = (0, express_async_handler_1.default)(async (req, res) => {
        const monthlyData = await (0, adminAuth_1.handleGetMonthlyData)(dbPostRepository);
        res.json({
            status: 'success',
            message: 'monthly data fetched successfully',
            monthlyData
        });
    });
    const getYearlyData = (0, express_async_handler_1.default)(async (req, res) => {
        const yearlyData = await (0, adminAuth_1.handleGetYearlyData)(dbPostRepository);
        res.json({
            status: 'success',
            message: 'yearly data fetched successfully',
            yearlyData
        });
    });
    const getAllPostsForAdmin = (0, express_async_handler_1.default)(async (req, res) => {
        const posts = await (0, adminAuth_1.handleGetAllPostsForAdmin)(dbPostRepository);
        res.json({
            status: 'success',
            message: 'posts fetched successfully',
            posts
        });
    });
    return {
        getAllUsersForAdmin,
        blockUser,
        unblockUser,
        getPostReports,
        blockPost,
        unblockPost,
        getWeeklyData,
        getMonthlyData,
        getYearlyData,
        getAllPostsForAdmin
    };
};
exports.default = adminController;
