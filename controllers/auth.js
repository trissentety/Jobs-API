
const User = require('../models/User') 
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors')
//const bcrypt = require('bcryptjs')

//const jwt = require('jsonwebtoken')

const register = async (req, res) => {

    //const {name, email, password} = req.body

    //const salt = await bcrypt.genSalt(10); //random bytes in number of rounds(10) number of random bytes, bigger number = more random bytes got and more secure password will be, more rounds also means more processing power, 10 is default which is very secure
    //const hashedPassword = await bcrypt.hash(password, salt) //password to hash, random bytes, .hash method, looks for password to hash, once both values are provided results in hashed password which can be safely stored in db by adding to user

    //const tempUser = {name, email, password: hashedPassword} //es6, instead of directly using password 
//    const {name, email, password} = req.body
//    if (!name || !email || !password){
//        throw new BadRequestError('Please provide name, email and password')
//    }
    const user = await User.create({ ...req.body })//({ ...req.body }) //so mongoose does all validation
    const token = user.createJWT()
    //const token = jwt.sign({userId: user._id, name: user.name}, 'jwtSecret', {
    //    expiresIn: '30d',
    //})
    res.status(StatusCodes.CREATED).json({ user: {name: user.name}, token }) //creating resource 201, ({ user }) 
    //res.send('register user')
}
const login = async (req, res) => {
    const {email, password} = req.body

    if(!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }
    const user = await User.findOne({email})
    if(!user) {
        throw new UnauthenticatedError('Invalid Credentials')
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials')
    }
    // compare password
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({user: {name: user.name}, token })//more things to send besides token


    //res.send(' login user')
}

module.exports = {
    register,
    login,
}