import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const CommentSchema = new Schema({
    content: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true,
});

const PostSchema = new Schema({
    postTitle: { type: String, required: true },
    postSummary: { type: String, required: true },
    postContent: { type: String, required: true },
    mediaFiles: [{ type: String, required: true }],
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [CommentSchema],
    postGroup: { type: String, required: true },
    postTags: { type: String, required: true },
    postRate: { type: String, required: true },
}, {
    timestamps: true,
});

const Post = model('Post', PostSchema);

export default Post;
