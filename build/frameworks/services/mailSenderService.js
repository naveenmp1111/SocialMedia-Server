"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailSenderService = void 0;
const sendMail_1 = __importDefault(require("../../utils/sendMail"));
const mailSenderService = () => {
    const sendVerificationMail = async (email, otp) => {
        const mailResponse = await (0, sendMail_1.default)(email, 'SOCIAL-MEDIA - Email verification', `Otp for email verification is ${otp}`);
        // console.log('mail response',mailResponse)
        return mailResponse;
    };
    return {
        sendVerificationMail
    };
};
exports.mailSenderService = mailSenderService;
