import express from 'express';
import Post from '../models/Post.js';

const postRouter = express.Router();

postRouter.get('/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const posts = await Post.find({ createdBy: username });
        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

// TODO: identify and validate username through authentication
postRouter.post('/:username/create', async (req, res) => {
    try {
        const { username } = req.params;
        const { text } = req.body;

        if (text == null || text.length == 0) {
            throw new Error("Cannot create post with empty content");
        }

        await Post.create({
            createdBy: username,
            text: text
        });
        res.status(201).json({ success: "Created post successfully"});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

export default postRouter;