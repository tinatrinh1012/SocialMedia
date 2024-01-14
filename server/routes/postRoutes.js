import express from 'express';
import Post from '../models/Post.js';

const postRouter = express.Router();

postRouter.get('/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const posts = await Post.find({ createdBy: username }).sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

postRouter.get('/', async (req, res) => {
    try {
        const { _id } = req.query;
        const post = await Post.findById(_id);
        res.status(200).json(post);
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

        const createdPost = await Post.create({
            createdBy: username,
            createdTime: new Date(),
            text: text,
        });
        res.status(201).json(createdPost);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

// TODO: Post can only be updated by post owner. Validate request made by authorized user.
postRouter.put('/:_id/update', async (req, res) => {
    try {
        const { _id } = req.params;
        const { text } = req.body;
        const updatedPost = await Post.findOneAndUpdate(
            { _id: _id },
            { text: text }
        )
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

// TODO: should also delete post comments
postRouter.delete('/:_id/delete', async (req, res) => {
    try {
        const { _id } = req.params;
        await Post.findOneAndDelete({ _id: _id })
        res.status(200).json({ message: "Successfully deleted post" })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

export default postRouter;