var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    _id: Number,
    title: String,
    summary: String,
    main_img: String,
    body: String,
    author: {type: String, default: "admin"},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now},
    hidden: {type: Boolean, default: true},
    tags: {type: [String], default: []},
    images: {type: [String], default: []},
    author_id: Number,
    category_id: Number,
    locked: {type: Boolean, default: false}
});

var Post = mongoose.model("post", postSchema);

module.exports.model = Post;