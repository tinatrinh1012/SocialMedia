import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config({ path: "./config.env" });

// MongoDB connection
const mongoURI = process.env.ATLAS_URI;
const mongoClient = new MongoClient(mongoURI);

// Connect to MongoDB
export async function connectDB() {
    try {
        await mongoClient.connect();
        console.log("Connected to MongoDB");

        await mongoose.connect(mongoURI, { dbName: 'App' });
        console.log("Mongoose connected");
    } catch (error) {
        console.error(error);
    }
}

export { mongoClient, mongoose };