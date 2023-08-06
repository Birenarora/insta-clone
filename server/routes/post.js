const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const PostModel = require('../models/posts')
const authMiddleware = require('../middlewares/authLogin')
const getResponse = require('../utils/responseBody')

router.post('/create-post', authMiddleware, (req, res) => {
    const { title, body } = req.body

    if (!title || !body) {
        return res.status(422).json(getResponse(422, 'Failed', 'Please add all the fields', {}))
    }

    req.user.password = undefined
    const post = new PostModel({
        title,
        body,
        postedBy: req.user
    })

    post.save()
    .then((post) => {
        res.status(200).json(getResponse(200, 'Success', 'Post Created Successfully!', post))
    })
    .catch((e) => {
        console.log(e.message);
    })
})

router.get('/posts', authMiddleware, (req, res) => {
    PostModel
    .find()
    .populate('postedBy', '_id name')
    .then((posts) => {
        res.status(200).json(getResponse(200, 'Success', 'Posts Fetched Successfully!', posts))
    })
    .catch((e) => {
        console.log(e.message);
    })
})

// router.get('/posts/:id', authMiddleware, (req, res) => {

// })

router.get('/myposts', authMiddleware, (req, res) => {
    PostModel
    .find({ postedBy: req.user._id })
    .populate('postedBy', '_id name')
    .then((posts) => {
        res.status(200).json(getResponse(200, 'Success', 'Post Fetched Successfully!', posts))
    })
    .catch((e) => {
        console.log(e.message);
    })

})

module.exports = router