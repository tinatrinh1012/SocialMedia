import { mongoose } from '../database.js';

const postSchema = new mongoose.Schema(
    {
        createdBy: String,
        text: String
    },
    { collection: 'Posts' }
);

const Post = mongoose.model('Post', postSchema);

export default Post;