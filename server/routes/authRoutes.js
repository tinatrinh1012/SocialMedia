import express from 'express';
import { passport } from '../passport.js';

const authRouter = express.Router();

authRouter.post('/login', (req, res) => {
    passport.authenticate('local', (err, user, info, status) => {
        console.log(user);
        if (err) {
            res.status(400).json(err);
        }
        if (!user) {
            res.status(400).json({ error: 'Invalid username or password' })
        }
        res.status(200).json({ success: 'User authenticated' });
    })(req, res);
})

export default authRouter;

// const salt = crypto.randomBytes(16);
// const hashed_password = crypto.pbkdf2Sync('letmein', salt, 310000, 32, 'sha256');
// const username = 'alice';
// User.create({
//     username: username,
//     firstName: 'Alice',
//     lastName: 'Johnson',
//     hashed_password: hashed_password,
//     salt: salt
// })