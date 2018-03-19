module.exports.dbServer = '127.0.0.1'; // set to you database server
module.exports.dbName = 'MEANBlog'; // set to you database name
var mongoose = require('mongoose');
mongoose.connect('mongodb://' + this.dbServer + '/' + this.dbName, { useMongoClient: true });
module.exports.mongoose = mongoose;

