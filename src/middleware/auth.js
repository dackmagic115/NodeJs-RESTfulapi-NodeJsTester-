const jwt = require('jsonwebtoken')
const User = require('../models/users')

const auth = async (req , res , next ) => {    
    console.log('auth middleware')

    try {
        const token = req.header('Authorization').replace('Bearer ','')
        const decode = jwt.verify(token , 'jwtAuth')
        console.log('ID:' , decode._id)
        console.log('TOKEN:' , token)

        const user = await User.findOne({_id:decode._id, 'tokens.token': token})

        if(!user){
            throw new Error()
        }
        req.user = user
        req.token = token
        next()

    } catch (error) {
        res.status(401).send({ error : 'Please authenticate.' })
    }


} 

module.exports = auth