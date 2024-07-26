import mongoose, { Document, ObjectId, Schema, model } from 'mongoose'

interface PostInterface extends Document {
    userId: ObjectId;
    description?: string;
    // hashtags?: string;
    // hashtagsArray?: string[];
    likes?: string[];
    // comments?: string[];
    // saved?: string[];
    // reports: string[];
    // video?: string;
    image?: ObjectId[];
    isBlock: boolean;
    taggedUsers: ObjectId[]
}

const postSchema = new Schema<PostInterface>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        description: {
            type: String,
        },
        image: [{
            type: String,
        }],
        likes: [],
        isBlock: {
            type: Boolean,
            default: false,
        },
        taggedUsers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    {
        timestamps: true,
    }
);

const Post = model<PostInterface>("Post", postSchema);

export default Post;