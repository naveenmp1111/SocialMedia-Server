"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLoginUsingGoogle = exports.handleOtpVerification = exports.handleSendOtp = exports.userLogin = exports.userRegister = void 0;
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
        isBlock: user.isBlock
    };
    const refreshToken = await authService.generateRefreshToken(user._id.toString(), user.role);
    const accessToken = await authService.generateAccessToken(user._id.toString(), user.role);
    return { userDetails, refreshToken, accessToken };
};
exports.userLogin = userLogin;
const handleSendOtp = async (email, dbOtpRepository, mailSenderService) => {
    const otpString = otp_generator_1.default.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
    });
    const otp = parseInt(otpString);
    console.log('Otp is ', otp);
    //   console.log('type is ',typeof otp)
    await dbOtpRepository.saveNewOtp({ email, otp });
    const response = await mailSenderService.sendVerificationMail(email, otp);
    //   console.log('response in userAuth in user case',response)
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
        };
        await dbUserRepository.addRefreshTokenAndExpiry(userDetails.email, refreshToken);
        return { userDetails, accessToken, refreshToken };
    }
    const otpString = otp_generator_1.default.generate(4, {
        lowerCaseAlphabets: true,
        upperCaseAlphabets: false,
        specialChars: false,
    });
    const username = user.email.slice(0, user.email.indexOf('@')) + otpString;
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
