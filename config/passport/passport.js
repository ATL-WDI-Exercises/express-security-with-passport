var localSignupStrategy = require('./local-signup-strategy');
var localLoginStrategy  = require('./local-login-strategy');
var User = require('../../models/user');

var passportConfig = function(passport) {

  // Strategies
  passport.use('local-signup', localSignupStrategy);
  passport.use('local-login' , localLoginStrategy);

  // Session Support
  passport.serializeUser(function(user, callback) {
    callback(null, user.id);
  });

  passport.deserializeUser(function(id, callback) {
    User.findById(id)
    .then(function(user) {
      callback(null, user);
    })
    .catch(function(err) {
      callback(err, null);
    });
  });
};

module.exports = passportConfig;
