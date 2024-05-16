const mongoose = require('mongoose');

const productsSchema = mongoose.Schema({
  product : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product'
  },
  quantity:Number
})

const orderSchema = mongoose.Schema({
  buyer:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  products:[productsSchema],
  amount:{
    type: Number,
    default: 0
  },
  createdDate:{
    type: Date,
    default: Date.now()
  },
})


module.exports = mongoose.model('order',orderSchema);
