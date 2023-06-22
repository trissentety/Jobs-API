const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')


const auth = async (req, res, next) => {
    //check header
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer')) {
        throw new UnauthenticatedError('Authentication invalid')
    }
    const token = authHeader.split(' ')[1] //second value after split

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        //attach user to job routes

        const user = User.findById(payload.id).select('-password') //id from token, select to remove password to not pass it
        req.user = user

        req.user = {userId:payload.userId, name: payload.name}
        next()
    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid')
    }
}

module.exports = auth