import { PostDataInterface } from "../../../types/PostInterface"
import { HttpStatus } from "../../../types/httpStatus"
import AppError from "../../../utils/appError"
import { CommentDbInterface } from "../../repositories/commentDbRepository"
import { NotificationDbInterface } from "../../repositories/notificationDbRepository"
import { PostDbInterface } from "../../repositories/postDbRepository"
import { io } from "../../../app"
import { getReceiverSocketId } from "../../../frameworks/webSocket/socketConfig"



export const handleCreatePost = async (
    postData: PostDataInterface,
    postDbRepository: ReturnType<PostDbInterface>,
    nofificationDbRepository:ReturnType<NotificationDbInterface>
) => {
    try {
        const newPost = await postDbRepository.createPost(postData)
        if (newPost && postData && postData.taggedUsers) {
            const notification = await nofificationDbRepository.createNotification(postData.userId, postData.taggedUsers, 'tag', newPost._id as unknown as string)

            postData.taggedUsers.forEach(taggedUserId => {
                const receiverSocketId = getReceiverSocketId(taggedUserId as unknown as string);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('notification', notification);
                }
            });
        }
        return newPost
    } catch (error) {
        console.log('Error creating in post', error)
        throw new AppError('Error creating in post', HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleGetPostsByUser = async (
    username: string,
    postDbRepository: ReturnType<PostDbInterface>,
) => {
    try {
        const UserPosts = await postDbRepository.getPostsByUser(username)
        return UserPosts
    } catch (error) {
        console.log('error in fetching my posts', error)
        throw new AppError('Error in fetching my posts ', HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleEditPostbyId = async (
    postId: string,
    description: string,
    postDbRepository: ReturnType<PostDbInterface>
) => {
    try {
        const updatedPost = await postDbRepository.updatePostById(postId, description)
        return updatedPost
    } catch (error) {
        console.log('error in  handleEditPostbyId', error)
        throw new AppError('Error in handling the edit post', HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleGetAllPosts = async (
    userId: string,
    postDbRepository: ReturnType<PostDbInterface>
) => {
    const allPosts = await postDbRepository.getAllPosts(userId)
    return allPosts
}

export const handleGetAllPostsToExplore = async (
    userId: string,
    postDbRepository: ReturnType<PostDbInterface>
) => {
    const allposts = await postDbRepository.getAllPostsToExplore(userId)
    return allposts
}

export const handleDeletePost = async (
    postId: string,
    postDbRepository: ReturnType<PostDbInterface>,
    notificationDbRepository:ReturnType<NotificationDbInterface>
) => {
    try {
        const post = await postDbRepository.deletePost(postId)
        return post
    } catch (error) {
        console.log('errror in handleDeletePost ', error)
    }
}

export const handleReportPost = async (
    postId: string,
    reason: string,
    userId: string,
    postDbRepository: ReturnType<PostDbInterface>
) => {
    try {
        await postDbRepository.reportPost(postId, reason, userId)
    } catch (error) {
        console.log('error in report Post', error)
    }
}

export const handleGetPostReports = async (
    postDbRepository: ReturnType<PostDbInterface>
) => {
    try {
        const reports = await postDbRepository.getPostReports()
        return reports
    } catch (error) {
        console.log('error in getting post reports')
    }
}

export const handleLikePost = async (
    postId: string,
    userId: string,
    postDbRepository: ReturnType<PostDbInterface>,
    nofificationDbRepository: ReturnType<NotificationDbInterface>
) => {
    try {
        const postData = await postDbRepository.likePost(postId, userId)
        if (postData && postData.userId as unknown as string != userId) {
            const notification = await nofificationDbRepository.createNotification(userId, postData.userId as unknown as string[], 'like', postId)

            const recieverSocketId = getReceiverSocketId(postData.userId as unknown as string)
            io.to(recieverSocketId).emit('notification', (notification))
        }
    } catch (error) {
        console.log('error in liking the post')
    }
}

export const handleUnlikePost = async (
    postId: string,
    userId: string,
    postDbRepository: ReturnType<PostDbInterface>,
    nofificationDbRepository: ReturnType<NotificationDbInterface>
) => {
    try {
        const postData = await postDbRepository.unlikePost(postId, userId)
        if (postData && postData.userId as unknown as string != userId) {
            await nofificationDbRepository.deleteNotification(userId, postData.userId as unknown as string, 'like', postId)
        }
    } catch (error) {
        console.log('error in liking the post')
    }
}

export const handleAddComment = async (
    userId: string,
    postId: string,
    comment: string,
    commentDbRepository: ReturnType<CommentDbInterface>,
    postDbRepository: ReturnType<PostDbInterface>,
    nofificationDbRepository: ReturnType<NotificationDbInterface>
) => {
    try {
        const commentObj = {
            postId,
            commenterId: userId,
            comment
        }
        const postData = await postDbRepository.getPostById(postId)
        const commentResponse = await commentDbRepository.addComment(commentObj)
        if (commentResponse && postData && postData.userId as unknown as string != userId) {
            const notification = await nofificationDbRepository.createNotification(userId, postData.userId as unknown as string[], 'comment', postId)
            const recieverSocketId = getReceiverSocketId(postData.userId as unknown as string)
            io.to(recieverSocketId).emit('notification', (notification))
        }
        return commentResponse
    } catch (error) {
        console.log('error in adding comment ', error)
    }
}

export const handleAddReply = async (
    userId: string,
    postId: string,
    parentId: string,
    comment: string,
    commentDbRepository: ReturnType<CommentDbInterface>,
    postDbRepository: ReturnType<PostDbInterface>,
    nofificationDbRepository: ReturnType<NotificationDbInterface>
) => {
    try {
        const replyObj = {
            postId,
            commenterId: userId,
            comment,
            parentId
        }
        const postData = await postDbRepository.getPostById(postId)
        const commentResponse = await commentDbRepository.addReply(replyObj)
        if (postData && commentResponse) {
            const notification = await nofificationDbRepository.createNotification(userId, postData.userId as unknown as string[], 'comment', postId)
            const recieverSocketId = getReceiverSocketId(postData.userId as unknown as string)
            io.to(recieverSocketId).emit('notification', (notification))
        }
        return commentResponse
    } catch (error) {
        console.log('error in adding reply comment ', error)
    }
}

export const handleGetComments = async (
    postId: string,
    commentDbRepository: ReturnType<CommentDbInterface>
) => {
    try {
        return await commentDbRepository.getComments(postId)
    } catch (error) {
        console.log('error in handling get comments ', error)
    }
}

export const handleGetTaggedPosts = async (
    username: string,
    postDbRepository: ReturnType<PostDbInterface>
) => {
    try {
        return await postDbRepository.getTaggedPosts(username)
    } catch (error) {
        console.log('error in getting taggedposts ', error)
    }
}



