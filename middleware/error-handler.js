const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, //||500, use error status code if not use INTERNAL
    msg: err.message || 'Something went wrong try again' //err.message or for msg
  }

  //if (err instanceof CustomAPIError) {
  //  return res.status(err.statusCode).json({ msg: err.message })
  //}

  if(err.name === 'ValidationError'){
    //console.log(Object.values(err.errors))
    customError.msg = Object.values(err.errors).map((item) => item.message).join(',') //err object has errors object with password and email keys, turned into array mapped over, join with comma inbetween
    customError.statusCode = 400 //bad req, "Please provide password, Please provide email"
  }

  if(err.code && err.code === 11000) { // "err", "code": 11000,
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value` //keyValue is object. Object.keys(err.keyValue) is email
    customError.statusCode = 400 //bad req
  }
  if(err.name === 'CastError') {
    customError.msg = `No item found with id : ${err.value}` //same as _id provided, value property in error with id
    customError.statusCode = 404
  }
  //return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err }) //500
  return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
