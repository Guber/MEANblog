var mongoose = require('mongoose');

var categorySchema = mongoose.Schema({
    _id: {type: Number, required: true, unique: true},
    name: {type: String, default: ""},
    description: {type: String, default: null},
    mainImg: {type: String, default: null},
    subcategories: {type: Array, default: null},
    hidden: {type: Boolean, default: false}
}, {timestamps: true});

var Category = mongoose.model("category", categorySchema);

module.exports.model = Category;