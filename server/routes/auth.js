const express = require('express')

const router = express.Router()
const UserModel = require('../models/users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middlewares/authLogin')
const { JWT_SECRET } = require('../config/keys')
const nodemailer = require('nodemailer')
const sendGridTransport = require('nodemailer-sendgrid-transport')
const crypto = require('crypto')

const transporter = nodemailer.createTransport({
    auth: {
        api_key: ''
    }
})

router.post('/signup', (req,res) => {
    const { name, email, password } = req.body

    if (!email || !password || !name) {
        return res.status(422).json({
            "statusCode": 422,
            "status": "Failed",
            "message": "Please provide all the details"
        })
    }

    UserModel.findOne({email: email})
    .then((user) => {
        if (user) {
            return res.status(422).json({
                "statusCode": 422,
                "status": "Success",
                "message": "User already exists with this email!"
            })
        }

        bcrypt.hash(password, 15)
        .then((hashedPass) => {
            const newUser = new UserModel({
                email,
                password: hashedPass,
                name
            })
    
            newUser.save()
            .then((user) => {
                transporter.sendMail({
                    to: user.email,
                    from: 'no-reply@insta-clone',
                    subject: 'Registration Successful',
                    html: '<h1>Welcome to Insta-Clone</h1>'
                })
                res.status(200).json({
                    "statusCode": 200,
                    "status": "Success",
                    "message": "Registered Sucessfully!"
                })
            })
            .catch((e) => {
                console.log(e.message);
            })
        })
    })
    .catch((e) => {
        console.log(e.message);
    })
})

router.post('/signin', (req,res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(422).json({
            "statusCode": 422,
            "status": "Failed",
            "message": "Please email or password!"
        })
    }

    UserModel.findOne({email: email})
    .then((user) => {
        if (!user) {
            return res.status(422).json({
                "statusCode": 422,
                "status": "Failed",
                "message": "Invalid email or password!"
            })
        }

        bcrypt.compare(password, user.password)
        .then((matches) => {
            if (matches) {
                // res.status(200).json({
                //     "statusCode": 200,
                //     "status": "Success",
                //     "message": "Signin Sucessfully!"
                // })

                const jwt_token = jwt.sign({_id: user._id}, process.env.JWT_SECRET || JWT_SECRET)
                const { _id, name, email, profile_pic, followers, following } = user
                res.json({token: jwt_token, user: { _id, name, email, profile_pic, followers, following }})
            } else {
                return res.status(200).json({
                    "statusCode": 422,
                    "status": "Failed",
                    "message": "Invalid email or password!"
                })
            }
        })
        .catch((e) => {
            console.log(e.message);
        })
    })
})

router.post('/reset-password', (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            return console.log(err);
        }
        const token = buffer.toString('hex')
        UserModel
        .findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res.status(422).json(getResponse(422, 'Failed', "User doesn't exists with this email.", data))
            }

            user.resetToken = token
            user.expireToken = Date.now() + 3600000
            user
            .save()
            .then((res) => {
                transporter.sendMail({
                    to: user.email,
                    from: 'no-reply@instal-clone',
                    subject: 'Reset Password',
                    html: `
                    <p>You requested for password reset</p>
                    <h5>Click on this <a href="http://localhost:3000/reset/${token}">link</a> to reset the password.</h5>
                    `
                })
                res.status(200).json({
                    "statusCode": 200,
                    "status": "Success",
                    "message": "Check your mail!"
                })
            })
        })
        .catch((e) => {
            console.log(e.message);
        })
    })
})

router.post('/new-password', (req, res) => {
    const newPassword = req.body.password
    const sentToken = req.body.token

    UserModel
    .findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
    .then((user) => {
        if (!user) {
            return res.status(422).json(getResponse(422, 'Failed', "Try again, session expired."))
        }

        bcrypt
        .hash(newPassword, 32)
        .then((newpass) => {
            user.password = newpass
            user.resetToken = null
            user.expireToken = null

            user
            .save()
            .then((savedUser) => {
                res.status(200).json({
                    "statusCode": 200,
                    "status": "Success",
                    "message": "Password Updated Successfully!"
                })
            })
        })
        .catch((e) => {
            console.log(e.message);
        })
    })
    .catch((e) => {
        console.log(e.message);
    })
})

module.exports = router