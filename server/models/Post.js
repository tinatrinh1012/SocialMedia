import { ObjectId } from 'mongodb';
import { mongoose } from '../database.js';

const postSchema = new mongoose.Schema(
    {
        _id: ObjectId,
        createdBy: String,
        text: String,
        likes: Number
    },
    { collection: 'Posts' }
);

const Post = mongoose.model('Post', postSchema);

export default Post;