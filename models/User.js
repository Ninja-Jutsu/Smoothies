const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { isEmail } = require('validator')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, ' Please add a password'],
    minLength: [6, 'Password must be at least 6 chart'],
  },
})

//* userSchema.post('save', function(doc, next){ // post means after saving (check the other methods) //! VERY POWERFUL
//   console.log('new user was created' , doc)
//   next()
// })

// Let's hash the password
userSchema.pre('save', async function (next) {
  // it doesn't take a doc arg as it's called before the doc is created but we can use THIS //! VERY POWERFUL
  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// static method to login user:
userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password); // this will return a Boolean
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};
const User = mongoose.model('user', userSchema)

module.exports = User
