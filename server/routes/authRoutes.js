import express from 'express';
import { passport } from '../passport.js';
import crypto from 'crypto';
import User from '../models/User.js';

const authRouter = express.Router();

authRouter.post('/login', (req, res) => {
    console.log('/login');
    passport.authenticate('local', (err, user, info, status) => {
        if (err) {
            res.status(400).json(err);
        }
        if (!user) {
            res.status(400).json({ error: 'Invalid username or password' })
        }
        req.login(user, (err) => {
            if (err) {
                res.status(400).json({ error: 'Login failed' });
            }
            res.status(200).json({ success: 'User authenticated' });
        });
    })(req, res);
})

authRouter.post('/logout', (req, res) => {
    console.log('/logout');
    req.logout((err) => {
        if (err) {
            res.status(400).json(err);
        }
        res.status(200).json({ success: 'Logged out successful' });
    })
})

authRouter.post('/signup', async (req, res) => {
    try {
        const salt = crypto.randomBytes(16);
        const hashed_password = crypto.pbkdf2Sync(req.body.password, salt, 310000, 32, 'sha256');
        await User.create({
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            hashed_password: hashed_password,
            salt: salt
        })
        const user = { username: req.body.username };
        req.login(user, (err) => {
            if (err) {
                throw Error('Error loggin in')
            }
            res.status(200).json({ message: 'New user sign up successful' });
        })
    } catch (error) {
        res.status(400).json(error);
    }
})

authRouter.get('/current-user', (req, res) => {
    if (req.user) {
        res.status(200).json(req.user);
    } else {
        res.status(400).json({ error: 'Not authenticated' })
    }
})

export default authRouter;
