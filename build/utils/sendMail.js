"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const appError_1 = __importDefault(require("./appError"));
const httpStatus_1 = require("../types/httpStatus");
const sendMail = async (email, title, body, post) => {
    try {
        console.log(`Sending mail to: ${email}`);
        console.log(`Title: ${title}`);
        console.log(`Body: ${body}`);
        const transporter = nodemailer_1.default.createTransport({
            service: 'Gmail',
            auth: {
                user: config_1.default.MAIL_USERNAME,
                pass: config_1.default.MAIL_PASSKEY
            }
        });
        let htmlContent = `<p>${body}</p>`;
        if (post && post) {
            htmlContent += `<img src="${post}" alt="Post Image" style="max-width: 100%; height: auto;"/>`;
        }
        const mailOptions = {
            from: config_1.default.MAIL_USERNAME,
            to: email,
            subject: title,
            html: htmlContent,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return info.response;
    }
    catch (error) {
        console.error('Error sending email: ', error);
        throw new appError_1.default('Unauthorized', httpStatus_1.HttpStatus.UNAUTHORIZED);
    }
};
exports.default = sendMail;
