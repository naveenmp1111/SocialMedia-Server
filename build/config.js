"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const configKeys = {
    MONGO_URL: process.env.MONGO_URL,
    PORT: process.env.PORT,
    MAIL_USERNAME: process.env.MAIL_USERNAME,
    MAIL_PASSKEY: process.env.MAIL_PASSKEY
};
exports.default = configKeys;
