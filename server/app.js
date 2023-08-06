const express = require('express')
require('dotenv').config();
require('./mongoDatabase')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/post')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(authRoute)
app.use(postRoute)

app.listen(port, () => {
    console.log('Server listening at', port);
})