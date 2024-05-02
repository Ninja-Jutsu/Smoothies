const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser') // a package to deal with cookies easily
const authRoutes = require('./routes/authRoutes') // 1- get the auth routes
const { requireAuth, checkUser } = require('./middleware/auth')
require('dotenv').config()

const app = express()

// middleware
app.use(express.static('public'))
app.use(express.json()) // it takes any json data coming in a req a passes it as Object for us to use
app.use(cookieParser()) // use the cookie parser middleware up here
// view engine
app.set('view engine', 'ejs')

// database connection
mongoose
  .connect(process.env.DB_URL)
  .then((result) => {
    app.listen(3000)
    console.log(`Listening on port 3000`)
  })
  .catch((err) => console.log(err))

// routes
app.get('*', checkUser) // this will fire for all get request, either give you null or the user
app.get('/', (req, res) => res.render('home'))
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'))
app.use(authRoutes) // 2- use them here

// Cookies (keep for reference)
// app.get('/set-cookies', (req, res) => {
//   // res.setHeader('Set-Cookie', 'newUser=true') // instead of this
//   res.cookie('newUser', false, {maxAge : 1000 * 60 * 60 * 24}) // use this (cookie-parser package) a day long,
//   res.cookie('isEmployed', true)
//   res.send('you got the cookies')
// })

// app.get('/read-cookies', (req, res) => {
//   const cookies = req.cookies // thanks to cookies parser now we can access cookies anywhere
//   console.log(cookies.newUser)
//   res.json(cookies)
// })

// // secure: can only be sent over an HTTPS req
// // httpOnly : can't be access by JS using document.cookie
