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

postRouter.post('/:username/create', async (req, res) => {
    try {
        const { username } = req.params;
        const { text } = req.body;

        if (!req.user || req.user.username != username) {
            throw new Error('Not authenticated');
        }

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
        res.status(400).json(error);
    }
})

postRouter.put('/:_id/update', async (req, res) => {
    try {
        const { _id } = req.params;
        const { text } = req.body;

        if (req.user == null) {
            throw Error('Not authenticated');
        }

        const previousPost = await Post.findOneAndUpdate(
            { _id: _id, createdBy: req.user.username },
            { text: text }
        )

        if (previousPost == null) {
            throw Error('Unable to update post. Make sure you are authenticated as post owner to edit post');
        }

        res.status(200).json(previousPost);
    } catch (error) {
        res.status(400).json(error);
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