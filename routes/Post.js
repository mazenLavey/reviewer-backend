import express from 'express';
import Post from '../models/Post';
import cloudinary from '../config/cloudinary';
import upload from '../middleware/multer';

const router = express.Router();

router.post('/', upload.array('mediaFiles'), async (req, res) => {
    try {
        const { postTitle, postSummary, postContent, mediaFiles } = req.body;
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
            likes: 0,
            comments: []
        });

        res.json({
            success: true,
            data: postDoc
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
})

export default router;