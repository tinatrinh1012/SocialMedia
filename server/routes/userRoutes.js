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
        res.status(400).json(error);
    }
})

userRouter.get('/:username/profile', async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username: username });
        if (user == null) {
            throw new Error(`No document found for username ${username}`);
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
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
            throw new Error(`No document found for username ${username}`);
        }
        res.status(200).json(modifiedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

userRouter.get('/:username/following', async (req, res) => {
    try {
        const { username } = req.params;
        const pipeline = [
            { $match: { username: username } },
            { $lookup:
                {
                    from: 'Users',
                    localField: 'following',
                    foreignField: 'username',
                    as: 'aggregatedFollowing'
                }
            }
        ]
        const aggregatedUsers = await User.aggregate(pipeline);
        res.status(200).json(aggregatedUsers[0].aggregatedFollowing);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

userRouter.put('/:username/friends/add', async (req, res) => {
    try {
        const { username } = req.params;
        const { friend } = req.body;
        const user = await User.findOne({username: username});

        if (user.following.includes(friend)) {
            throw new Error("Unable to add friend, this user is already a friend");
        }
        user.following.push(friend);
        await user.save();
        return res.status(200).json({message: "Added friend successfully"})
    } catch (error) {
        return res.status(400).json(error);
    }
})

userRouter.put('/:username/friends/remove', async (req, res) => {
    try {
        const { username } = req.params;
        const { friend } = req.body;
        const user = await User.findOne({username: username});

        if (!user.following.includes(friend)) {
            throw new Error("Unable to remove friend, this user is currently not a friend");
        }
        user.following = user.following.filter(f => f !== friend);
        await user.save();
        return res.status(200).json({message: "Removed friend successfully"})
    } catch (error) {
        return res.status(400).json(error);
    }
})

export default userRouter;