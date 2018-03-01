var mongoose = require('mongoose');


 var counterSchema = mongoose.Schema({
    _id: {type: String, required: true, unique: true},
    sequence_value:  {type: Number, default: 0}
});

var Counter =  mongoose.model("counter", counterSchema); 

module.exports.model = Counter;