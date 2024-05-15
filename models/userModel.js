const mongoose = require('mongoose');
const plm= require('passport-local-mongoose');

const userSchema = mongoose.Schema({
  username:String,
  password:String,
  email:String,
  profileImg:{
    type:String,
    default:'def.jpg'
  },
  type:String,
  fullname:String,
  address:String,
  products:[
    {type:mongoose.Schema.Types.ObjectId,
    ref:'product'}
  ],
  wishlist:[
    {type:mongoose.Schema.Types.ObjectId,
    ref:'product'}
  ],
  cart:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'cart'
  },
  selled:[[
    {type:mongoose.Schema.Types.ObjectId,
    ref:'product'}
  ],]
})

userSchema.plugin(plm);

module.exports = mongoose.model('user',userSchema);
