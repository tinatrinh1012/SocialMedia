import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './database.js';
import userRouter from './routes/userRoutes.js';
import bodyParser from 'body-parser';
import postRouter from './routes/postRoutes.js';

// Load environment variables
dotenv.config({ path: "./config.env" });

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT;

// Set up routes
app.use('/users', userRouter);
app.use('/posts', postRouter);

// Start the server
app.listen(port, () => {
    connectDB();
    console.log(`Server is running at http://localhost:${port}`);
});