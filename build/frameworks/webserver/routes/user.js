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
    router.post('/followUser', authMiddleware_1.default, controller.followUser);
    router.post('/unfollowUser', authMiddleware_1.default, controller.unfollowUser);
    router.get('/getFollowing/:userId', controller.getFollowing);
    router.get('/getFollowers/:userId', controller.getFollowers);
    router.get('/getRequests/:username', controller.getRequests);
    router.post('/acceptRequest', authMiddleware_1.default, controller.acceptRequest);
    router.patch('/removeFollower/:followerUsername', authMiddleware_1.default, controller.removeFollower);
    router.patch('/savePost/:postId', authMiddleware_1.default, controller.savePost);
    router.patch('/unsavePost/:postId', authMiddleware_1.default, controller.unsavePost);
    return router;
};
exports.default = userRouter;
