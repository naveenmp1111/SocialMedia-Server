"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRepositoryMongoDb_1 = require("../../database/monogDB/repositories/userRepositoryMongoDb");
const userDbRepository_1 = require("../../../application/repositories/userDbRepository");
const userController_1 = __importDefault(require("../../../adapters/userController"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const userRouter = () => {
    const router = (0, express_1.default)();
    const controller = (0, userController_1.default)(userRepositoryMongoDb_1.userRepositoryMongoDb, userDbRepository_1.userDbRepository);
    router.get('/getRestOfAllUsers', authMiddleware_1.default, controller.getRestOfAllUsers);
    router.post('/followUser', controller.followUser);
    return router;
};
exports.default = userRouter;
