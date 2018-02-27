var mongoose = require('mongoose');


 var counterSchema = mongoose.Schema({
    _id: String,
    sequence_value:  Number
});

var Counter =  mongoose.model("counter", counterSchema); 

module.exports.model = Counter;