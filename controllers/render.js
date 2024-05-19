const express = require('express');
const router = express.Router();
const productModel = require('../models/product.js');
const userModel = require('../models/userModel.js');
const otpModel = require('../models/otp.js');
const sendEmail = require('./nodemailer.js').sendEmail

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/render/login');
}

router.get('/login', (req, res) => {
    res.render('login.ejs');
});





router.get('/home', isLoggedIn, async (req, res) => {
    const loggedUser = await userModel.findOne({ username: req.user.username }).populate({ path: "cart", populate: 'products' });
    if (!loggedUser.isVerified) {
        await otpModel.deleteMany({ user: loggedUser._id })
        const otp = await otpModel.create({
            user: loggedUser._id,
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
            to: loggedUser.email,
            from: process.env.EMAIL
        };
        sendEmail(mailOptions);
        res.redirect('/render/otp');
    }
    let products = await productModel.find();

    res.render('home.ejs', { products, loggedUser });
});
router.get('/sell', isLoggedIn, async (req, res) => {
    const loggedUser = await userModel.findOne({_id:req.user.id});
    const products = await productModel.find({ user: req.user.id });
    res.render('selling.ejs', { products,loggedUser });
});

router.get('/otp', isLoggedIn, async (req, res) => {
    res.render('otp.ejs');
});




module.exports = router