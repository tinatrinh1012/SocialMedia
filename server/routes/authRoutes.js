import express from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import crypto from 'crypto';
import User from '../models/User.js';

const authRouter = express.Router();

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({ username: username });

        if (!user) {
            return done(null, false, { message: 'Incorrect username or password.' });
        }

        crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', (err, hashedPassword) => {
            if (err) {
                return done(err);
            }

            if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
                return done(null, false, { message: 'Incorrect username or password.' });
            }

            return done(null, user);
         })
    } catch (error) {
        return done(error);
    }
}))

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


authRouter.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}))

export default authRouter;