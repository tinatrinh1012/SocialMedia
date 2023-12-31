import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './database.js';
import userRouter from './routes/userRoutes.js';
import bodyParser from 'body-parser';
import postRouter from './routes/postRoutes.js';
import cors from 'cors';
import commentRouter from './routes/commentRoutes.js';

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Load environment variables
dotenv.config({ path: "./config.env" });
const port = process.env.PORT;

// Set up routes
app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);

// Start the server
app.listen(port, () => {
    connectDB();
    console.log(`Server is running at http://localhost:${port}`);
});