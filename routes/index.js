var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});
router.use('/render',require('../controllers/render.js'));

router.use('/passport', require('../controllers/passport.js'));


module.exports = router;
