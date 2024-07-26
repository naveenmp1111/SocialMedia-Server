"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../../database/monogDB/models/userModel"));
const httpStatus_1 = require("../../../types/httpStatus");
const config_1 = __importDefault(require("../../../config"));
const authMiddleware = async (req, res, next) => {
    try {
        let token = req.header('authorization')?.split(' ')[1];
        token = token?.replace('"', ' ');
        if (token) {
            const decryptedToken = jsonwebtoken_1.default.verify(token, config_1.default.JWT_ACCESS_SECRET);
            // console.log('decryted token',decryptedToken)
            const user = await userModel_1.default.findOne({ _id: decryptedToken.userId, isBlock: true });
            req.body.userId = decryptedToken.userId;
            if (user && req.path != '/logout') {
                res.status(httpStatus_1.HttpStatus.UNAUTHORIZED).json({ success: false, message: 'User is blocked' });
            }
            else {
                next();
            }
        }
        else {
            res.status(httpStatus_1.HttpStatus.UNAUTHORIZED).json({ success: false, message: 'Token not found' });
        }
    }
    catch (error) {
        console.log(error.mesage);
        res.status(httpStatus_1.HttpStatus.UNAUTHORIZED).json({ success: false, message: error.message });
    }
};
exports.default = authMiddleware;
