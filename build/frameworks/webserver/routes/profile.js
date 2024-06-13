"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRepositoryMongoDb_1 = require("../../database/monogDB/repositories/userRepositoryMongoDb");
const userDbRepository_1 = require("../../../application/repositories/userDbRepository");
const authService_1 = require("../../services/authService");
const authServiceInterfaces_1 = require("../../../application/services/authServiceInterfaces");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const profileController_1 = __importDefault(require("../../../adapters/profileController"));
const profileRouter = () => {
    const router = (0, express_1.default)();
    const controller = (0, profileController_1.default)(userRepositoryMongoDb_1.userRepositoryMongoDb, userDbRepository_1.userDbRepository, authService_1.authService, authServiceInterfaces_1.authServiceInterface);
    router.post('/editProfile', authMiddleware_1.default, controller.editProfile);
    router.get('/getUserById/:userId', authMiddleware_1.default, controller.getUserById);
    return router;
};
exports.default = profileRouter;
