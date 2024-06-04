const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  displayName: {
    type: String,
  },
  email: {
    type: String,
  },
  photoURL: {
    type: String,
  },
  role: {
    type: String,
    default: 'member',
    enum: ['member','trainer', 'admin'],
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('User', UserSchema);