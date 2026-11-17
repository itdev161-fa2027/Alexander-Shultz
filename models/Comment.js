import mongoose from 'mongoose';
const CommentSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    createDate: {
        type: Date,
        default: Date.now,
    },
});
const Comment = mongoose.model('Comment', CommentSchema);
export default Comment;