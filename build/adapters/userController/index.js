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
        const { userId, friendId } = req.body;
        console.log('2 ids are ', userId, friendId);
        await (0, userAuth_1.handleFollowUser)(userId, friendId, dbUserRepository);
        res.json({
            status: 'success',
            message: 'Following successfull'
        });
    });
    return {
        getRestOfAllUsers,
        followUser
    };
};
exports.default = userController;
