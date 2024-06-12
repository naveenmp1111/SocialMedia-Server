"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const authService = () => {
    const encryptPassword = async (password) => {
        const salt = await bcryptjs_1.default.genSalt(10);
        password = await bcryptjs_1.default.hash(password, salt);
        return password;
    };
    const comparePassword = async (password, hashedPassword) => {
        return bcryptjs_1.default.compare(password, hashedPassword);
    };
    const generateAccessToken = (payload) => {
        // console.log('coimg to accesstken generation')
        const accessToken = jsonwebtoken_1.default.sign(payload, config_1.default.JWT_ACCESS_SECRET, {
            expiresIn: '15m'
        });
        return accessToken;
    };
    const generateRefreshToken = (payload) => {
        // console.log('coming to refresh token generations')
        const refreshToken = jsonwebtoken_1.default.sign(payload, config_1.default.JWT_REFRESH_SECRET, {
            expiresIn: '7d'
        });
        // console.log('refreshtoken', refreshToken)
        return refreshToken;
    };
    const verifyAccessToken = (token) => {
        const payload = jsonwebtoken_1.default.verify(token, config_1.default.JWT_ACCESS_SECRET);
        return payload;
    };
    const verifyRefreshToken = (token) => {
        const payload = jsonwebtoken_1.default.verify(token, config_1.default.JWT_REFRESH_SECRET);
        return payload;
    };
    return {
        encryptPassword,
        comparePassword,
        generateRefreshToken,
        generateAccessToken,
        verifyAccessToken,
        verifyRefreshToken
    };
};
exports.authService = authService;
