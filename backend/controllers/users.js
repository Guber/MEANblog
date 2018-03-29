var models = require('../models/_models.js');
var helpers = require('../helpers/_helpers.js');
var rimraf = require('rimraf');
var bcrypt = require('bcrypt');

module.exports.list = function (req, res, next) {
    var options = helpers.SelectOptions.setOptions(req);
    if (options.filter) {
        models.UserModel.find({$or: [{username: options.filter}, {firstName: options.filter}, {lastName: options.filter}]})
            .skip(options.offset).limit(options.limit).sort(options.orderDirection + '' + options.orderBy).exec(
            function (err, docs) {
                if (err) {
                    return next(err);
                }
                return res.json(docs);
            }
        );
    } else {
        models.UserModel.find().skip(options.offset).limit(options.limit).sort(options.orderDirection + '' + options.orderBy).exec(
            function (err, docs) {
                if (err) {
                    return next(err);
                }
                return res.json(docs);
            }
        );
    }
};

module.exports.count = function (req, res, next) {
    models.UserModel.count(function (err, doc) {
        if (err) {
            return next(err);
        }
        res.json(doc);
    });
};

module.exports.show = function (req, res, next, resourceId) {
    models.UserModel.findById(resourceId, function (err, doc) {
        if (err) {
            return next(err);
        }
        if (!doc) {
            return res.status(404).json({message: "No resource with that ID found in the database."});
        }
        return res.json(doc);
    });
}
;

module.exports.showPosts = function (req, res, next, resourceId) {
    models.PostModel.find({'authorId': resourceId}, function (err, doc) {
        if (err) {
            return next(err);
        }
        if (!doc) {
            return res.status(404).json({message: "No resource with that ID found in the database."});
        }
        return res.json(doc);
    });
};

module.exports.update = function (req, res, next, resourceId) {
    var resourceData = req.body;
    delete resourceData['_id'];

    if (resourceData['profileImgBase64']) {
        var imageBuffer = helpers.Base64.decodeBase64Image(req.body['profileImgBase64']);
        delete resourceData['profileImgBase64'];
        helpers.FSUpload.upload('/img/user/' + resourceId + '/' + 'profile.' + imageBuffer.type, imageBuffer.data).then(function (file, err) {
            if (err) {
                return next(err);
            }
            if (file) {
                resourceData['profileImg'] = 'profile.' + imageBuffer.type;
            }
        });
    }

    if (resourceData['newPassword']) {
        resourceData['password'] = bcrypt.hash(resourceData['newPassword'], 10);
        delete resourceData['newPassword'];
    }

    models.UserModel.findByIdAndUpdate(resourceId, resourceData, {'new': true}, function (err, doc) {
        if (err) {
            return next(err);
        }
        if (!doc) {
            return res.status(404).json({message: "No resource with that ID found in the database."});
        }
        return res.json(doc);
    });
};

module.exports.create = function (req, res, next) {
    delete req.body['_id'];
    var resourceData = req.body;

    if (resourceData['username'] === undefined || resourceData['newPassword'] === undefined) {
        return res.status(400).json({message: "Not enough data to create a user resource. Note: username and password are required."});
    }

    bcrypt.hash(resourceData['newPassword'], 10, function (err, hash) {
        resourceData['password'] = hash;
        helpers.SequenceValue.getNextId("user_id").then(function (sequence, err) {
            if (err) {
                return next(err);
            } else if (!sequence) {
                return res.status(404).json({message: "No resource with that ID found in the database."});
            }

            resourceData._id = sequence.sequenceValue;

            helpers.FSUpload.mkdir('/img/user/' + resourceData._id).then(function () {
                if (resourceData['profileImgBase64']) {
                    var imageBuffer = helpers.Base64.decodeBase64Image(req.body['profileImgBase64']);
                    delete resourceData['profileImgBase64'];
                    helpers.FSUpload.upload('/img/user/' + resourceData._id + '/' + 'profile.' + imageBuffer.type, imageBuffer.data)
                        .then(function () {
                            resourceData['profileImg'] = 'profile.' + imageBuffer.type;
                            var newUser = new models.UserModel(resourceData);
                            newUser.save(function (err) {
                                if (err) {
                                    return next(err);
                                }
                                return res.json(newUser);
                            });
                        }).catch(function (err) {
                            return next(err);
                        }
                    );
                } else {
                    var newUser = new models.UserModel(resourceData);
                    newUser.save(function (err) {
                        if (err) {
                            return next(err);
                        }
                        return res.json(newUser);
                    });
                }
            });
        })
    });
};

module.exports.remove = function (req, res) {
    models.UserModel.findByIdAndRemove(req.params.id, function (err, response) {
        if (err) {
            return next(err);
        }
        else {
            res.json({message: "User with id " + req.params.id + " removed."});
            rimraf('./files/img/user/' + req.params.id + "/", function () {
            });
        }
    });
};

