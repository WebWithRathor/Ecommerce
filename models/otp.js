const mongoose = require('mongoose');

const otpSchema = mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  otp:Number,
  createdDate:{
    type: Date,
    default: Date.now()
  },
  expiry:Date
})


module.exports = mongoose.model('otp',otpSchema);
