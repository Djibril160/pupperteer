const mongoose = require('mongoose');

const offerSchema = mongoose.Schema({
    title: String,
    tags: String,
    url: String,
    publishedDate: Date,
   });

const Offer = mongoose.model('offers', offerSchema);


module.exports = Offer;
   

   
