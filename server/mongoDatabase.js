const mongoose = require('mongoose')
require('dotenv').config()
const { DATABASE_URL } = require('./config/keys')

const mongoString = process.env.DATABASE_URL || DATABASE_URL

mongoose.connect(mongoString)

const database = mongoose.connection

database.on('error', (error) => {
    console.log(error);
})

database.once('connected', () => {
    console.log('Database connected!');
})