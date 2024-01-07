import express from 'express';
import Comment from '../models/Comment.js';

const commentRouter = express.Router();

commentRouter.get('/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await Comment.find({ postId: postId });
        res.status(200).json(comments);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

export default commentRouter;