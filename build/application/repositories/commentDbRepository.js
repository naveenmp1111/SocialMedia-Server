"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentDbRepository = void 0;
const commentDbRepository = (repository) => {
    const addComment = async (commentObj) => repository.addComment(commentObj);
    const getComments = async (postId) => repository.getComments(postId);
    const addReply = async (replyObj) => repository.addReply(replyObj);
    return {
        addComment,
        getComments,
        addReply
    };
};
exports.commentDbRepository = commentDbRepository;
