import express from 'express';
import { connectDB } from './database.js';
import userRouter from './routes/userRoutes.js';

const app = express();
const port = 3000;

// Set up routes
app.use('/users', userRouter);

// Start the server
app.listen(port, () => {
    connectDB();
    console.log(`Server is running at http://localhost:${port}`);
});