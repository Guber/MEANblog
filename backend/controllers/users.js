var UserModel = require('../models/users.js').model;
var PostModel = require('../models/posts.js').model;
var fs = require('fs');
var Base64 = require('../helpers/base64/base64.js');
var sequenceValue = require('../helpers/mongodb/sequenceValue.js');
var admin_jwt = require('../helpers/auth/admin-jwt.js');

module.exports.list = function (req, res) {
    UserModel.find(function (err, response) {
        if (err) {
            return res.json({
                id: -1, message: "Error whilst fetching data."
            });
        }
        return res.json(response);
    });
};

module.exports.count = function (req, res) {
    UserModel.count(function (err, response) {
        if (err) {
            res.json({
                id: -1, message: "Error whilst fetching data."
            });
        }
        res.json(response);
    });
};

module.exports.showSelf = function (req, res) {
    var id_from_header = admin_jwt.getUserIdFromToken(req);
    if (id_from_header !== -1) {
        UserModel.findById(id_from_header, function (err, response) {
            if (err) {
                return res.json({
                    id: -1, message: "Error whilst fetching data."
                });
            }
            return res.json(response);
        });
    }
};

module.exports.show = function (req, res) {
    UserModel.findById(req.params.id, function (err, response) {
        if (err) {
            return res.json({
                id: -1, message: "Error whilst fetching data."
            });
        }
        return res.json(response);
    });
};

module.exports.showPosts = function (req, res) {
    PostModel.find({'author_id': parseInt(req.params.id)}, function (err, response) {
        if (err) {
            return res.json({
                id: -1, message: "Error whilst fetching data."
            });
        }
        return res.json(response);
    });
};

module.exports.updateSelf = function (req, res) {
    var user_id = req.body._id;
    delete req.body['_id'];

    var userInfo = req.body;

    if (req.body['profile_img_base64'] && req.body['profile_img_base64'] !== '') {
        var imageBuffer = Base64.decodeBase64Image(req.body['profile_img_base64']);
        req.body['profile_img'] = 'profile.' + imageBuffer.type;
        fs.writeFile('./files/img/user/' + user_id + '/' + userInfo.profile_img, imageBuffer.data, function (err) {
            if (err) console.log(err);
            else console.log("Uploaded image for user: " + user_id + " with a filename: " + userInfo.profile_img + ".");
        });
    }

    UserModel.findByIdAndUpdate(user_id, userInfo, function (err, response) {

        if (err) {
            console.log(err);
            res.json({
                id: -1, message: "Error whilst saving data for post " + req.body.id + "."
            });
        }
    });
    return res.json({id: userInfo._id, message: "User with id " + userInfo._id + " updated."});
};

module.exports.update = function (req, res) {
    var user_id = req.body._id;

    delete req.body['_id'];
    var userInfo = req.body;

    if (req.body['profile_img_base64'] && req.body['profile_img_base64'] !== '') {
        var imageBuffer = Base64.decodeBase64Image(req.body['profile_img_base64']);
        req.body['profile_img'] = 'profile.' + imageBuffer.type;
        fs.writeFile('./files/img/user/' + user_id + '/' + userInfo.profile_img, imageBuffer.data, function (err) {
            if (err) console.log(err);
            else console.log("Uploaded image for user: " + user_id + " with a filename: " + userInfo.profile_img + ".");
        });
    }

    UserModel.findByIdAndUpdate(user_id, userInfo, function (err, response) {
        if (err) {
            console.log(err);
            res.json({
                id: -1, message: "Error whilst saving data for post " + req.body.id + "."
            });
        }
    });
    return res.json({id: userInfo._id, message: "User with id " + userInfo._id + " updated."});
};

module.exports.create = function (req, res, next) {

    delete req.body['_id'];
    var userData = req.body;

    sequenceValue.getNextId("user_id").then(function (sequence, err) {
        if (err) {
            console.log(err);
        }

        userData._id = sequence.sequence_value;
        fs.mkdirSync('./files/img/user/' + userData._id);

        if (req.body['profile_img_base64'] && req.body['profile_img_base64'] !== '') {
            var imageBuffer = Base64.decodeBase64Image(req.body['profile_img_base64']);
            req.body['profile_img'] = 'profile.' + imageBuffer.type;
        }

        if (imageBuffer) {
            fs.writeFile('./files/img/users/' + userData._id + '/' + userData.profile_img, imageBuffer.data, function (err) {
                if (err) {
                    return next(err);
                }
            });
        }

        var newUser = new UserModel(userData);
        newUser.save(function (err) {
            if (err) {
                return next(err);
            }
        });



        return res.json({id: userData._id, message: "User with id " + userData._id + " updated."});
    });
};

module.exports.remove = function (req, res, next) {
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