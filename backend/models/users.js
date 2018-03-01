var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    _id: {type: Number, required: true, unique: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true, select: false},
    firstName: {type: String, default: ""},
    lastName: {type: String, default: ""},
    profileImg: {type: String, default: ""},
    admin: {type: Boolean, default: true}
}, {timestamps: true});

var User = mongoose.model("user", userSchema);

module.exports.model = User;