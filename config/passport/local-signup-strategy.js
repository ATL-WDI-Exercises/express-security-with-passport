var LocalStrategy   = require('passport-local').Strategy;
var User            = require('../../models/user');
var isValidPassword = require('./password');

var strategy = new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, email, password, callback) {

    // check password confirmation
    if (req.body.password !== req.body.passwordConfirmation) {
      return callback(null, false, req.flash('error', 'Password and Password Confirmation do not match.'));
    }

    // Find a user with this e-mail
    User.findOne({ 'local.email' :  email }, function(err, user) {
      if (err) return callback(err);
      if (user) {
        // A user with this email already exists
        return callback(null, false, req.flash('error', 'This email is already taken.'));
      }
      else if (isValidPassword(password)) {
        // Create a new user
        var newUser            = new User();
        newUser.local.email    = email;
        newUser.local.password = newUser.encrypt(password);

        newUser.save(function(err) {
          return callback(err, newUser);
        });
      }
      else {
        let message = 'Your password is lame! Passwords should be at least 8 characters, contain at least 1 lowercase letter, 1 uppercase letter, 1 numeric character, and 1 special character.';
        return callback(null, false, req.flash('error', message));
      }
    });
  });

module.exports = strategy;
