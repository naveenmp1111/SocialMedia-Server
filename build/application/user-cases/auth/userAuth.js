"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleResetPassword = exports.handleRefreshAccessToken = exports.userLoginUsingGoogle = exports.handleOtpVerification = exports.handleSendOtp = exports.userLogin = exports.userRegister = void 0;
const appError_1 = __importDefault(require("../../../utils/appError"));
const httpStatus_1 = require("../../../types/httpStatus");
const otp_generator_1 = __importDefault(require("otp-generator"));
const userRegister = async (user, dbUserRepository, authService) => {
    const isExistingEmail = await dbUserRepository.getUserByEmail(user.email);
    if (isExistingEmail) {
        throw new appError_1.default('Email already taken', httpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    const isExistingUsername = await dbUserRepository.getUserByEmail(user.username);
    if (isExistingUsername) {
        throw new appError_1.default('Username already taken', httpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    user.password = await authService.encryptPassword(user.password);
    await dbUserRepository.addUser(user);
};
exports.userRegister = userRegister;
const userLogin = async (email, password, dbUserRepository, authService) => {
    const user = await dbUserRepository.getUserByEmail(email);
    if (!user) {
        throw new appError_1.default('Invalid email', httpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    if (user.isBlock) {
        throw new appError_1.default('Your account has been blocked', httpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    const isPasswordCorrect = await authService.comparePassword(password, user?.password || '');
    if (!isPasswordCorrect) {
        throw new appError_1.default('Incorrect Password', httpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    const userDetails = {
        _id: user?._id.toString(),
        name: user?.name,
        username: user?.username,
        email: user?.email,
        bio: user?.bio,
        profilePic: user?.profilePic,
        phoneNumber: user?.phoneNumber,
        isBlock: user.isBlock,
        role: user.role,
        isPrivate: user.isPrivate
    };
    const refreshToken = await authService.generateRefreshToken(user._id.toString(), user.role);
    const accessToken = await authService.generateAccessToken(user._id.toString(), user.role);
    await dbUserRepository.addRefreshTokenAndExpiry(user.email, refreshToken);
    return { userDetails, refreshToken, accessToken };
};
exports.userLogin = userLogin;
const handleSendOtp = async (data, dbOtpRepository, mailSenderService, dbUserRepository) => {
    const otpString = otp_generator_1.default.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
    });
    const otp = parseInt(otpString);
    console.log('Otp is ', otp);
    if (data.message == 'passwordRecovery') {
        const isExistingEmail = await dbUserRepository.getUserByEmail(data.email);
        if (!isExistingEmail) {
            throw new appError_1.default('No user found', httpStatus_1.HttpStatus.UNAUTHORIZED);
        }
    }
    await dbOtpRepository.saveNewOtp({ email: data.email, otp });
    const response = await mailSenderService.sendVerificationMail(data.email, otp);
    return response;
};
exports.handleSendOtp = handleSendOtp;
const handleOtpVerification = async (email, otp, dbOtpRepository) => {
    const otpObj = await dbOtpRepository.getLatestOtp(email);
    if (!otpObj) {
        throw new appError_1.default("Invalid otp!", httpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    const currentTime = new Date().getTime();
    const otpCreationTime = new Date(otpObj.createdAt).getTime();
    if ((currentTime - otpCreationTime) > 60000) {
        throw new appError_1.default('Otp time out', httpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    if (otpObj.otp != otp) {
        throw new appError_1.default("Invalid otp!", httpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    if (otpObj.otp == otp)
        return true;
};
exports.handleOtpVerification = handleOtpVerification;
const userLoginUsingGoogle = async (user, dbUserRepository, authService) => {
    const isExistingEmail = await dbUserRepository.getUserByEmail(user.email);
    if (isExistingEmail) {
        if (isExistingEmail.isBlock) {
            throw new appError_1.default('User is Blocked', httpStatus_1.HttpStatus.UNAUTHORIZED);
        }
        const refreshToken = await authService.generateRefreshToken(isExistingEmail._id.toString(), isExistingEmail.role);
        const accessToken = await authService.generateAccessToken(isExistingEmail._id.toString(), isExistingEmail.role);
        const userDetails = {
            name: isExistingEmail.name,
            email: isExistingEmail.email,
            username: isExistingEmail.username,
            isBlock: isExistingEmail.isBlock,
            bio: isExistingEmail?.bio,
            profilePic: isExistingEmail?.profilePic,
            phoneNumber: isExistingEmail?.phoneNumber,
            role: isExistingEmail.role,
            _id: isExistingEmail._id,
            isPrivate: isExistingEmail.isPrivate
        };
        await dbUserRepository.addRefreshTokenAndExpiry(userDetails.email, refreshToken);
        return { userDetails, accessToken, refreshToken };
    }
    ///---------------------------generating unique username====================>
    const generateUniqueUsername = async (email, otpString) => {
        let username;
        let existingUser;
        do {
            // Generate the username using the email and OTP
            username = email.slice(0, Math.min(5, email.indexOf('@'))) + otpString;
            // Check if the generated username already exists in the database
            existingUser = await dbUserRepository.getUserByUsername(username);
            // If it exists, regenerate the OTP and retry
            if (existingUser) {
                otpString = otp_generator_1.default.generate(4, {
                    lowerCaseAlphabets: true,
                    upperCaseAlphabets: false,
                    specialChars: false,
                });
            }
        } while (existingUser);
        return username;
    };
    //------------------------------------------------------------------------------>>>>>
    const otpString = otp_generator_1.default.generate(4, {
        lowerCaseAlphabets: true,
        upperCaseAlphabets: false,
        specialChars: false,
    });
    const username = await generateUniqueUsername(user.email, otpString);
    const newUser = {
        name: user.name,
        email: user.email,
        isGoogleSignin: true,
        username: username
    };
    const userDetails = await dbUserRepository.addUser(newUser);
    const accessToken = await authService.generateAccessToken(userDetails._id.toString(), userDetails.role);
    const refreshToken = await authService.generateRefreshToken(userDetails._id.toString(), userDetails.role);
    await dbUserRepository.addRefreshTokenAndExpiry(newUser.email, refreshToken);
    return { userDetails, accessToken, refreshToken };
};
exports.userLoginUsingGoogle = userLoginUsingGoogle;
const handleRefreshAccessToken = async (cookies, dbUserRepository, authService) => {
    console.log('cookies ', cookies);
    if (!cookies?.refreshToken) {
        throw new appError_1.default("Invalid token!", httpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    const refreshToken = cookies.refreshToken;
    const { userId, role } = authService.verifyRefreshToken(refreshToken.toString());
    // Check if role is valid (either 'client' or 'admin')
    if (!userId || (role !== "client" && role !== "admin")) {
        throw new appError_1.default("Invalid token!", httpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    const user = await dbUserRepository.getUserById(userId);
    console.log('user for setting refresh access Token ', user);
    const newAccessToken = authService.generateAccessToken(userId, user?.role);
    return newAccessToken;
};
exports.handleRefreshAccessToken = handleRefreshAccessToken;
const handleResetPassword = async (data, dbUserRepository, authService) => {
    const password = await authService.encryptPassword(data.password);
    const user = await dbUserRepository.resetPassword(data.email, password);
    return user;
};
exports.handleResetPassword = handleResetPassword;
