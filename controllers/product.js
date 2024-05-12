const express = require('express');
const router = express.Router();
const upload = require('../routes/multer.js');
const productModel = require('../models/product.js');
const userModel = require('../models/userModel.js');

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/render/login');
}

router.post('/sell', isLoggedIn, upload.array('productImage', 4), async function (req, res) {
    const product = await productModel.create({
        productname: req.body.productName,
        price: req.body.productprice,
        description: req.body.productDescription,
        images: req.files.map(img => img.filename),
        user: req.user.id
    })
    res.redirect(`/render/home`)
})

router.get('/show/:productId', isLoggedIn, async function (req, res, next) {
    const product = await productModel.findOne({ _id: req.params.productId })
    const loggedInUser = await userModel.findOne({ _id: req.user.id });
    res.render('products.ejs', { product, loggedInUser });
})

router.post('/wishlist/:id', async function (req, res) {
    const loggedUser = await userModel.findOne({ username: req.user.username });
    const product = await productModel.findOne({ _id: req.params.id });
    if(loggedUser.wishlist.indexOf(product._id)===-1){
        loggedUser.wishlist.push(product._id);
    }else{
        loggedUser.wishlist.splice(loggedUser.wishlist.indexOf(product._id),1);
    }
    await loggedUser.save();
    res.json(loggedUser.wishlist.indexOf(product._id))
})


module.exports = router