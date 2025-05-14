const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: Number,
    default: null,
    sparse: true 
  },
  picture: String,
  provider: {
    type: String,
    enum: ['google', 'local'],
    default: 'local'
  },
  googleId: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
