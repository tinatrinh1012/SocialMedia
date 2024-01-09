import { ObjectId } from 'mongodb';
import { mongoose } from '../database.js';

const postSchema = new mongoose.Schema(
    {
        createdBy: String,
        text: String,
        likes: Number
    },
    { collection: 'Posts' }
);

const Post = mongoose.model('Post', postSchema);

export default Post;