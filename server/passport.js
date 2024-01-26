import passport from 'passport';
import LocalStrategy from 'passport-local';
import crypto from 'crypto';
import User from './models/User.js';

// TODO: understand password verification process
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

passport.serializeUser((user, done) => {
    console.log('serialize user...');
    done(null, user.username);
})

passport.deserializeUser(async (username, done) => {
    console.log('deserialize user...');
    try {
        const user = await User.findOne({ username: username });
        done(null, user);
    } catch (error) {
        done(error);
    }
})

export { passport }