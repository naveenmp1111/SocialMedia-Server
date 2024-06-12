"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
//use-case import 
const userAuth_1 = require("../../application/user-cases/auth/userAuth");
const httpStatus_1 = require("../../types/httpStatus");
const authController = (authServiceImpl, authServieInterface, userDbRepositoryImpl, userDbRepositoryInterface, otpDbRepositoryImpl, otpDbRepositoryInterface, mailSenderServiceImpl, mailSenderServiceInterface) => {
    const dbUserRepository = userDbRepositoryInterface(userDbRepositoryImpl());
    const authService = authServieInterface(authServiceImpl());
    const dbOtpRepository = otpDbRepositoryInterface(otpDbRepositoryImpl());
    const mailSenderService = mailSenderServiceInterface(mailSenderServiceImpl());
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
            // console.log('isavailable',isAvailable)
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
        const { email, password } = req.body;
        const { userDetails, refreshToken, accessToken } = await (0, userAuth_1.userLogin)(email, password, dbUserRepository, authService);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        // console.log('userDetails :',userDetails,'accessToken :',accessToken)
        res.json({
            status: 'success',
            message: 'Login successfull',
            user: userDetails,
            accessToken
        });
    });
    const loginWithGoogle = (0, express_async_handler_1.default)(async (req, res) => {
        const user = req.body;
        const { userDetails, accessToken, refreshToken } = await (0, userAuth_1.userLoginUsingGoogle)(user, dbUserRepository, authService);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        console.log('userDetails :', userDetails, 'accessToken :', accessToken);
        res.json({
            status: 'success',
            message: 'user verified',
            user: userDetails,
            accessToken
        });
    });
    const sendOtpForEmailVerification = (0, express_async_handler_1.default)(async (req, res) => {
        const { email, message } = req.body;
        console.log('email is ', email);
        const response = await (0, userAuth_1.handleSendOtp)({ email, message }, dbOtpRepository, mailSenderService, dbUserRepository);
        if (response) {
            res.status(httpStatus_1.HttpStatus.OK).json({
                status: "success",
                message: "Otp send to your mail",
            });
        }
    });
    const verifyOtpForEmailVerification = (0, express_async_handler_1.default)(async (req, res) => {
        const { otp, email } = req.body;
        const verify = await (0, userAuth_1.handleOtpVerification)(email, otp, dbOtpRepository);
        if (verify) {
            res.status(httpStatus_1.HttpStatus.OK).json({
                status: 'success',
                message: 'Otp verified Successfully'
            });
        }
    });
    const refreshAccessToken = (0, express_async_handler_1.default)(async (req, res) => {
        // console.log('cookies jjj',req.cookies)
        console.log('coming to refresh acesstoken');
        const { refreshToken } = req.cookies;
        const accessToken = await (0, userAuth_1.handleRefreshAccessToken)({ refreshToken }, dbUserRepository, authService);
        res.status(httpStatus_1.HttpStatus.OK).json({
            accessToken
        });
    });
    const resetPassword = (0, express_async_handler_1.default)(async (req, res) => {
        const { email, password } = req.body;
        await (0, userAuth_1.handleResetPassword)({ email, password }, dbUserRepository, authService);
        res.status(httpStatus_1.HttpStatus.OK).json({
            status: 'success',
            message: 'Password reset successfull'
        });
    });
    return {
        registerUser,
        usernameAvailability,
        emailAvailability,
        loginUser,
        sendOtpForEmailVerification,
        verifyOtpForEmailVerification,
        loginWithGoogle,
        refreshAccessToken,
        resetPassword
    };
};
exports.default = authController;
