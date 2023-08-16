const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const PostModel = require('../models/posts')
const authMiddleware = require('../middlewares/authLogin')
const getResponse = require('../utils/responseBody')

router.post('/create-post', authMiddleware, (req, res) => {
    const { title, body, photo } = req.body

    if (!title || !body || !photo) {
        return res.status(422).json(getResponse(422, 'Failed', 'Please add all the fields', {}))
    }

    req.user.password = undefined
    const post = new PostModel({
        title,
        body,
        photo,
        postedBy: req.user
    })

    post.save()
    .then((post) => {
        res.status(200).json(getResponse(200, 'Success', 'Post Created Successfully!', post))
    })
    .catch((e) => {
        res.status(422).json(getResponse(422, 'Failed', e.message, {}))
    })
})

router.get('/posts', authMiddleware, (req, res) => {
    PostModel
    .find()
    .sort('-createdAt')
    .populate('postedBy', '_id name email profile_pic followers following')
    .populate('comments.commentedBy', '_id name')
    .then((posts) => {
        res.status(200).json(getResponse(200, 'Success', 'Posts Fetched Successfully!', posts))
    })
    .catch((e) => {
        res.status(422).json(getResponse(422, 'Failed', e.message, {}))
    })
})

router.get('/myposts', authMiddleware, (req, res) => {
    PostModel
    .find({ postedBy: req.user._id })
    .sort('-createdAt')
    .populate('postedBy', '_id name')
    .populate('comments.commentedBy', '_id name email profile_pic followers following')
    .then((posts) => {
        res.status(200).json(getResponse(200, 'Success', 'Post Fetched Successfully!', posts))
    })
    .catch((e) => {
        res.status(422).json(getResponse(422, 'Failed', e.message, {}))
    })

})

router.put('/like', authMiddleware, (req, res) => {
    const postId = req.body.postId

    PostModel
    .find()
    .populate('postedBy', '_id name')
    .populate('comments.commentedBy', '_id name')
    .then((posts) => {

        let postAlreadyLiked = false;
        let postAlreadyLikedData = {}

        posts.forEach((value) => {
            if (postId.includes(value._id) && value.likes.includes(req.user._id)) {
                postAlreadyLiked = true
                postAlreadyLikedData = value
                return
            }
        })

        if (postAlreadyLiked) {
            res.status(200).json(getResponse(200, 'Success', 'Post Already Liked.', postAlreadyLikedData))
            return
        }

        PostModel.findByIdAndUpdate(postId, {
            $push: {
                likes: req.user._id
            }
        }, {
            new: true
        })
        .populate('postedBy', '_id name profile_pic followers following')
        .then((data) => {
            res.status(200).json(getResponse(200, 'Success', 'Post Liked.', data))
        }).catch((err) => {
            res.status(422).json(getResponse(422, 'Failed', err.message, {}))
        })
    })
    .catch((e) => {
        res.status(422).json(getResponse(422, 'Failed', e.message, {}))
    })
})

router.put('/unlike', authMiddleware, (req, res) => {
    const postId = req.body.postId
    PostModel.findByIdAndUpdate(postId, {
        $pull: {
            likes: req.user._id
        }
    }, {
        new: true
    })
    .populate('postedBy', '_id name profile_pic followers following')
    .populate('comments.commentedBy', '_id name')
    .then((data) => {
        res.status(200).json(getResponse(200, 'Success', 'Post Unliked.', data))
    }).catch((err) => {
        res.status(422).json(getResponse(422, 'Failed', err.message, {}))
    })
})

router.put('/create-comment', authMiddleware, (req, res) => {
    const { text, postId } = req.body
    PostModel.findByIdAndUpdate(postId, {
        $push: {
            comments: {
                text,
                commentedBy: req.user
            }
        }
    }, {
        new: true
    })
    .populate('postedBy', '_id name')
    .populate('comments.commentedBy', '_id name')
    .then((data) => {
        res.status(200).json(getResponse(200, 'Success', 'Comment Created Successfully..', data))
    }).catch((err) => {
        res.status(422).json(getResponse(422, 'Failed', err.message, {}))
    })
})

router.delete('/delete-post/:postId', authMiddleware, (req, res) => {
    // to delete image from cloudinary, append imgPublicId with postId in params,
    // then here split it & perform both the deletions separately as cloudinary api needs
    // api_key to send with destroy api
    PostModel.findOne({
        _id: req.params.postId
    })
    .populate('postedBy', '_id')
    .then((post) => {
        if (post.postedBy._id.toString() === req.user._id.toString()) {
            post.deleteOne()
            .then((data) => {
                res.status(200).json(getResponse(200, 'Success', 'Post Deleted Successfully.', data))
            })
            .catch((e) => {
                res.status(422).json(getResponse(422, 'Failed', e.message, {}))
            })
        } else {
            res.status(403).json(getResponse(422, 'Forbidden', 'You are not authorized to delete this post.', {}))
        }
    })
    .catch((e) => {
        res.status(422).json(getResponse(422, 'Failed', e.message, {}))
    })
})

router.put('/likes-count-toggle', authMiddleware, (req, res) => {
    const postId = req.body.postId
    const value = req.body.value

    PostModel.findOne({
        _id: postId
    })
    .populate('postedBy', '_id')
    .then((post) => {
        if (post.postedBy._id.toString() === req.user._id.toString()) {
            // post.updateOne({
            //     likes_count_visibility: value
            // })
            // .populate('postedBy', '_id name')
            // .populate('comments.commentedBy', '_id name')
            // .then((data) => {
            //     res.status(200).json(getResponse(200, 'Success', 'Likes Count Visibility Updated.', data))
            // })
            // .catch((e) => {
            //     res.status(422).json(getResponse(422, 'Failed', e.message, {}))
            // })

            PostModel.findByIdAndUpdate(post._id, {
                likes_count_visibility: value
            }, {
                new: true
            })
            .populate('postedBy', '_id name')
            .populate('comments.commentedBy', '_id name')
            .then((data) => {
                res.status(200).json(getResponse(200, 'Success', 'Likes Count Visibility Updated.', data))
            }).catch((err) => {
                res.status(422).json(getResponse(422, 'Failed', err.message, {}))
            })
        } else {
            res.status(403).json(getResponse(422, 'Forbidden', 'You are not authorized to delete this post.', {}))
        }
    })
    .catch((e) => {
        res.status(422).json(getResponse(422, 'Failed', e.message, {}))
    })
    // PostModel.findByIdAndUpdate(postId, {
    //     likes_count_visibility: value
    // }, {
    //     new: true
    // })
    // .populate('postedBy', '_id name')
    // .populate('comments.commentedBy', '_id name')
    // .then((data) => {
    //     res.status(200).json(getResponse(200, 'Success', 'Likes Count Visibility Updated.', data))
    // }).catch((err) => {
    //     res.status(422).json(getResponse(422, 'Failed', err.message, {}))
    // })
})

router.put('/commenting-toggle', authMiddleware, (req, res) => {
    const postId = req.body.postId
    const value = req.body.value

    PostModel.findOne({
        _id: postId
    })
    .populate('postedBy', '_id')
    .then((post) => {
        if (post.postedBy._id.toString() === req.user._id.toString()) {
            PostModel.findByIdAndUpdate(post._id, {
                commenting_visibility: value
            }, {
                new: true
            })
            .populate('postedBy', '_id name')
            .populate('comments.commentedBy', '_id name')
            .then((data) => {
                res.status(200).json(getResponse(200, 'Success', 'Commenting Visibility Updated.', data))
            }).catch((err) => {
                res.status(422).json(getResponse(422, 'Failed', err.message, {}))
            })
        } else {
            res.status(403).json(getResponse(422, 'Forbidden', 'You are not authorized to delete this post.', {}))
        }
    })
    .catch((e) => {
        res.status(422).json(getResponse(422, 'Failed', e.message, {}))
    })
})

module.exports = router