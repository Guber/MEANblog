var mongoose = require('mongoose');

var categorySchema = mongoose.Schema({
    _id: {type: Number, required: true, unique: true},
    name: {type: String, default: ""},
    type: {type: String, default: "admin"},
    description: {type: String, default: null},
    mainImg: {type: String, default: null},
    subcategories: {type: Array, default: null},
    authorId: {type: Number, default: 0},
    hidden: {type: Boolean, default: false},
    tags: {type: Array, default: null}
}, {timestamps: true});

var Category = mongoose.model("category", categorySchema);

module.exports.model = Category;