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
const authRouter = () => {
    const router = (0, express_1.default)();
    const controller = (0, authController_1.default)(authService_1.authService, authServiceInterfaces_1.authServiceInterface, userRepositoryMongoDb_1.userRepositoryMongoDb, userDbRepository_1.userDbRepository);
    router.post('/signup', controller.registerUser);
    router.get('/usernameAvailability/:username', controller.usernameAvailability);
    router.get('/emailAvailability/:email', controller.emailAvailability);
    router.post('/login', controller.loginUser);
    return router;
};
exports.default = authRouter;
