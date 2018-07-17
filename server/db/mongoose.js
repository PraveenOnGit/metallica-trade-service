var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
//mongoose.connect(process.env.MONGODB_URI);
mongoose.connect('mongodb://praveen:metallica12@ds239911.mlab.com:39911/metallica');
module.exports = {mongoose};
