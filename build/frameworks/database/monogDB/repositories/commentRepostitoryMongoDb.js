"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRepositoryMongoDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const commentModel_1 = __importDefault(require("../models/commentModel"));
const { ObjectId } = mongoose_1.default.Types;
const commentRepositoryMongoDb = () => {
    const addComment = async (commentObj) => {
        try {
            const comment = new commentModel_1.default(commentObj);
            const savedComment = await comment.save();
            return savedComment;
        }
        catch (error) {
            console.log('error in adding comment ', error);
        }
    };
    const addReply = async (ReplyObj) => {
        try {
            const comment = new commentModel_1.default(ReplyObj);
            const savedComment = await comment.save();
            return savedComment;
        }
        catch (error) {
            console.log('error in adding reply', error);
        }
    };
    const getComments = async (postId) => {
        try {
            const PostObj = new ObjectId(postId);
            console.log('post id is ', PostObj);
            const comments = await commentModel_1.default.aggregate([
                { $match: { postId: PostObj } },
                { $lookup: {
                        from: 'users',
                        localField: 'commenterId',
                        foreignField: '_id',
                        as: 'user'
                    } },
                {
                    $unwind: '$user'
                },
                {
                    $project: {
                        _id: 1,
                        postId: 1,
                        comment: 1,
                        parentId: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        user: { _id: 1, name: 1, username: 1, profilePic: 1 },
                    },
                },
                {
                    $sort: { createdAt: -1 },
                },
            ]);
            console.log('retrieved comment data is  :', comments);
            return comments;
        }
        catch (error) {
            console.log('Error in getting comments ', error);
        }
    };
    return {
        addComment,
        getComments,
        addReply
    };
};
exports.commentRepositoryMongoDb = commentRepositoryMongoDb;
