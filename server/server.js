require('dotenv').config({ path: "./config.env" });
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection
const mongoURI = process.env.ATLAS_URI;
const mongoClient = new MongoClient(mongoURI);

// Connect to MongoDB
async function connectDB() {
    try {
        await mongoClient.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(error);
    }
}

// Define a route
app.get('/', async (req, res) => {
    const database = mongoClient.db("App");
    const collection = database.collection("Users");
    const cursor = collection.find({});
    const users = await cursor.toArray();
    res.status(200).json(users);
});

// Start the server
app.listen(port, () => {
    connectDB();
    console.log(`Server is running at http://localhost:${port}`);
});