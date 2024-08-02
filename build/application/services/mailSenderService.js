"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailSenderServiceInterface = void 0;
const mailSenderServiceInterface = (service) => {
    const sendVerificationMail = async (email, otp) => service.sendVerificationMail(email, otp);
    const sendPostBlockNotification = async (email, post) => service.sendPostBlockNotification(email, post);
    return {
        sendVerificationMail,
        sendPostBlockNotification
    };
};
exports.mailSenderServiceInterface = mailSenderServiceInterface;
