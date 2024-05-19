const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.use('/render', require('../controllers/render.js'));

router.use('/passport', require('../controllers/passport.js'));

router.use('/razorpay', require('../controllers/razorpay.js'));

router.use('/google', require('../controllers/google.js'));

router.use('/product', require('../controllers/product.js'));

router.use('/user', require('../controllers/user.js'));



module.exports = router;
