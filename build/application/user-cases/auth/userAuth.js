"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLogin = exports.userRegister = void 0;
const appError_1 = __importDefault(require("../../../utils/appError"));
const httpStatus_1 = require("../../../types/httpStatus");
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
    console.log('coming to use cases');
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
        dp: user?.dp,
        bio: user?.bio,
        gender: user?.gender,
        isBlock: user.isBlock
    };
    return userDetails;
};
exports.userLogin = userLogin;
