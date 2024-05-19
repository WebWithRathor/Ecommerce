const express = require('express');
const router = express.Router();
const upload = require('../routes/multer.js');
const productModel = require('../models/product.js');
const userModel = require('../models/userModel.js');
const cartProductModel = require('../models/cartsProduct.js');
const cartModel = require('../models/carts.js');


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/render/login');
}

router.post('/sell', isLoggedIn, upload.array('productImage', 4), async function (req, res) {
    const loggedInUser = await userModel.findOne({ _id: req.user.id });
    const product = await productModel.create({
        productname: req.body.productName,
        price: req.body.productprice,
        description: req.body.productDescription,
        images: req.files.map(img => img.filename),
        user: req.user.id
    })
    loggedInUser.products.push(product._id);
    await loggedInUser.save();
    res.redirect(`/render/home`)
})

router.get('/show/:productId', isLoggedIn, async function (req, res, next) {
    const product = await productModel.findOne({ _id: req.params.productId })
    const Incart = (await cartProductModel.findOne({ user: req.user.id, product: product._id }) ? true : false);
    const loggedUser = await userModel.findOne({ _id: req.user.id });
    res.render('products.ejs', { product, loggedUser, Incart });
})

router.post('/wishlist/:id', async function (req, res) {
    const loggedUser = await userModel.findOne({ username: req.user.username });
    const product = await productModel.findOne({ _id: req.params.id });
    try {
        if (loggedUser.wishlist.indexOf(product._id) === -1) {
            loggedUser.wishlist.push(product._id);
        } else {
            loggedUser.wishlist.splice(loggedUser.wishlist.indexOf(product._id), 1);
        }
    } catch (error) {
        console.log(error);
    }
    await loggedUser.save();
    res.json(loggedUser.wishlist.indexOf(product._id))
})

router.post('/addtocart', isLoggedIn, async (req, res, next) => {
    const loggedUser = await userModel.findOne({ username: req.user.username });
    const product = await productModel.findOne({ _id: req.body.productId });
    const alreadyincart = await cartProductModel.findOne({ user: loggedUser._id, product: product._id });
    if (alreadyincart) {
        res.json(alreadyincart);
    } else {
        let cart = await cartModel.findOne({ user: req.user.id });
        if (!cart) {
            const cartProduct = await cartProductModel.create({
                user: req.user.id,
                product: product._id,
            })
            cart = await cartModel.create({
                user: req.user.id,
                products: [cartProduct._id],
                price: product.price
            })
        } else {
            cart.price += product.price;
            const cartProduct = await cartProductModel.create({
                user: req.user.id,
                product: product._id,
            })
            cart.products.push(cartProduct._id);
            await cart.save();
        }
        loggedUser.cart = cart._id;
        await loggedUser.save();
        res.status(200).json(cart);
    }

});

module.exports = router