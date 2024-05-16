const mongoose = require('mongoose');
const plm= require('passport-local-mongoose');

const userSchema = mongoose.Schema({
  username:String,
  password:String,
  email:String,
  isVerified:{
    type:Boolean,
    default:false
  },
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
  sold:[
    {type:mongoose.Schema.Types.ObjectId,
    ref:'product'}
  ],
  orders:[
    {type:mongoose.Schema.Types.ObjectId,
    ref:'order'}
  ]
})

userSchema.plugin(plm);

module.exports = mongoose.model('user',userSchema);
