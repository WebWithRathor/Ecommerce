const express = require('express');
const router = express.Router();
const passport = require('passport');
const localStrategy = require('passport-local');
const userModel = require('../models/userModel.js');

passport.authenticate(new localStrategy("local",userModel.authenticate()));

router.post('/register', function (req, res, next) {
  const userData = new userModel({
    username: req.body.username,
    type: req.body.type,
    email: req.body.email
  })
  userModel.register(userData, req.body.password)
    .then(function (registereduser) {
      passport.authenticate('local')(req, res, function () {
        res.redirect('/home')
      })
    })
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login',
}), function (req, res) { })

router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    console.log(err);
  });
  res.redirect('/login');
});



module.exports = router