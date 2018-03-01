var fs = require('fs');
var Base64 = require('../helpers/base64/base64.js');
var sequenceValue = require('../helpers/mongodb/sequence-value.js');
var selectOptions = require('../helpers/mongodb/select-options.js');
var PostModel = require('../models/posts.js').model;

module.exports.list = function (req, res) {
    var options = selectOptions.setOptions(req);
    if (options.filter) {
        PostModel.find({$or:[{title: options.filter},{author:options.filter},{description:options.filter},{content:options.filter}]})
            .skip(options.offset).limit(options.limit).sort(options.orderDirection+''+options.orderBy).exec(
            function (err, response) {
                if (err) {
                    return next(err);
                }
                return res.json(response);
            }
        );
    } else {
        PostModel.find().skip(options.offset).limit(options.limit).sort(options.orderDirection+''+options.orderBy).exec(
            function (err, response) {
                if (err) {
                    return next(err);
                }
                return res.json(response);
            }
        );
    }
};

module.exports.show = function (req, res) {
    PostModel.findById(req.params.id, function (err, response) {
        if (err) {
            return next(err);
        }
        if (!response) {
            return res.status(404).json({message: "No resource with that ID found in the database."});
        }
        return res.json(response);
    });
};

module.exports.count = function (req, res) {
    PostModel.count(function (err, response) {
        if (err) {
            return res.status(500).json({
                id: -1, message: "Error whilst fetching data from the database."
            });
        }
        return res.json(response);
    });
};

module.exports.create = function (req, res, next) {
    delete req.body['_id'];
    var postData = req.body;

    if (postData['title'] === undefined){
        return res.status(400).json({message: "Not enough data to create a a resource. Note: title is required."});
    }

    sequenceValue.getNextId("post_id").then(function (sequence, err) {
        if (err) {
            return next(err);
        } else if (!sequence) {
            return res.status(404).json({message: "No resource with that ID found in the database."});
        }

        postData._id = sequence.sequence_value;
        /* fix next line, check for errors, use config file location */
        fs.mkdirSync('./files/img/posts/' + postData._id);
        if (postData['mainImgBase64']) {
            var imageBuffer = Base64.decodeBase64Image(req.body['mainImgBase64']);
            delete postData['mainImgBase64'];
            fsUpload.upload('/img/post/' + postData._id + '/' + 'main.' + imageBuffer.type, imageBuffer.data).then(function (res, err) {
                if (err) {
                    return next(err);
                } else if (res) {
                    postData.main_img = 'main.' + imageBuffer.type;
                }
            });
        }

        var newPost = new PostModel(userData);
        newPost.save(function (err) {
            if (err) {
                return next(err);
            }
            return res.json(newPost);
        });
    });
};

module.exports.update = function (req, res, next) {
    var postData = req.body;
    delete postData['_id'];

    if (postData['mainImgBase64']) {
        var imageBuffer = Base64.decodeBase64Image(req.body['mainImgBase64']);
        delete postData['mainImgBase64'];
        fsUpload.upload('/img/post/' + postData._id + '/' + 'main.' + imageBuffer.type, imageBuffer.data).then(function (res, err) {
            if (err) {
                return next(err);
            } else if (res) {
                postData.main_img = 'main.' + imageBuffer.type;
            }
        });
    }

    PostModel.findByIdAndUpdate(req.params.id, postData, function (err, response) {
        if (err) {
            return next(err);
        }
        res.json(response);
    });
};

module.exports.addImage = function (req, res, next) {
    var imageBuffer;
    if (req.body.imgDataBase64 !== undefined) {
        imageBuffer = Base64.decodeBase64Image(req.body.img_data);
        var rand_name = new Date().getUTCMilliseconds() + "" + Math.floor((Math.random() * 1e6) + 1) + '.' + imageBuffer.type;

        fsUpload.upload('/img/posts/' + req.params.id + "/" + rand_name, imageBuffer.data).then(function (res, err) {
            if (err) {
                return next(err);
            } else if (res) {
                PostModel.findByIdAndUpdate(req.params.id,{$push: {"images": rand_name}}, {'new': true}, function (err, response) {
                    if (err) {
                        return next(err);
                    }
                    if (response) {
                        return res.json(response);
                    }
                });
            }
        });
    }
};

module.exports.removeImage = function (req, res, next) {
    PostModel.findByIdAndUpdate(req.params.id,{$pull: {"images": req.params.image_name}}, {'new': true}, function (err, doc) {
        if (err) {
            return next(err);
        }
        try {
            fs.unlink('./files/img/posts/' + req.params.id + "/" + req.params.image_name);
            res.json({message: "Deleted image for post: " + req.params.id + " with a unique filename: " + req.params.image_name + "."});
        }
        catch (err) {
            return next(err);
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