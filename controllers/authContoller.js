const User = require('../models/User')
const jwt = require('jsonwebtoken')

// Handle errors:
const handleErrors = (err) => {
  const errors = {}
  // first check the email is unique:
  if (err.code === 11000) {
    errors.usedEmail = 'that email is already used'
    return errors
  }
  if (
    err.message === 'incorrect email' ||
    err.message === 'incorrect password'
  ) {
    errors.loginErr = err.message
  }
  // second check the other properties:
  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      // create an array of the object values
      errors[properties.path] = properties.message
    })
  }
  return errors
}

const maxAge = 3 * 24 * 60 * 60 // 3 days in seconds
const createToken = (id) => {
  return jwt.sign({ id }, 'my life secret', { expiresIn: maxAge }) // 1st arg is the payload , 2nd is secret, 3rd is valid for how long?
}

//!Signup controllers:
// get signup page:
module.exports.signup_get = (req, res) => {
  res.render('signup')
}
// add user to db:
module.exports.signup_post = async (req, res) => {
  try {
    const user = await User.create({
      email: req.body.email,
      password: req.body.password,
    })
    // once the user is created we should create a jwt
    const token = createToken(user._id) // create the token
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
    res.status(201).json({ user: user._id }) // send it back as json to the client
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({ errors })
  }
}

//! Login Controllers:
// get the login page:
module.exports.login_get = (req, res) => {
  res.render('login')
}

// compare user credentials
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.login(email, password)
    const token = createToken(user._id)
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
    res.status(200).json({ user: user._id })
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({ errors }) // share the errors with the front end
  }
}

module.exports.logout_get = async (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 }) // as we can't directly delete a cookie from the browser, we will instead replace it with '' and give it a very short maxAge
  res.redirect('/')
}
module.exports.logout_post = async (req, res) => {}
