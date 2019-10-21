const express = require('express')
const connectDB = require('../src/db/connect')

const userRounter = require('./routers/users')
const taskRounter = require('./routers/tasks')

connectDB()

const app = express()

app.use(express.json())
app.use(userRounter)
app.use(taskRounter)

module.exports = app