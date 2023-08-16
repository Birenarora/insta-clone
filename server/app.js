const express = require('express')
require('dotenv').config();
require('./mongoDatabase')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/post')
const userRoute = require('./routes/user')

const app = express()
const port = process.env.PORT || 5050

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(authRoute)
app.use(postRoute)
app.use(userRoute)

app.listen(port, () => {
    console.log('Server listening at', port);
})