const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/users')
const Task = require('../../src/models/tasks')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Mizuki',
    email: 'mizuki@example.com',
    password: '4646988',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, 'jwtAuth')
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Miona',
    email: 'Miona@example.com',
    password: '4646988',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, 'jwtAuth')
    }]
}

const taskOne = {
    _id : new mongoose.Types.ObjectId(),
    description: 'First task',
    completed: true,
    owner: userOne._id
}

const taskTwo = {
    _id : new mongoose.Types.ObjectId(),
    description: 'Second task',
    completed: false,
    owner: userTwo._id
}

const taskThree = {
    _id : new mongoose.Types.ObjectId(),
    description: 'Third task',
    completed: false,
    owner: userOne._id
}


const setupDatabase = async () =>{
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
}

