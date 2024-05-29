"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authService_1 = require("../../services/authService");
const authController_1 = __importDefault(require("../../../adapters/authController"));
const authServiceInterfaces_1 = require("../../../application/services/authServiceInterfaces");
const userRepositoryMongoDb_1 = require("../../database/monogDB/repositories/userRepositoryMongoDb");
const userDbRepository_1 = require("../../../application/repositories/userDbRepository");
const otpDbRepository_1 = require("../../../application/repositories/otpDbRepository");
const otpRepositoryMongoDb_1 = require("../../database/monogDB/repositories/otpRepositoryMongoDb");
const mailSenderService_1 = require("../../services/mailSenderService");
const mailSenderService_2 = require("../../../application/services/mailSenderService");
const authRouter = () => {
    const router = (0, express_1.default)();
    const controller = (0, authController_1.default)(authService_1.authService, authServiceInterfaces_1.authServiceInterface, userRepositoryMongoDb_1.userRepositoryMongoDb, userDbRepository_1.userDbRepository, otpRepositoryMongoDb_1.otpRepositoryMongoDb, otpDbRepository_1.otpDbRepository, mailSenderService_1.mailSenderService, mailSenderService_2.mailSenderServiceInterface);
    router.post('/signup', controller.registerUser);
    router.get('/usernameAvailability/:username', controller.usernameAvailability);
    router.get('/emailAvailability/:email', controller.emailAvailability);
    router.post('/login', controller.loginUser);
    router.post('/sendOtp', controller.sendOtpForEmailVerification);
    router.post('/verifyOtp', controller.verifyOtpForEmailVerification);
    router.post('/google_auth', controller.loginWithGoogle);
    return router;
};
exports.default = authRouter;
