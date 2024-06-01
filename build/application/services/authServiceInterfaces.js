"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServiceInterface = void 0;
const authServiceInterface = (service) => {
    const encryptPassword = async (password) => {
        return await service.encryptPassword(password);
    };
    const comparePassword = async (password, hashedPassword) => {
        return await service.comparePassword(password, hashedPassword);
    };
    const generateAccessToken = async (userId, role) => {
        return await service.generateAccessToken({ userId, role });
    };
    const generateRefreshToken = async (userId, role) => {
        console.log('coing to authSeriveceinterfaces');
        return await service.generateRefreshToken({ userId, role });
    };
    const verifyAccessToken = (token) => {
        return service.verifyAccessToken(token);
    };
    const verifyRefreshToken = (token) => {
        return service.verifyRefreshToken(token);
    };
    return {
        encryptPassword,
        comparePassword,
        generateAccessToken,
        generateRefreshToken,
        verifyAccessToken,
        verifyRefreshToken
    };
};
exports.authServiceInterface = authServiceInterface;
