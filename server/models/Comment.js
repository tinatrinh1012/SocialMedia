import { ObjectId } from 'mongodb';
import { mongoose } from '../database.js';

const commentSchema = new mongoose.Schema(
    {
        text: String,
        postId: ObjectId,
        createdBy: String
    },
    { collection: 'Comments' }
)

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;