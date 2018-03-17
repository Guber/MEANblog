module.exports.dbServer = '127.0.0.1';
module.exports.dbName = 'Int-Rev_Blog';
var mongoose = require('mongoose');
mongoose.connect('mongodb://' + this.dbServer + '/' + this.dbName, { useMongoClient: true });
module.exports.mongoose = mongoose;

