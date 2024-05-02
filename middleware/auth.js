const jwt = require('jsonwebtoken')
const User = require('../models/User')

function requireAuth(req, res, next) {
  const token = req.cookies.jwt // we can only use this because of the cookie parser pack
  // if it exists
  if (token) {
    jwt.verify(token, 'my life secret', (err, decodedToken) => {
      if (err) {
        console.log(err.message)
        res.redirect('./login')
      } else {
        next()
      }
    })
  } else {
    res.redirect('/login')
  }
}

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, 'my life secret', async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = {requireAuth , checkUser}