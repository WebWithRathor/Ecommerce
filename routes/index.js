const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel.js');
const Razorpay = require('razorpay');
const cartModel = require('../models/carts.js');
const cartsProductModel = require('../models/cartsProduct.js');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oidc');


passport.use(new GoogleStrategy({
  clientID: process.env['GOOGLE_CLIENT_ID'],
  clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
  callbackURL: '/oauth2/redirect/google',
  scope: ['profile', 'email']
}, async function verify(issuer, profile, cb) {
  const user = await userModel.findOne({ email: profile.emails[0].value })
  if (user) {
    return cb(null, user);
  }
  const neWuser = userModel.create({
    username: profile.displayName,
    email: profile.emails[0].value,
    type: 'buyer'
  })
  cb(null, neWuser);
}));

router.get('/login/federated/google', passport.authenticate('google'));

router.get('/oauth2/redirect/google', passport.authenticate('google', {
  successRedirect: '/render/home',
  failureRedirect: '/render/login'
}));



const instance = new Razorpay({
  key_id: process.env.Razorpay_id,
  key_secret: process.env.Razorpay_secret,
});

router.post('/api/payment/verify', async function (req, res) {
  const { validatePaymentVerification, validateWebhookSignature } = require('../node_modules/razorpay/dist/utils/razorpay-utils.js');
  const respond = validatePaymentVerification({ "order_id": req.body.res.razorpay_order_id, "payment_id": req.body.res.razorpay_payment_id }, req.body.res.razorpay_signature, process.env.Razorpay_secret);
  if (respond) {
    const cart = await cartModel.findOneAndDelete({ _id: req.body.cart })
    const loggedUser = await userModel.findOneAndUpdate({ username: req.user.username }, { cart: null });
    cart.products.forEach(async function (e) { await cartsProductModel.findOneAndDelete({ _id: e }) })
  }
  res.status(200).json(respond)
})


router.post('/create/orderId', async function (req, res, next) {
  const cart = await cartModel.findOne({ _id: req.body.cart })
  var options = {
    amount: cart.price * 100,  // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11"
  };
  instance.orders.create(options, function (err, order) {
    res.json(order);
  });

})

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});
router.use('/render', require('../controllers/render.js'));

router.use('/passport', require('../controllers/passport.js'));

router.use('/product', require('../controllers/product.js'));

router.use('/user', require('../controllers/user.js'));


module.exports = router;
