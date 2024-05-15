const express = require('express');
const router = express.Router();
const upload = require('../routes/multer.js');
const productModel = require('../models/product.js');
const userModel = require('../models/userModel.js');
const cartModel = require('../models/carts.js');
const cartProductModel = require('../models/cartsProduct.js');

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/render/login');
}

router.get('/profile', isLoggedIn, async (req, res) => {
    const loggedUser = await userModel.findOne({ username: req.user.username });
    res.render('profile.ejs', { loggedUser });
});

router.post('/remove/:id', async (req, res, next) => {
    const cartproduct = await cartProductModel.findOneAndDelete({ _id: req.params.id }).populate('product');
    let cart = await cartModel.findOne({ user: req.user.id });
    cart.price = cart.price - cartproduct.product.price;
    cart.products.splice(cart.products.indexOf(req.params.id), 1);
    if (cart.products.length === 0) {
        await userModel.findOneAndUpdate({ _id: req.user.id }, { cart: null })
        await cartModel.findOneAndDelete({ user: req.user.id });
        cart=false;
    }else{
        await cart.save();
    }
    res.json(cart)
})

router.get('/cart', isLoggedIn, async (req, res) => {
    try {
        const loggedUser = await userModel.findOne({ username: req.user.username });
        if (loggedUser.cart) {
            await loggedUser.populate({ path: 'cart', populate: { path: 'products', populate: { path: 'product' } } });
        }
        res.render('cart.ejs', { loggedUser }); // Pass the user object to the template
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error' + error.message);
    }
});
router.get('/checkout', isLoggedIn, async (req, res) => {
    try {
        const loggedUser = await userModel.findOne({ username: req.user.username });
        if (loggedUser.cart) {
            await loggedUser.populate({ path: 'cart', populate: { path: 'products', populate: { path: 'product' } } });
        }
        res.render('checkouts.ejs', { loggedUser }); // Pass the user object to the template
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error' + error.message);
    }
});
router.get('/wishlist', isLoggedIn, async (req, res) => {
    const loggedUser = await userModel.findOne({ username: req.user.username }).populate('wishlist');
    console.log(loggedUser.wishlist);
    res.render('wishlist.ejs', { loggedUser });
});

router.post('/edit', upload.single('profileImg'), async (req, res) => {
    console.log(req.body)
    const loggedUser = await userModel.findOneAndUpdate({ username: req.user.username }, { username: req.body.username, address: req.body.address, fullname: req.body.fullname, email: req.body.email }, { new: true });
    if (req.file) {
        loggedUser.profileImg = req.file.filename;
        await loggedUser.save();
    }
    req.logIn(loggedUser, (err) => {
        if (err) {
            res.send(err);
        } else {
            res.redirect('/user/profile');
        }
    });


});

router.get('/quantity/:cartProduct/:value', isLoggedIn, async (req, res, next) => {
    const loggedUser = await userModel.findOne({ username: req.user.username });
    const cart = await cartModel.findOne({ _id: loggedUser.cart });
    const cartProduct = await cartProductModel.findOne({ _id: req.params.cartProduct }).populate('product');
    cart.price = cart.price - (cartProduct.product.price * cartProduct.quantity) + req.params.value * cartProduct.product.price
    cartProduct.quantity = Number(req.params.value);
    await cart.save();
    await cartProduct.save();
    res.json(cart.price);
})


module.exports = router