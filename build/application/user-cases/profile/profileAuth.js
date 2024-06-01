"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleEditProfile = void 0;
const appError_1 = __importDefault(require("../../../utils/appError"));
const httpStatus_1 = require("../../../types/httpStatus");
const handleEditProfile = async (profileInfo, dbUserRepository) => {
    console.log("profileInfo...", profileInfo);
    const usernameExists = await dbUserRepository.checkUsernameForEdit(profileInfo.username, profileInfo.userId);
    if (usernameExists) {
        throw new appError_1.default('Username already exists', httpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    const emailExists = await dbUserRepository.checkEmailForEdit(profileInfo.email, profileInfo.userId);
    if (emailExists) {
        throw new appError_1.default('Email already exists', httpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    const userDetails = await dbUserRepository.editProfile(profileInfo);
    return userDetails;
};
exports.handleEditProfile = handleEditProfile;
