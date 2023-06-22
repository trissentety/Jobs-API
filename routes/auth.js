const express = require('express')
const router = express.Router()

const {login, register} = require('../controllers/auth') //import names from controllers

router.post('/register', register) //pass in controller to invoke domain/api/v1/auth/register
router.post('/login', login) //domain/api/v1/auth/login

module.exports = router