"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authService_1 = require("../../services/authService");
const authServiceInterfaces_1 = require("../../../application/services/authServiceInterfaces");
const userRepositoryMongoDb_1 = require("../../database/monogDB/repositories/userRepositoryMongoDb");
const userDbRepository_1 = require("../../../application/repositories/userDbRepository");
const adminController_1 = __importDefault(require("../../../adapters/adminController"));
const adminRouter = () => {
    const router = (0, express_1.default)();
    const controller = (0, adminController_1.default)(authService_1.authService, authServiceInterfaces_1.authServiceInterface, userRepositoryMongoDb_1.userRepositoryMongoDb, userDbRepository_1.userDbRepository);
    router.get('/getAllUsersForAdmin', controller.getAllUsersForAdmin);
    router.patch('/blockUser/:userId', controller.blockUser);
    router.patch('/unblockUser/:userId', controller.unblockUser);
    return router;
};
exports.default = adminRouter;
