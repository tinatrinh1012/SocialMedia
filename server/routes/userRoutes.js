import express from "express";
import mongoClient from "../database.js";

const userRouter = express.Router();

userRouter.get('/', async (req, res) => {
    try {
        const database = mongoClient.db("App");
        const collection = database.collection("Users");
        const cursor = collection.find({});
        const users = await cursor.toArray();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
    }
})

export default userRouter;