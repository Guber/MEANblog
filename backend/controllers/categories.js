var Base64 = require('../helpers/base64/base64.js');
var CategoryModel = require('../models/categories.js').model;
var PostModel = require('../models/posts.js').model;
var fs = require('fs');
var fsUpload = require("../helpers/fs/fs-upload");
var sequenceValue = require('../helpers/mongodb/sequence-value.js');

module.exports.list = function (req, res, next) {
    CategoryModel.find(function (err, doc) {
        if (err) {
            return next(err);
        }
        return res.json(doc);
    });
};

module.exports.show = function (req, res, next) {
    CategoryModel.findById(req.params.id, function (err, doc) {
        if (err) {
            return next(err);
        }
        if (!doc) {
            return res.status(404).json({message: "No resource with that ID found in the database."});
        }
        return res.json(doc);
    });
};

module.exports.listPosts = function (req, res, next, resourceId) {
    PostModel.find({'category_id': resourceId}, function (err, doc) {
        if (err) {
            return next(err);
        }
        if (!doc) {
            return res.status(404).json({"message": "No resource with that ID found in the database."});
        }
        return res.json(doc);
    });
};

module.exports.create = function (req, res, next) {
    delete req.body['_id'];
    var resourceData = req.body;

    if (resourceData['name'] === undefined) {
        return res.status(400).json({message: "Not enough data to create a a resource. Note: name is required."});
    }

    sequenceValue.getNextId("category_id").then(function (sequence, err) {
        if (err) {
            return next(err);
        } else if (!sequence) {
            return res.status(404).json({message: "No resource with that ID found in the database."});
        }
        resourceData._id = sequence.sequence_value;
        fsUpload.mkdir('/img/categories/' + resourceData._id + "/").then(function (directory, err) {
            if (err) {
                return next(err);
            } else if (directory) {
                if (resourceData['mainImgBase64']) {
                    var imageBuffer = Base64.decodeBase64Image(req.body['mainImgBase64']);
                    delete resourceData['mainImgBase64'];
                    fsUpload.upload('/img/categories/' + resourceData._id + '/' + 'main.' + imageBuffer.type, imageBuffer.data).then(function (file, err) {
                        if (err) {
                            return next(err);
                        } else if (file) {
                            resourceData.mainImg = 'main.' + imageBuffer.type;
                            var newCategory = new CategoryModel(resourceData);
                            newCategory.save(function (err) {
                                if (err) {
                                    return next(err);
                                }
                                return res.json(newCategory);
                            });
                        }
                    });
                } else {
                    var newCategory = new CategoryModel(resourceData);
                    newCategory.save(function (err) {
                        if (err) {
                            return next(err);
                        }
                        return res.json(newCategory);
                    });
                }
            }
        });
    });
};

module.exports.update = function (req, res, next, resourceId) {
    var resourceData = req.body;
    delete resourceData['_id'];

    if (resourceData.mainImgBase64 !== undefined) {
        var imageBuffer = Base64.decodeBase64Image(req.body['mainImgBase64']);
        delete resourceData['mainImgBase64'];
        console.log('/img/categories/' + resourceId + '/' + 'main.' + imageBuffer.type);
        fsUpload.upload('/img/categories/' + resourceId + '/' + 'main.' + imageBuffer.type, imageBuffer.data).then(function (file, err) {
            if (err) {
                return next(err);
            } else if (file) {
                resourceData.mainImg = 'main.' + imageBuffer.type;
                CategoryModel.findByIdAndUpdate(resourceId, resourceData, function (err, doc) {
                    if (err) {
                        return next(err);
                    }
                    res.json(doc);
                });
            }
        });
    } else {
        CategoryModel.findByIdAndUpdate(resourceId, resourceData, function (err, doc) {
            if (err) {
                return next(err);
            }
            res.json(doc);
        });
    }
};

module.exports.remove = function (req, res, next) {
    CategoryModel.findByIdAndRemove(req.params.id, function (err, doc) {
        if (err) {
            return next(err);
        }
        return res.json(doc);
    });
};