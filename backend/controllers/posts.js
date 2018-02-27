var fs = require('fs');
var Base64 = require('../helpers/base64/base64.js');
var sequenceValue = require('../helpers/mongodb/sequenceValue.js');
var PostModel = require('../models/posts.js').model;

module.exports.list = function (req, res, next) {
    var limit = parseInt(req.query.limit || req.body.limit || 0);
    var offset = parseInt(req.query.offset || req.body.offset || 0);
    var orderBy = req.query.order_by || req.body.order_by || "_id";
    var orderDirection = req.query.order_direction || req.body.order_direction || "";
    var filter = req.query.filter || req.body.filter || "";

    if (orderDirection === 'desc') {
        orderDirection = '-';
    } else {
        orderDirection = '';
    }
    if (filter) {
        PostModel.find({$or:[{title: filter},{author:filter},{description:filter},{content:filter}]}).skip(offset).limit(limit).sort(orderDirection+''+orderBy).exec(
            function (err, response) {
                if (err)  return next(err);
                res.json(response);
            }
        );
    } else {
        PostModel.find().skip(offset).limit(limit).sort(orderDirection+''+orderBy).exec(
            function (err, response) {
                if (err)  return next(err);
                res.json(response);
            }
        );
    }
};

module.exports.show = function (req, res, next) {
    PostModel.findById(req.params.id, function (err, response) {
        if (err) {
            return next(err);
        }
        res.json(response);
    });
};

module.exports.count = function (req, res) {
    PostModel.count(function (err, response) {
        if (err) {
            return next(err);
        }
        res.json(response);
    });
};

module.exports.create = function (req, res, next) {
    var postData = {};
    postData.title = req.body.title ? req.body.title : "";
    postData.summary = req.body.summary ? req.body.summary : "";
    postData.body = req.body.body ? req.body.body : "";
    postData.category_id = req.body.category_id ? req.body.category_id : "";
    postData.tags = req.body.tags ? req.body.tags : [];
    postData.images = [];
    postData.main_img = "";

    var imageBuffer;
    if (req.body.main_img_data !== undefined) {
        imageBuffer = Base64.decodeBase64Image(req.body.main_img_data);
        postData.main_img = 'main.' + imageBuffer.type;
    }

    sequenceValue.getNextId("post_id").then(function (sequence) {
        postData._id = sequence.sequence_value;
        var newPost = new PostModel(postData);
        newPost.save(function (err) {
            if (err) {
                return next(err);
            }

            fs.mkdirSync('./files/img/posts/' + postData._id);
            if (imageBuffer) {
                fs.writeFile('./files/img/posts/' + postData._id + '/' + postData.main_img, imageBuffer.data, function (err) {
                    if (err) {
                        return next(err);
                    }
                });
            }
            res.json({id: postData._id, message: "Post with id " + postData._id + " created."});
        });
    });
};

module.exports.update = function (req, res, next) {
    var postData = {};
    postData.title = req.body.title ? req.body.title : "";
    postData.summary = req.body.summary ? req.body.summary : "";
    postData.body = req.body.body ? req.body.body : "";
    postData.category_id = req.body.category_id ? req.body.category_id : "";
    postData.tags = req.body.tags ? req.body.tags : [];

    var imageBuffer;
    if (req.body.main_img_data !== undefined) {
        imageBuffer = Base64.decodeBase64Image(req.body.main_img_data);
        postData.main_img = 'main.' + imageBuffer.type;
    }

    PostModel.findByIdAndUpdate(req.params.id, postData, function (err, response) {
        if (err) {
            return next(err);
        }
        if (imageBuffer) {
            fs.writeFile('./files/img/posts/' + req.params.id + '/' + postData.main_img, imageBuffer.data, function (err) {
                if (err) {
                    return next(err);
                }
            });
        }
        res.json({id: req.params.id, message: "Post with id " + postData._id + " updated."});
    });
};

module.exports.addImage = function (req, res, next) {
    if (req.body.img_data !== undefined) {
        imageBuffer = Base64.decodeBase64Image(req.body.img_data);
        var rand_name = new Date().getUTCMilliseconds() + "" + Math.floor((Math.random() * 1e6) + 1) + '.' + imageBuffer.type;
    }

    var imageBuffer;
    if (imageBuffer) {
        PostModel.findByIdAndUpdate(req.params.id,{$push: {"images": rand_name}}, {'new': true}, function (err, doc) {
            if (err) {
                return next(err);
            }
            if (doc) {
                fs.writeFile('./files/img/posts/' + req.params.id + "/" + rand_name, imageBuffer.data, function (err) {
                    if (err) {
                        return next(err);
                    }
                });
            }
        });
    }

    res.json({
        id: req.params.id,
        message: "Uploaded image for post: " + req.params.id + " with a unique filename: " + rand_name + "."
    });
};

module.exports.removeImage = function (req, res, next) {
    PostModel.findByIdAndUpdate(req.params.id,{$pull: {"images": req.params.image_name}}, {'new': true}, function (err, doc) {
        console.log(req.params.image_name);
        try {
            fs.unlink('./files/img/posts/' + req.params.id + "/" + req.params.image_name);
            res.json({message: "Deleted image for post: " + req.params.id + " with a unique filename: " + req.params.image_name + "."});
        }
        catch (err) {
            console.log(err);
        }
    });
};

module.exports.remove = function (req, res, next) {
    PostModel.findByIdAndRemove(req.params.id, function (err, response) {
        if (err) {
            return next(err);
        }
        else {
            res.json({message: "Post with id " + req.params.id + " removed."});
            rimraf('./files/img/posts/' + req.params.id + "/", function () {
            });
        }
    });
};