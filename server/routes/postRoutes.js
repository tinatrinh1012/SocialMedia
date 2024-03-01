import express from 'express';
import Post from '../models/Post.js';

const postRouter = express.Router();

postRouter.get('/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const posts = await Post.find({ createdBy: username }).sort({ createdAt: -1 });
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
})

postRouter.get('/', async (req, res) => {
    try {
        const { _id } = req.query;
        const post = await Post.findById(_id);
        return res.status(200).json(post);
    } catch (error) {
        return res.status(400).json({ error: error.message });
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
            likes: []
        });
        return res.status(201).json(createdPost);
    } catch (error) {
        return res.status(400).json(error);
    }
})

postRouter.put('/:_id/update', async (req, res) => {
    try {
        const { _id } = req.params;
        const { text } = req.body;

        if (req.user == null) {
            throw Error('Not authenticated');
        }

        const updatedPost = await Post.findOneAndUpdate(
            { _id: _id, createdBy: req.user.username },
            { text: text },
            { returnDocument: 'after' }
        )

        if (updatedPost == null) {
            throw Error('Unable to update post. Make sure you are authenticated as post owner to edit post');
        }

        return res.status(200).json(updatedPost);
    } catch (error) {
        return res.status(400).json(error);
    }
})

// TODO: should also delete post comments
postRouter.delete('/:_id/delete', async (req, res) => {
    try {
        const { _id } = req.params;
        await Post.findOneAndDelete({ _id: _id })
        return res.status(200).json({ message: "Successfully deleted post" })
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
})

postRouter.put('/:_id/like', async (req, res) => {
    try {
        const { _id } = req.params;

        if (req.user == null) {
            throw Error('Not authenticated');
        }

        let post = await Post.findById(_id);
        post.likes.push(req.user.username);
        await post.save();

        return res.status(200).json({ message: 'Liked post successfully' });
    } catch (error) {
        return res.status(400).json(error);
    }
})

postRouter.put('/:_id/unlike', async (req, res) => {
    try {
        const { _id } = req.params;

        if (req.user == null) {
            throw Error('Not authenticated');
        }

        let post = await Post.findById(_id);
        post.likes = post.likes.filter(username => username !== req.user.username);
        await post.save();

        return res.status(200).json({ message: 'Unliked post successfully' });
    } catch (error) {
        return res.status(400).json(error);
    }
})

export default postRouter;