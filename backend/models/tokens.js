var mongoose = require('mongoose');


 var tokenSchema = mongoose.Schema({
    user_id: Number,
    token: String,
    exp: Number,
    iat: Number,
    admin: Boolean
});

var Token =  mongoose.model("token", tokenSchema);

module.exports.model = Token;