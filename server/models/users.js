const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profile_pic: {
        type: String,
        default: 'https://res.cloudinary.com/dusrilpky/image/upload/v1692138919/profile_placeholder_m4d4h8.jpg'
    },
    resetToken: String,
    expireToken: Date,
    followers: [
        {
            type: ObjectId,
            ref: 'User'
        }
    ],
    following: [
        {
            type: ObjectId,
            ref: 'User'
        }
    ],
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)