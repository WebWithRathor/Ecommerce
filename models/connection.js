const mongoose = require('mongoose');

exports.DBconnect = async()=>{
    try{
        await mongoose.connect('mongodb://0.0.0.0/ecommerce');
        console.log('DB connected');
    }catch(err){
        console.log(err);
    }
}