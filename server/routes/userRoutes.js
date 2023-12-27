import express from "express";
import User from '../models/User.js';

const userRouter = express.Router();

userRouter.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

userRouter.post('/create', async (req, res) => {
    try {
        const { username, firstName, lastName } = req.body;
        const newUser = new User({
            username: username,
            firstName: firstName,
            lastName: lastName
        });
        await newUser.save();
        const createdUser = await User.find({ username: username });
        res.status(201).json(createdUser);
    } catch (error) {
        if (error.code === 11000) { // duplicate username
            res.status(405).json({ error: error.message });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
})

userRouter.put('/:username/updateProfile', async (req, res) => {
    try {
        const { username } = req.params;
        const { firstName, lastName } = req.body;
        const modifiedUser = await User.findOneAndUpdate(
            { username: username },
            {
                firstName: firstName,
                lastName: lastName
            },
            { new: true }
        )

        if (modifiedUser == null) {
            res.status(406).json({error: `No document found for username ${username}`})
        }
        res.status(200).json(modifiedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

export default userRouter;