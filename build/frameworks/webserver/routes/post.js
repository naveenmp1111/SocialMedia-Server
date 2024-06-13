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
const postController_1 = __importDefault(require("../../../adapters/postController"));
const postRepositoryMongoDb_1 = require("../../database/monogDB/repositories/postRepositoryMongoDb");
const postDbRepository_1 = require("../../../application/repositories/postDbRepository");
const postRouter = () => {
    const router = (0, express_1.default)();
    const controller = (0, postController_1.default)(userRepositoryMongoDb_1.userRepositoryMongoDb, userDbRepository_1.userDbRepository, authService_1.authService, authServiceInterfaces_1.authServiceInterface, postRepositoryMongoDb_1.postRepositoryMongoDb, postDbRepository_1.postDbRepository);
    router.post('/createPost', authMiddleware_1.default, controller.createPost);
    router.get('/getPostsByUser/:userId', authMiddleware_1.default, controller.getPostsByUser);
    router.post('/editPost', authMiddleware_1.default, controller.updatePostById);
    router.get('/getAllPosts', authMiddleware_1.default, controller.getAllPosts);
    router.get('/deletePost/:postId', authMiddleware_1.default, controller.deletePost);
    return router;
};
exports.default = postRouter;
