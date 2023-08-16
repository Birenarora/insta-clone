const express = require('express')
const router = express.Router()
const UserModel = require('../models/users')
const PostModel = require('../models/posts')
const authMiddleware = require('../middlewares/authLogin')
const getResponse = require('../utils/responseBody')

router.get('/user/:id', authMiddleware, (req, res) => {
    UserModel
    .findOne({ _id: req.params.id})
    .select('-password')
    .then((user) => {
        PostModel
        .find({ postedBy: req.params.id })
        .populate('postedBy', '_id name')
        .then((post) => {
            res.status(200).json(getResponse(200, 'Success', 'User Details Fetched Successfully.', {user, post}))
        })
        .catch((e) => {
            res.status(422).json(getResponse(422, 'Failed', e.message, {}))
        })
    })
    .catch((e) => {
        res.status(422).json(getResponse(404, 'Failed', 'User not found.', {}))
    })
})

// router.get('/user-shortdetails/:id', authMiddleware, (req, res) => {
//     UserModel
//     .findOne({ _id: req.params.id})
//     .select('_id name')
//     .then((user) => {
//         PostModel
//         .find({ postedBy: req.params.id })
//         // .sort({ createdAt: -1 })
//         .select('_id photo')
//         // .limit(3)
//         .then((post) => {
//             res.status(200).json(getResponse(200, 'Success', 'User Details Fetched Successfully.', {user, post}))
//         })
//         .catch((e) => {
//             res.status(422).json(getResponse(422, 'Failed', e.message, {}))
//         })
//     })
//     .catch((e) => {
//         res.status(422).json(getResponse(404, 'Failed', 'User not found.', {}))
//     })
// })

router.put('/follow', authMiddleware, (req, res) => {
    const userId = req.body.userId
    UserModel.findByIdAndUpdate(userId, {
        $push: {
            followers: req.user._id
        }
    }, {
        new: true
    })
    .then((data) => {
        UserModel.findByIdAndUpdate(req.user._id, {
            $push: {
                following: userId
            }
        }, {
            new: true
        })
        .select('-password')
        .then((data1) => {
            res.status(200).json(getResponse(200, 'Success', 'User Followed Succesfully.', data1))
        })
        .catch((e1) => {
            res.status(422).json(getResponse(422, 'Failed', e1.message, {}))
        })
    }).catch((e) => {
        res.status(422).json(getResponse(422, 'Failed', e.message, {}))
    })    
})

router.put('/unfollow', authMiddleware, (req, res) => {
    const userId = req.body.userId
    UserModel.findByIdAndUpdate(userId, {
        $pull: {
            followers: req.user._id
        }
    }, {
        new: true
    })
    .then((data) => {
        UserModel.findByIdAndUpdate(req.user._id, {
            $pull: {
                following: userId
            }
        }, {
            new: true
        })
        .select('-password')
        .then((data1) => {
            res.status(200).json(getResponse(200, 'Success', 'User UnFollowed Succesfully.', data1))
        })
        .catch((e1) => {
            res.status(422).json(getResponse(422, 'Failed', e1.message, {}))
        })
    }).catch((e) => {
        res.status(422).json(getResponse(422, 'Failed', e.message, {}))
    })    
})

router.put('/upload-profile-pic', authMiddleware, (req, res) => {
    const profilePic = req.body.profilePic
    UserModel.findByIdAndUpdate(req.user._id, {
        profile_pic: profilePic
    }, {
        new: true
    })
    .select('_id profile_pic')
    .then((data) => {
        res.status(200).json(getResponse(200, 'Success', 'Profile Pic Uploaded Successfully.', data))
    }).catch((err) => {
        res.status(422).json(getResponse(422, 'Failed', err.message, {}))
    })
})

router.get('/search/:name', authMiddleware, (req, res) => {
    UserModel
    .find({
        name: new RegExp(req.params.name, 'i')
    })
    .select('_id name email profile_pic followers')
    .then((users) => {
        if (users.length === 0) {
            return res.status(200).json(getResponse(200, 'Success', 'No users found.', {}))
        }
        res.status(200).json(getResponse(200, 'Success', 'Users Fetched Successfully.', users))
    })
    .catch((e) => {
        res.status(422).json(getResponse(422, 'Failed', e.message, {}))
    })
})

module.exports = router