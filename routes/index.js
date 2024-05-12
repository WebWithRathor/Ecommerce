const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel.js');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});
router.use('/render', require('../controllers/render.js'));

router.use('/passport', require('../controllers/passport.js'));

router.use('/product', require('../controllers/product.js'));



module.exports = router;
