const express = require('express');
const router = express.Router();
const passport = require('passport');
const localStrategy = require('passport-local');
const userModel = require('../models/userModel.js');




passport.use(new localStrategy(userModel.authenticate()));

router.post('/register', function (req, res, next) {
  const userData = new userModel(req.body)
  userModel.register(userData, req.body.password)
    .then(function (registereduser) {
      passport.authenticate('local')(req, res, function () {
        res.redirect('/render/otp')
      })
    })
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/render/home',
  failureRedirect: '/render/login',
}), function (req, res) { })

router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    console.log(err);
  });
  res.redirect('/render/login');
});



module.exports = router