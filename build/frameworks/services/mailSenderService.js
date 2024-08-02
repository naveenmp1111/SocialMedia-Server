"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailSenderService = void 0;
const sendMail_1 = __importDefault(require("../../utils/sendMail"));
const mailSenderService = () => {
    const sendVerificationMail = async (email, otp) => {
        const mailResponse = await (0, sendMail_1.default)(email, 'Sickomode - Email verification', `Otp for email verification is ${otp}`);
        return mailResponse;
    };
    const sendPostBlockNotification = async (email, post) => {
        const mailResponse = await (0, sendMail_1.default)(email, 'Sickomode - Post blocked', 'Your post has been removed as it does not adhere to our community guidelines and standards.', post);
    };
    return {
        sendVerificationMail,
        sendPostBlockNotification
    };
};
exports.mailSenderService = mailSenderService;
