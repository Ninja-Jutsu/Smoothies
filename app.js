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


// routes
app.get('*', checkUser) // this will fire for all get request, either give you null or the user
app.get('/', (req, res) => res.render('home'))
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'))
app.use(authRoutes) // 2- use them here

const debug = require('debug')('Smoothies:server')
const http = require('http')

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '5000')
console.log(process.env.PORT)
console.log(port)

app.set('port', port)

/**
 * Create HTTP server.
 */

const server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => console.log(`Server Listening on port ${port}`))
server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  console.log(error.syscall)
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address()
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  mongoose
  .connect(process.env.DB_URL)
  .then((result) => {
    app.listen(port)
    console.log(`Listening on port 3000`)
  })
  .catch((err) => console.log(err))

  debug('Listening on ' + bind)
}


// database connection
