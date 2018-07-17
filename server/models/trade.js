var mongoose = require('mongoose');

var Trade = mongoose.model('Trade', {
    tradeDate: {
    type: Date,
    required: true,
  },
  commodity: {
    type: String,
    required: true,
  },
  side: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },  
  price: {
    type: Number,
    required: true,
  },  
  counterParty: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  }
});

module.exports = {Trade};
