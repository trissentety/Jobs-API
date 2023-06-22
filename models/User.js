const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'], //also write all lowercase "minlength" & "maxlength"
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: [true, 'Please provide email'], //also write all lowercase "minlength" & "maxlength"
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide valid email' ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide password'], //, error msg
        minlength: 6,
        //maxlength: 12, //remove later once hash password
    },
})

UserSchema.pre('save', async function(){ //pre executes one function middleware after another with next function(next)
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)//points to document, before saving password hash document
    //next()
}) //presave, use old function keyword value because it will be scoped to document or point to document. Arrow function has different set of rules.

UserSchema.methods.createJWT = function () { //custom name
    return jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME,})
}

UserSchema.methods.comparePassword = async function (candidatePassword) { //custom name candidatePassword
    const isMatch = await bcrypt.compare(candidatePassword, this.password) //compare password coming in to req ,this.password saved in database
    return isMatch
}

//UserSchema.methods.getName = function () {
//    return this.name
//}

module.exports = mongoose.model('User', UserSchema) //name, UserSchema