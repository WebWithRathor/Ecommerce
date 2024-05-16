const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const userModel = require('../models/userModel.js');
const cartModel = require('../models/carts.js');
const cartsProductModel = require('../models/cartsProduct.js');
const ordersModel = require('../models/order.js');
const product = require('../models/product.js');

const instance = new Razorpay({
  key_id: process.env.Razorpay_id,
  key_secret: process.env.Razorpay_secret,
});

router.post('/api/payment/verify', async function (req, res) {
  const { validatePaymentVerification, validateWebhookSignature } = require('../node_modules/razorpay/dist/utils/razorpay-utils.js');
  const respond = validatePaymentVerification({ "order_id": req.body.res.razorpay_order_id, "payment_id": req.body.res.razorpay_payment_id }, req.body.res.razorpay_signature, process.env.Razorpay_secret);
  if (respond) {
    const cart = await cartModel.findOneAndDelete({ _id: req.body.cart }).populate('products')
    const loggedUser = await userModel.findOneAndUpdate({ username: req.user.username }, { cart: null });
    const products = cart.products.map(function (cartProduct) { 
      return {
        product:cartProduct.product,
        quantity:cartProduct.quantity
      }
    })
    await cartsProductModel.deleteMany({ user: loggedUser._id }) 
    const order = await ordersModel.create({
      buyer: req.user.id,
      products: products,
      amount: cart.price
    })
    loggedUser.orders.push(order._id);
    loggedUser.save();
  }
  res.status(200).json(respond)
})


router.post('/create/orderId', async function (req, res, next) {
  const cart = await cartModel.findOne({ _id: req.body.cart })
  var options = {
    amount: cart.price * 100,  // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11",
  };
  instance.orders.create(options, function (err, order) {
    res.json(order);
  });
})

module.exports = router
