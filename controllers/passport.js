const express = require('express');
const router = express.Router();
const passport = require('passport');
const localStrategy = require('passport-local');
const userModel = require('../models/userModel.js');
const otpModel = require('../models/otp.js');
const sendEmail = require('./nodemailer.js').sendEmail




passport.use(new localStrategy(userModel.authenticate()));

router.post('/register', function (req, res, next) {
  const userData = new userModel(req.body)
  userModel.register(userData, req.body.password)
    .then(async function (registereduser) {
      await otpModel.deleteMany({ user: registereduser._id })
      const otp = await otpModel.create({
        user: registereduser._id,
        otp: Math.floor(1000 + Math.random() * 8999),
        expiry: Date.now() + 60000
      })
      const mailOptions = {
        subject: "user Verification ",
        html: `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <h1 style="text-align: center; color: #333;">Email Verification OTP</h1>
            <p>Dear User,</p>
            <p>Please use the OTP below to verify your email:</p>
        <h1>${otp.otp}</h1>
            <p>If you didn't request this OTP, please ignore this email.</p>
            <p>Thanks,<br>ShopiDev</p>
        </div>
    </body>`,
        to: registereduser.email,
        from: process.env.EMAIL
      };
      sendEmail(mailOptions);
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

router.post('/verify',async function (req,res,next){
  const otp = await otpModel.findOne({ user: req.user.id });
  const loggedUser = await userModel.findOne({ _id: req.user.id });
  console.log(req.body.otp,otp.otp);
  if(req.body.otp == otp.otp){
    loggedUser.isVerified = true;
    await loggedUser.save()
    await otpModel.deleteMany({ user: req.user.id });
    res.redirect('/render/home');
  }else{
    res.redirect('back');
  }
  
})


module.exports = router