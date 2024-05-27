"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpRepositoryMongoDb = void 0;
const otpModel_1 = __importDefault(require("../models/otpModel"));
const otpRepositoryMongoDb = () => {
    const saveNewOtp = async ({ email, otp }) => {
        try {
            const otpObj = new otpModel_1.default({ email, otp });
            const savedOtp = await otpObj.save();
            return savedOtp;
        }
        catch (error) {
            console.log(error);
        }
    };
    const getLatestOtp = async (email) => {
        try {
            const otpObj = await otpModel_1.default.findOne({ email }).sort({ createdAt: -1 });
            return otpObj;
        }
        catch (error) {
            console.log(error);
        }
    };
    return {
        saveNewOtp,
        getLatestOtp
    };
};
exports.otpRepositoryMongoDb = otpRepositoryMongoDb;
