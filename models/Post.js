import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const PostSchema = new Schema({
    postTitle: { type: String, required: true },
    postSummary: { type: String, required: true },
    postContent: { type: String, required: true },
    mediaFiles: [{ type: String, required: true }],
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    likes: { type: Number },
    comments: { type: Array }
}, {
    timestamps: true,
});

const PostModel = model('Post', PostSchema);

export default PostModel;
