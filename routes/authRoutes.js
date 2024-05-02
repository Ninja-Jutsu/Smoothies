const express = require('express')
const router = express.Router() // or const {Router} = require('express') then router = Router()
const authController = require('../controllers/authContoller')

// get the signup page
router.get('/signup', authController.signup_get)
// Add user to db
router.post('/signup', authController.signup_post)
// get the login page
router.get('/login', authController.login_get)
// login to the page
router.post('/login', authController.login_post) 

router.get('/logout', authController.logout_get);



module.exports = router
