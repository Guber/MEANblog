var models = require('../models/_models.js');
var helpers = require('../helpers/_helpers.js');

module.exports.list = function (req, res, next) {
    models.CategoryModel.find(function (err, doc) {
        if (err) {
            return next(err);
        }
        return res.json(doc);
    });
};

module.exports.show = function (req, res, next) {
    models.CategoryModel.findById(req.params.id, function (err, doc) {
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
    models.PostModel.find({'category_id': resourceId}, function (err, doc) {
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

    helpers.SequenceValue.getNextId("category_id").then(function (sequence, err) {
        if (err) {
            return next(err);
        } else if (!sequence) {
            return res.status(404).json({message: "No resource with that ID found in the database."});
        }
        resourceData._id = sequence.sequence_value;
        helpers.FSUpload.mkdir('/img/categories/' + resourceData._id + "/").then(function (directory, err) {
            if (err) {
                return next(err);
            } else if (directory) {
                if (resourceData['mainImgBase64']) {
                    var imageBuffer = helpers.Base64.decodeBase64Image(req.body['mainImgBase64']);
                    delete resourceData['mainImgBase64'];
                    helpers.FSUpload.upload('/img/categories/' + resourceData._id + '/' + 'main.' + imageBuffer.type, imageBuffer.data).then(function (file, err) {
                        if (err) {
                            return next(err);
                        } else if (file) {
                            resourceData.mainImg = 'main.' + imageBuffer.type;
                            var newCategory = new models.CategoryModel(resourceData);
                            newCategory.save(function (err) {
                                if (err) {
                                    return next(err);
                                }
                                return res.json(newCategory);
                            });
                        }
                    });
                } else {
                    var newCategory = new models.CategoryModel(resourceData);
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
        var imageBuffer = helpers.Base64.decodeBase64Image(req.body['mainImgBase64']);
        delete resourceData['mainImgBase64'];
        console.log('/img/categories/' + resourceId + '/' + 'main.' + imageBuffer.type);
        helpers.FSUpload.upload('/img/categories/' + resourceId + '/' + 'main.' + imageBuffer.type, imageBuffer.data).then(function (file, err) {
            if (err) {
                return next(err);
            } else if (file) {
                resourceData.mainImg = 'main.' + imageBuffer.type;
                models.CategoryModel.findByIdAndUpdate(resourceId, resourceData, function (err, doc) {
                    if (err) {
                        return next(err);
                    }
                    res.json(doc);
                });
            }
        });
    } else {
        models.CategoryModel.findByIdAndUpdate(resourceId, resourceData, function (err, doc) {
            if (err) {
                return next(err);
            }
            res.json(doc);
        });
    }
};

module.exports.remove = function (req, res, next) {
    models.CategoryModel.findByIdAndRemove(req.params.id, function (err, doc) {
        if (err) {
            return next(err);
        }
        return res.json(doc);
    });
};