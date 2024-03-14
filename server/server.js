import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './database.js';
import userRouter from './routes/userRoutes.js';
import bodyParser from 'body-parser';
import postRouter from './routes/postRoutes.js';
import cors from 'cors';
import commentRouter from './routes/commentRoutes.js';
import authRouter from './routes/authRoutes.js';
import { passport } from './passport.js';
import session from 'express-session';

const app = express();
app.use(bodyParser.json());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_DOMAIN
}));

// Load environment variables
dotenv.config({ path: "./config.env" });
const port = process.env.PORT;

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1800000,
        secure: app.get('env') === 'production' ? true : false
    }
}))

app.use(passport.initialize());
app.use(passport.session());

// Set up routes
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);

// Start the server
app.listen(port, () => {
    connectDB();
    console.log(`Server is running at ${process.env.CLIENT_DOMAIN}`);
});