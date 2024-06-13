"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const profileAuth_1 = require("../../application/user-cases/profile/profileAuth");
const profileController = (userDbRepositoryImpl, userDbRepositoryInterface, authServiceImpl, authServiceInterface) => {
    const dbUserRepository = userDbRepositoryInterface(userDbRepositoryImpl());
    const authService = authServiceInterface(authServiceImpl());
    const editProfile = (0, express_async_handler_1.default)(async (req, res) => {
        const profileInfo = req.body;
        // console.log('body data',req.body)
        const user = await (0, profileAuth_1.handleEditProfile)(profileInfo, dbUserRepository);
        // console.log('edited user profile ',user)
        res.json({
            status: "success",
            message: "user info fetched",
            user,
        });
    });
    const getUserById = (0, express_async_handler_1.default)(async (req, res) => {
        const { userId } = req.params;
        const userData = await (0, profileAuth_1.handleGetUserById)(userId, dbUserRepository);
        res.json({
            status: 'success',
            message: 'userdata fetched successfully',
            user: userData
        });
    });
    return {
        editProfile,
        getUserById
    };
};
exports.default = profileController;
