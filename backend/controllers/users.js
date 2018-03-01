var UserModel = require('../models/users.js').model;
var PostModel = require('../models/posts.js').model;
var fs = require('fs');
var fsUpload = require('../helpers/fs/fs-upload.js');
var Base64 = require('../helpers/base64/base64.js');
var sequenceValue = require('../helpers/mongodb/sequence-value.js');
var selectOptions = require('../helpers/mongodb/select-options.js');
var admin_jwt = require('../helpers/auth/admin-jwt.js');
var bcrypt = require('bcrypt');

module.exports.list = function (req, res) {
    var options = selectOptions.setOptions(req);
    if (options.filter) {
        userModel.find({$or:[{username: options.filter},{firstName:options.filter},{lastName:options.filter}]})
            .skip(options.offset).limit(options.limit).sort(options.orderDirection+''+options.orderBy).exec(
            function (err, response) {
                if (err) {
                    return next(err);
                }
                return res.json(response);
            }
        );
    } else {
        UserModel.find().skip(options.offset).limit(options.limit).sort(options.orderDirection+''+options.orderBy).exec(
            function (err, response) {
                if (err) {
                    return next(err);
                }
                return res.json(response);
            }
        );
    }
};

module.exports.count = function (req, res) {
    UserModel.count(function (err, response) {
        if (err) {
            res.status(500).json({
                id: -1, message: "Error whilst fetching data from the database."
            });
        }
        res.json(response);
    });
};

module.exports.show = function (req, res) {
    UserModel.findById(req.params.id, function (err, response) {
        if (err) {
            return next(err);
        }
        if (!response) {
            return res.status(404).json({message: "No resource with that ID found in the database."});
        }
        return res.json(response);
    });
};

module.exports.showSelf = function (req, res) {
    var id_from_header = admin_jwt.getUserIdFromToken(req);
    req.params.id = id_from_header;
    if (id_from_header !== -1) {
        this.show(req, res);
    }
};

module.exports.showPosts = function (req, res) {
    PostModel.find({'author_id': parseInt(req.params.id)}, function (err, response) {
        if (err) {
            return next(err);
        }
        if (!response) {
            return res.status(404).json({message: "No resource with that ID found in the database."});
        }
        return res.json(response);
    });
};

module.exports.update = function (req, res) {
    var user_id = req.params._id;
    var userData = req.body;
    delete userData['_id'];

    if (userData['profileImgBase64']) {
        var imageBuffer = Base64.decodeBase64Image(req.body['profileImgBase64']);
        delete userData['profileImgBase64'];
        fsUpload.upload('/img/user/' + user_id + '/' + 'profile.' + imageBuffer.type, imageBuffer.data).then(function (res, err) {
            if (res) {
                userData['profileImg'] = 'profile.' + imageBuffer.type;
            }
        });
    }

    if (userData['newPassword']) {
        userData['password'] = bcrypt.hash(userData['newPassword'], 10);
        delete userData['newPassword'];
    }

    UserModel.findByIdAndUpdate(user_id, userData, {'new': true}, function (err, response) {
        if (err) {
            return next(err);
        }
        if (!response) {
            return res.status(404).json({message: "No resource with that ID found in the database."});
        }
        return res.json(response);
    });
};

module.exports.updateSelf = function (req, res) {
    var id_from_header = admin_jwt.getUserIdFromToken(req);
    if (id_from_header !== -1) {
        req.params._id = id_from_header;
        this.update(req,res);
    }
};

module.exports.create = function (req, res) {
    delete req.body['_id'];
    var userData = req.body;
    if (userData['username'] === undefined || userData['newPassword'] === undefined){
        return res.status(400).json({message: "Not enough data to create a user resource. Note: username and password are required."});
    }

    userData['password'] = bcrypt.hash(userData['newPassword'], 10);

    sequenceValue.getNextId("user_id").then(function (sequence, err) {
        if (err) {
            return next(err);
        } else if (!sequence) {
            return res.status(404).json({message: "No resource with that ID found in the database."});
        }

        userData._id = sequence.sequence_value;

        fs.mkdirSync('./files/img/user/' + userData._id);

        if (userData['profileImgBase64']) {
            var imageBuffer = Base64.decodeBase64Image(req.body['profileImgBase64']);
            delete userInfo['profileImgBase64'];
            fsUpload.upload('/img/user/' + user_id + '/' + 'profile.' + imageBuffer.type, imageBuffer.data).then(function (res, err) {
                if (res) {
                    userInfo['profileImg'] = 'profile.' + imageBuffer.type;
                }
            });
        }
        var newUser = new UserModel(userData);
        newUser.save(function (err) {
            if (err) {
                return next(err);
            }
            return res.json(newUser);
        });
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