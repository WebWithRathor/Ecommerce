const mongoose = require('mongoose');

exports.DBconnect = async()=>{
    try{
        await mongoose.connect('mongodb://0.0.0.0/ecommerce');
    }catch(err){
        console.log(err);
    }
}