const mongoose = require('mongoose');
const plm= require('passport-local-mongoose');

const userSchema = mongoose.Schema({
  username:String,
  password:String,
  email:String,
  type:String,
  products:[
    {type:mongoose.Schema.Types.ObjectId,
    ref:'product'}
  ],
  wishlist:[
    {type:mongoose.Schema.Types.ObjectId,
    ref:'product'}
  ],
  cart:[
    {type:mongoose.Schema.Types.ObjectId,
    ref:'product'}
  ],
  selled:[[
    {type:mongoose.Schema.Types.ObjectId,
    ref:'product'}
  ],]
})

userSchema.plugin(plm);

module.exports = mongoose.model('user',userSchema);
