var mongoose = require('mongoose');

 var categorySchema = mongoose.Schema({
    _id: Number,
    name:  String,
	  type: { type: String, default: "admin" },
		description: { type: String, default: null },
		main_img: { type: String, default: null },
	  subcategories: { type: String, default: null },
	  author: { type: String, default: "admin" },
		created: { type: Date, default: Date.now },
		updated: { type: Date, default: Date.now },
		hidden: { type: Boolean, default: false },
	  taggs: { type: Array, default: null }
});

var Category =  mongoose.model("category", categorySchema);

module.exports.model = Category;