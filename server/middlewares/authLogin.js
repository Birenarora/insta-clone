const jwt = require('jsonwebtoken')
const UserModel = require('../models/users')

module.exports = (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({
            "statusCode": 401,
            "status": "Failed",
            "message": "You must be logged in!"
        })
    }

    const token = authorization.replace("Bearer ", "")

    jwt.verify(token, process.env.JWT_SECRET, (error, payload) => {
        if (error) {
            return res.status(401).json({
                "statusCode": 401,
                "status": "Failed",
                "message": "Invalid token!"
            })
        }

        const { _id } = payload
        UserModel.findById(_id)
        .then((user) => {
            req.user = user
            next()
        })
    })
}