const passport = require('passport');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;
import LocalStrategy from 'passport-local';

// const User = require('./model');
import User from './model'
const config = require('../../config/config');

let localOptions = {
  usernameField: 'email'
}

let localStrategy = new LocalStrategy(localOptions, function(email, password, done) {
  User.findOne({email: email}, function(err, user) {
    if(err) {return done(err)}
    if(!user) {return done(null, false)}
    user.comparePassword(password, function(err, isMatch) {
      if(err) {return done(err)}
      if(!isMatch) {return done(err)}
      return done(null, user);
    })
  });
});


let jwtOptions = {
  secretOrKey: config.secret,
  jwtFromRequest: ExtractJwt.fromHeader('authorization')
};

let jwtStrategy = new JwtStrategy(jwtOptions, function(payload, done) {
  User.findById(payload.sub, function(err, user) {
    if(err) {return done(err, false)}
    if(user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

passport.use(localStrategy);
passport.use(jwtStrategy);
