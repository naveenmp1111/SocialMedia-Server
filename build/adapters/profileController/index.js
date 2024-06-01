"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const profileAuth_1 = require("../../application/user-cases/profile/profileAuth");
const profileController = (
// cloudinaryServiceImpl: CloudinaryService,
// cloudinaryServiceInterface: CloudinaryServiceInterface,
userDbRepositoryImpl, userDbRepositoryInterface, authServiceImpl, authServiceInterface) => {
    const dbUserRepository = userDbRepositoryInterface(userDbRepositoryImpl());
    //   const cloudinaryService = cloudinaryServiceInterface(cloudinaryServiceImpl());
    const authService = authServiceInterface(authServiceImpl());
    const editProfile = (0, express_async_handler_1.default)(async (req, res) => {
        const profileInfo = req.body;
        console.log('body data', req.body);
        const user = await (0, profileAuth_1.handleEditProfile)(profileInfo, dbUserRepository);
        console.log('updatdUserData', user);
        res.json({
            status: "success",
            message: "user info fetched",
            user,
        });
    });
    return {
        editProfile
    };
};
exports.default = profileController;
