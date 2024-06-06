import { PostDataInterface } from "../../../../types/PostInterface"
import Post from "../models/postModel"
import User from "../models/userModel"
// const { ObjectId } = require('mongoose').Types;
import { ObjectId } from "mongoose"

export const postRepositoryMongoDb=()=>{
    const createPost=async(postData:PostDataInterface)=>{
        try {
            const post=new Post(postData)
            const savedPost= await post.save()
            return savedPost
        } catch (error) {
            console.log(error)
        }
    }

    const getMyPosts=async(userId:string)=>{
        try {
            // const myPosts=await Post.find({userId}).sort({createdAt:-1})

            const myPosts = await Post.aggregate([
                {
                    $addFields: {
                        userIdObject: { $toObjectId: userId }
                    }
                },
                {
                    $match: { $expr: { $eq: ["$userId", "$userIdObject"] } }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: '$user'
                },
                {
                    $project: {
                        _id: 1,
                        userId: 1,
                        hashtags: 1,
                        hashtagsArray: 1,
                        description: 1,
                        likes: 1,
                        comments: 1,
                        saved: 1,
                        reports: 1,
                        image: 1,
                        isBlock: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        user: {
                            _id: "$user._id",
                            name: "$user.name",
                            username: "$user.username",
                            email: "$user.email",
                            profilePic: "$user.profilePic"
                        }
                    }
                }
            ]);
            
            
            console.log('myposts',myPosts)
            return myPosts
        } catch (error) {
            console.log(error)
        }
    }
    const updatePostById = async (postId: string, description: string) => {
        try {
        //   const post = await Post.findById(postId)
          const post = await Post.findByIdAndUpdate(postId,{$set:{description:description}},{new:true});
        //   console.log('updated post ',post)
          return post;
        } catch (err) {
          console.log(err);
        }
      };

    const getAllPosts=async(userId:string)=>{
        try {
            // const posts = await Post.find({ userId: { $ne: userId } });
            // console.log('posts are ',posts)
            const posts=await Post.aggregate([
                {
                    $sort:{createdAt:-1}
                },
                {
                    $lookup:{
                        from:"users",
                        localField:"userId",
                        foreignField:"_id",
                        as:"user"
                    }
                },
                {
                    $unwind: {
                        path: "$user",
                        // preserveNullAndEmptyArrays: true // Optional: Include posts without a user
                    }
                },
                {
                    $project:{
                        _id: 1,
                        userId: 1,
                        hashtags: 1,
                        hashtagsArray: 1,
                        description: 1,
                        likes: 1,
                        comments: 1,
                        saved: 1,
                        reports: 1,
                        image: 1,
                        isBlock: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        user: {
                          _id: "$user._id",
                          name: "$user.name",
                          username: "$user.username",
                          email: "$user.email",
                          profilePic: "$user.profilePic",
                        },
                    }
                }
            ])
        return posts;
        } catch (error) {
            console.log(error)
        }
    }

   

    return{
        createPost,
        getMyPosts,
        updatePostById,
        getAllPosts
    }
}

export type PostRepositoryMongoDb=typeof postRepositoryMongoDb