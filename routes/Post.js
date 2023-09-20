import express from 'express';
import Post from '../models/Post';
import cloudinary from '../config/cloudinary';
import upload from '../middleware/multer';

const router = express.Router();

router.post('/', upload.array('mediaFiles'), async (req, res) => {
    try {
        const {
            postTitle,
            postSummary,
            postContent,
            postGroup,
            postTags,
            postRate,
        } = req.body;

        const { userId } = JSON.parse(req.cookies._auth_state);
        const uploadedFiles = [];

        await Promise.all(req.files.map(async (file) => {
            try {
                const result = await cloudinary.uploader.upload(file.path);
                uploadedFiles.push(result.url);
            } catch (err) {
                throw new Error("Upload failed, try again later!");
            }
        }));

        // Create a new post document in MongoDB
        const postDoc = await Post.create({
            postTitle,
            postSummary,
            postContent,
            mediaFiles: uploadedFiles,
            author: userId,
            likes: [],
            comments: [],
            postGroup,
            postTags,
            postRate,
        });

        res.json(postDoc);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
})

router.get('/', async (req, res) => {
    try {
        const allPostsDoc = await Post.find().limit(20).populate('author', ['userName']);

        res.json({
            success: true,
            data: allPostsDoc
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
})

router.get('/user_posts', async (req, res) => {
    try {
        const { userId } = JSON.parse(req.cookies._auth_state);

        const userPosts = await Post.find({ author: userId });

        res.json({
            success: true,
            data: userPosts
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
})

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const userPosts = await Post.findById(id)
            .populate('author', ['userName'])
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'userName',
                },
            });

        res.json({
            success: true,
            data: userPosts
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const userPost = await Post.findByIdAndRemove(id);

        res.json({
            success: true,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
})

router.put('/comments', async (req, res) => {
    try {
        // userId
        const { userId } = JSON.parse(req.cookies._auth_state);

        // comment
        const { content, postId } = req.body;

        const newComment = {
            content,
            author: userId,
        }

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $push: { comments: newComment } },
            { new: true }
        ).populate('comments.author', ['userName']);

        if (!updatedPost) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        res.json({
            success: true,
            data: updatedPost
        });


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
})

router.delete('/comments/:commentId', async (req, res) => {
    try {
        const { commentId } = req.params;

        const post = await Post.findOneAndUpdate(
            { 'comments._id': commentId },
            { $pull: { comments: { _id: commentId } } },
            { new: true }
        );

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        res.json({
            success: true,
        });


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
})

router.put('/likes', async (req, res) => {
    try {
        // userId
        const { userId } = JSON.parse(req.cookies._auth_state);

        const { postId } = req.body;

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $push: { likes: userId } },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        res.json({
            success: true,
            data: updatedPost
        });


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
})

router.delete('/likes/:postId', async (req, res) => {
    try {
        // userId
        const { userId } = JSON.parse(req.cookies._auth_state);

        const { postId } = req.params;

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $pull: { likes: userId } },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        res.json({
            success: true,
            data: updatedPost
        });


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
})

export default router;