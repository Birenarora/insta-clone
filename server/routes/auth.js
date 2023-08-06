const express = require('express')

const router = express.Router()
const UserModel = require('../models/users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middlewares/authLogin')

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

                const jwt_token = jwt.sign({_id: user._id}, process.env.JWT_SECRET)
                res.json({token: jwt_token})
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

module.exports = router