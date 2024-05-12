const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  productname:String,
  description:String,
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  images:[String],
  price:String
})


module.exports = mongoose.model('product',productSchema);
