const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    likes: [
        {
            type: ObjectId,
            ref: 'User'
        }
    ],
    likes_count_visibility: {
        type: Boolean,
        default: true
    },
    comments: [{
        text: String,
        commentedBy: {
            type: ObjectId,
            ref: 'User'
        },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: null }
    }],
    commenting_visibility: {
        type: Boolean,
        default: true
    },
    postedBy: {
        type: ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Posts', postSchema)