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

userRouter.put('/:username/following/add', async (req, res) => {
    try {
        const { username } = req.params;
        const { followingUsername } = req.body;
        const user = await User.findOne({ username: username });

        if (user.following.includes(followingUsername)) {
            throw new Error("You already follow this user");
        }
        user.following.push(followingUsername);
        await user.save();
        return res.status(200).json({message: "Follow user successfully"})
    } catch (error) {
        return res.status(400).json(error);
    }
})

userRouter.put('/:username/following/remove', async (req, res) => {
    try {
        const { username } = req.params;
        const { followingUsername } = req.body;
        const user = await User.findOne({ username: username });

        if (!user.following.includes(followingUsername)) {
            throw new Error("You're currently not following this user");
        }
        user.following = user.following.filter(f => f !== followingUsername);
        await user.save();
        return res.status(200).json({message: "Unfollow user successfully"})
    } catch (error) {
        return res.status(400).json(error);
    }
})

export default userRouter;