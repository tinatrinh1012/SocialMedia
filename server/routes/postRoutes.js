import express from 'express';
import Post from '../models/Post.js';

const postRouter = express.Router();

postRouter.get('/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const posts = await Post.find({ createdBy: username });
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
    }
})

export default postRouter;