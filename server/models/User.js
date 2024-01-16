import { mongoose } from '../database.js';

const userSchema = new mongoose.Schema(
    {
        username: { type: String, unique: true },
        firstName: String,
        lastName: String,
        friends: [String],
        hashed_password: Buffer,
        salt: Buffer
    },
    { collection: 'Users' }
);

const User = mongoose.model('User', userSchema);

export default User;