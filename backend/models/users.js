var mongoose = require('mongoose');


var userSchema = mongoose.Schema({
    _id: Number,
    username: String,
    first_name: String,
    last_name: String,
    password: String,
    profile_img: String,
    admin: Boolean,
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
});

var User = mongoose.model("user", userSchema);

module.exports.model = User;