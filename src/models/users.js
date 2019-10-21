const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Task = require('./tasks')

const Schema = mongoose.Schema

const userSchema = new Schema({
    name : {
        type: String,
        required: true,
        trim : true
    },
    email:{
        type:String,
        required: true,
        trim: true,
        lowercase : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password:{
        type: String,
        required: true,
        minlength:7,
        trim : true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error('Age must be a positive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String , 
            required: true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})

userSchema.virtual('tasks',{
    ref: 'Task',
    localField:'_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function (){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.methods.genarateAuthToken = async function () {
    const user = this 
    console.log(user._id)
    const token = jwt.sign({ _id : user._id.toString() } , 'jwtAuth')

    user.tokens = user.tokens.concat({token : token})
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email , password) => {
    const user = await User.findOne({ email })

    if(!user){
        throw new Error('ไม่สามารถล็อคอิน กรุณากรอกข้อมูลให้ถูกต้อง')
    }

    const match = await bcrypt.compare(password  , user.password)

    if(!match){
        throw new Error('ไม่สามารถล็อคอิน กรุณากรอกข้อมูลให้ถูกต้อง')
    }

    console.log(user)

    return user
}

userSchema.pre('save' , async function (next) {
    const user = this 

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password , 8)
    }
    
    next()
})

userSchema.pre('remove' , async function (next){
    const user  = this 
    await Task.deleteMany({owner : user._id})
    next()
})

const User = mongoose.model('User' , userSchema )

module.exports = User