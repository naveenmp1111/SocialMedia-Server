"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
//use-case import 
const userAuth_1 = require("../../application/user-cases/auth/userAuth");
const authController = (authServiceImpl, authServieInterface, userDbRepositoryImpl, userDbRepositoryInterface) => {
    const dbUserRepository = userDbRepositoryInterface(userDbRepositoryImpl());
    const authService = authServieInterface(authServiceImpl());
    const registerUser = (0, express_async_handler_1.default)(async (req, res) => {
        // console.log('data from body',req.body)
        const user = req.body;
        await (0, userAuth_1.userRegister)(user, dbUserRepository, authService);
        res.json({
            status: 'success',
            message: 'user verified'
        });
    });
    const usernameAvailability = (0, express_async_handler_1.default)(async (req, res) => {
        try {
            const { username } = req.params;
            const isAvailable = await dbUserRepository.getUserByUsername(username);
            console.log('isavailable', isAvailable);
            if (!isAvailable) {
                res.json({
                    available: true,
                    status: 'Username is available'
                });
            }
            else {
                res.json({
                    available: false,
                    status: 'Username not available'
                });
            }
        }
        catch (error) {
            console.error('Error checking username availability: ', error);
        }
    });
    const emailAvailability = (0, express_async_handler_1.default)(async (req, res) => {
        try {
            const { email } = req.params;
            const isAvailable = await dbUserRepository.getUserByEmail(email);
            // console.log('email',isAvailable)
            if (!isAvailable) {
                res.json({
                    available: true,
                    status: 'Email is available'
                });
            }
            else {
                res.json({
                    available: false,
                    status: 'Email already exists'
                });
            }
        }
        catch (error) {
            console.error('Error checking in email availability: ', error);
        }
    });
    const loginUser = (0, express_async_handler_1.default)(async (req, res) => {
        try {
            const { email, password } = req.body;
            const userDetails = await (0, userAuth_1.userLogin)(email, password, dbUserRepository, authService);
            res.json({
                status: 'success',
                message: 'Login successfull',
                user: userDetails
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.json({
                    status: 'failed',
                    message: error.message,
                    user: null
                });
            }
            console.error('Error in the Login user', error);
        }
    });
    return {
        registerUser,
        usernameAvailability,
        emailAvailability,
        loginUser
    };
};
exports.default = authController;
