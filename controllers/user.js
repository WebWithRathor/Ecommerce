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

router.get('/profile',isLoggedIn,async (req, res) => {
    const loggedUser = await userModel.findOne({username:req.user.username});
    res.render('profile.ejs',{loggedUser});
});

router.get('/cart', (req, res) => {
    res.render('cart.ejs');
});
router.get('/wishlist',isLoggedIn, async (req, res) => {
    const loggedUser = await userModel.findOne({username:req.user.username}).populate('wishlist');
    console.log(loggedUser.wishlist);
    res.render('wishlist.ejs',{loggedUser});
});

router.post('/edit',upload.single('profileImg'), async (req, res) => {
    console.log(req.body)
    const loggedUser = await userModel.findOneAndUpdate({ username: req.user.username }, { username: req.body.username,address:req.body.address, fullname: req.body.fullname,email:req.body.email }, { new: true });
    if(req.file){
        loggedUser.profileImg = req.file.filename;
        await loggedUser.save();
    }
    req.logIn(loggedUser,(err)=>{
        if(err){
            res.send(err);
        }else{
            res.redirect('/user/profile');
        }
    });


});


module.exports = router