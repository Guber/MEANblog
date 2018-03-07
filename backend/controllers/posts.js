var fs = require('fs');
var rimraf = require('rimraf');
var Base64 = require('../helpers/base64/base64.js');
var sequenceValue = require('../helpers/mongodb/sequence-value.js');
var selectOptions = require('../helpers/mongodb/select-options.js');
var fsUpload = require('../helpers/fs/fs-upload.js');
var PostModel = require('../models/posts.js').model;

module.exports.list = function (req, res, next) {
    var options = selectOptions.setOptions(req);
    if (options.filter) {
        PostModel.find({$or:[{title: options.filter},{author:options.filter},{description:options.filter},{content:options.filter}]})
            .skip(options.offset).limit(options.limit).sort(options.orderDirection+''+options.orderBy).exec(
            function (err, doc) {
                if (err) {
                    return next(err);
                }
                return res.json(doc);
            }
        );
    } else {
        PostModel.find().skip(options.offset).limit(options.limit).sort(options.orderDirection+''+options.orderBy).exec(
            function (err, doc) {
                if (err) {
                    return next(err);
                }
                return res.json(doc);
            }
        );
    }
};

module.exports.show = function (req, res, next, resourceId) {
    PostModel.findById(resourceId, function (err, doc) {
        if (err) {
            return next(err);
        }
        if (!doc) {
            return res.status(404).json({message: "No resource with that ID found in the database."});
        }
        return res.json(doc);
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
    var resourceData = req.body;

    if (resourceData['title'] === undefined){
        return res.status(400).json({message: "Not enough data to create a a resource. Note: title is required."});
    }

    sequenceValue.getNextId("post_id").then(function (sequence, err) {
        if (err) {
            return next(err);
        } else if (!sequence) {
            return res.status(404).json({message: "No resource with that ID found in the database."});
        }

        resourceData._id = sequence.sequence_value;

        fsUpload.mkdir('/img/posts/' + resourceData._id + "/").then(function(directory, err){
            if (err) {
                return next(err);
            } else if (directory) {
                if (resourceData['mainImgBase64']) {
                    var imageBuffer = Base64.decodeBase64Image(req.body['mainImgBase64']);
                    delete resourceData['mainImgBase64'];
                    fsUpload.upload('/img/posts/' + resourceData._id + '/' + 'main.' + imageBuffer.type, imageBuffer.data).then(function (file, err) {
                        if (err) {
                            return next(err);
                        } else if (file) {
                            resourceData.mainImg = 'main.' + imageBuffer.type;
                            var newPost = new PostModel(resourceData);

                            newPost.save(function (err) {
                                if (err) {
                                    return next(err);
                                }
                                return res.json(newPost);
                            });
                        }
                    });
                } else {
                    var newPost = new PostModel(resourceData);

                    newPost.save(function (err) {
                        if (err) {
                            return next(err);
                        }
                        return res.json(newPost);
                    });
                }
            }
        });
    });
};

module.exports.update = function (req, res, next, resourceId) {
    var resourceData = req.body;
    delete resourceData['_id'];
    delete resourceData['images'];

    if (resourceData['mainImgBase64']) {
        var imageBuffer = Base64.decodeBase64Image(resourceData['mainImgBase64']);
        delete resourceData['mainImgBase64'];
        fsUpload.upload('/img/posts/' + resourceId + '/' + 'main.' + imageBuffer.type, imageBuffer.data).then(function (file, err) {
            if (err) {
                return next(err);
            } else if (file) {
                resourceData.mainImg = 'main.' + imageBuffer.type;
                PostModel.findByIdAndUpdate(resourceId, resourceData, function (err, doc) {
                    if (err) {
                        return next(err);
                    }
                    res.json(doc);
                });
            }
        });
    } else {
        PostModel.findByIdAndUpdate(resourceId, resourceData, function (err, doc) {
            if (err) {
                return next(err);
            }
            res.json(doc);
        });
    }
};

module.exports.addImage = function (req, res, next, resourceId) {
    var imageBuffer;
    if (req.body.imgDataBase64) {
        imageBuffer = Base64.decodeBase64Image(req.body.imgDataBase64);
        var rand_name = new Date().getUTCMilliseconds() + "" + Math.floor((Math.random() * 1e6) + 1) + '.' + imageBuffer.type;

        fsUpload.upload('/img/posts/' + resourceId + "/" + rand_name, imageBuffer.data).then(function (fileName, err) {
            if (err) {
                return next(err);
            } else if (fileName) {
                PostModel.findByIdAndUpdate(resourceId,{$push: {"images": rand_name}}, {'new': true}, function (err, response) {
                    if (err) {
                        return next(err);
                    }
                    if (response) {
                        console.log(response);
                        return res.json(response);
                    }
                });
            }
        });
    }
};

module.exports.removeImage = function (req, res, next, resourceId) {
    PostModel.findByIdAndUpdate(resourceId,{$pull: {"images": req.params.image_name}}, {'new': true}, function (err, doc) {
        if (err) {
            return next(err);
        }
        try {
            fs.unlink('../files/img/posts/' + resourceId + "/" + req.params.image_name);
            res.json({message: "Deleted image for post: " + resourceId + " with a unique filename: " + req.params.image_name + "."});
        }
        catch (err) {
            return next(err);
        }
    });
};

module.exports.remove = function (req, res, next, resourceId) {
    PostModel.findByIdAndRemove(resourceId, function (err, doc) {
        if (err) {
            return next(err);
        }
        else {
            res.json({message: "Post with id " + resourceId + " removed."});
            rimraf('../files/img/posts/' + resourceId + "/", function () {
            });
        }
    });
};