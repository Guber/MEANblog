var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    _id: {type: Number, required: true, unique: true},
    title: {type: String, default: ""},
    summary: {type: String, default: ""},
    mainImg: {type: String, default: ""},
    body: {type: String, default: ""},
    hidden: {type: Boolean, default: true},
    tags: {type: [String], default: []},
    images: {type: [String], default: []},
    authorId: {type: Number, default: 0},
    categoryId: {type: Number, default: 0}
}, {timestamps: true});

var Post = mongoose.model("post", postSchema);

module.exports.model = Post;