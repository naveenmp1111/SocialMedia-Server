"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const authService = () => {
    const encryptPassword = async (password) => {
        const salt = await bcryptjs_1.default.genSalt(10);
        password = await bcryptjs_1.default.hash(password, salt);
        return password;
    };
    const comparePassword = async (password, hashedPassword) => {
        return bcryptjs_1.default.compare(password, hashedPassword);
    };
    return {
        encryptPassword,
        comparePassword
    };
};
exports.authService = authService;
