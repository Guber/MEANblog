var UserModel = require('../models/users.js').model;
var PostModel = require('../models/posts.js').model;
var fsUpload = require('../helpers/fs/fs-upload.js');
var rimraf = require('rimraf');
var Base64 = require('../helpers/base64/base64.js');
var sequenceValue = require('../helpers/mongodb/sequence-value.js');
var selectOptions = require('../helpers/mongodb/select-options.js');
var bcrypt = require('bcrypt');

module.exports.list = function (req, res, next) {
    var options = selectOptions.setOptions(req);
    if (options.filter) {
        userModel.find({$or: [{username: options.filter}, {firstName: options.filter}, {lastName: options.filter}]})
            .skip(options.offset).limit(options.limit).sort(options.orderDirection + '' + options.orderBy).exec(
            function (err, docs) {
                if (err) {
                    return next(err);
                }
                return res.json(docs);
            }
        );
    } else {
        UserModel.find().skip(options.offset).limit(options.limit).sort(options.orderDirection + '' + options.orderBy).exec(
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
    UserModel.count(function (err, doc) {
        if (err) {
            return next(err);
        }
        res.json(doc);
    });
};

module.exports.show = function (req, res, next, resourceId) {
    UserModel.findById(resourceId, function (err, doc) {
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
    PostModel.find({'authorId': resourceId}, function (err, doc) {
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
        var imageBuffer = Base64.decodeBase64Image(req.body['profileImgBase64']);
        delete resourceData['profileImgBase64'];
        fsUpload.upload('/img/user/' + resourceId + '/' + 'profile.' + imageBuffer.type, imageBuffer.data).then(function (file, err) {
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

    UserModel.findByIdAndUpdate(resourceId, resourceData, {'new': true}, function (err, doc) {
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
        sequenceValue.getNextId("user_id").then(function (sequence, err) {
            if (err) {
                return next(err);
            } else if (!sequence) {
                return res.status(404).json({message: "No resource with that ID found in the database."});
            }

            resourceData._id = sequence.sequence_value;

            fsUpload.mkdir('/img/user/' + resourceData._id).then(function () {
                if (resourceData['profileImgBase64']) {
                    var imageBuffer = Base64.decodeBase64Image(req.body['profileImgBase64']);
                    delete resourceData['profileImgBase64'];
                    fsUpload.upload('/img/user/' + resourceData._id + '/' + 'profile.' + imageBuffer.type, imageBuffer.data)
                        .then(function () {
                            resourceData['profileImg'] = 'profile.' + imageBuffer.type;
                            var newUser = new UserModel(resourceData);
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
                    var newUser = new UserModel(resourceData);
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
    UserModel.findByIdAndRemove(req.params.id, function (err, response) {
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