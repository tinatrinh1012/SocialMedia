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

commentRouter.post('/create', async (req, res) => {
    try {
        const { postId, text } = req.body;
        const newComment = await Comment.create({
            postId: postId,
            text: text,
            createdBy: req.user.username
        });
        res.status(201).json(newComment);
    } catch (error) {
        res.status(400).json(error);
    }
})

export default commentRouter;