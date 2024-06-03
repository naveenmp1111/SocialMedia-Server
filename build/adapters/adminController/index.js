"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const adminAuth_1 = require("../../application/user-cases/admin/adminAuth");
const adminController = (authServiceImpl, authServieInterface, userDbRepositoryImpl, userDbRepositoryInterface) => {
    const dbUserRepository = userDbRepositoryInterface(userDbRepositoryImpl());
    const authService = authServieInterface(authServiceImpl());
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
    return {
        getAllUsersForAdmin,
        blockUser,
        unblockUser
    };
};
exports.default = adminController;
