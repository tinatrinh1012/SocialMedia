import express from 'express';
import { passport } from '../passport.js';

const authRouter = express.Router();

authRouter.post('/login', passport.authenticate('local',
    {
        successRedirect: '/',
        failureRedirect: '/login'
    },
    (err, user) => {
        console.log(user);
    }
))

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