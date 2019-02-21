const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
});

UserSchema.pre('save', function preCallback(next) {
  // Get access to the user model
  const user = this;
  bcrypt.genSalt(10, function genSaltCallback(saltError, salt) {
    if (saltError) return next(saltError);
    return bcrypt.hash(user.password, salt, null, function hashCallback(hashError, hash) {
      if (hashError) return next(hashError);
      user.password = hash;
      return next();
    });
  });
});

UserSchema.methods.toJSON = function toJSON() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('users', UserSchema);
