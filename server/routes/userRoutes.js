import express from "express";
import User from '../models/User.js';

const userRouter = express.Router();

userRouter.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
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

userRouter.put('/updateProfile', async (req, res) => {
    try {
        const { username, firstName, lastName } = req.body;
        const modifiedUser = await User.findOneAndUpdate(
            { username: username },
            {
                firstName: firstName,
                lastName: lastName
            },
            { new: true }
        )
        res.status(200).json(modifiedUser);
    } catch (error) {
        console.error(error);
    }
})

export default userRouter;