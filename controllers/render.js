const express = require('express');
const router = express.Router();
const productModel = require('../models/product.js');
const userModel = require('../models/userModel.js');
const cartProductModel = require('../models/cartsProduct.js');
const product = require('../models/product.js');

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
    const loggedUser = await userModel.findOne({ username: req.user.username }).populate({path:"cart",populate:'products'});
    let products = await productModel.find();

    res.render('home.ejs', { products, loggedUser });
});
router.get('/sell', isLoggedIn, async (req, res) => {
    const products = await productModel.find({ user: req.user.id });
    res.render('selling.ejs', { products });
});

router.get('/otp', isLoggedIn, async (req, res) => {
    res.render('otp.ejs');
});




module.exports = router