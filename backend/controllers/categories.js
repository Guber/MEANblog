var Base64 = require('../helpers/base64/base64.js');
var CategoryModel = require('../models/categories.js').model;
var PostModel = require('../models/posts.js').model;
var fs = require('fs');
var fsUpload = require("../helpers/fs/fs-upload");

module.exports.list = function (req, res) {
    CategoryModel.find(function (err, response) {
        if (err) {
            return next(err);
        }
        return res.json(response);
    });
};

module.exports.show = function (req, res) {
    CategoryModel.findById(req.params.id, function (err, response) {
        if  (err) {
            return next(err);
        }
        if (!response) {
            return res.status(404).json({message: "No resource with that ID found in the database."});
        }
        return res.json(response);
    });
};

module.exports.listPosts = function (req, res) {
    PostModel.find({'category_id': parseInt(req.params.id)}, function (err, response) {
        if (err) {
            return next(err);
        }
        if (!response) {
            return res.status(404).json({"message": "No resource with that ID found in the database."});
        }
        return res.json(response);
    });
};

module.exports.create = function (req, res) {
    delete req.body['_id'];
    var categoryData = req.body;

    if (categoryData['name'] === undefined){
        return res.status(400).json({message: "Not enough data to create a a resource. Note: name is required."});
    }

    sequenceValue.getNextId("category_id").then(function (sequence, err) {
        if (err) {
            return next(err);
        } else if (!sequence) {
            return res.status(404).json({message: "No resource with that ID found in the database."});
        }

        categoryData._id = sequence.sequence_value;
        fs.mkdirSync('./files/img/categories/' + categoryData._id);

        if (categoryData['mainImgBase64']) {
            var imageBuffer = Base64.decodeBase64Image(req.body['mainImgBase64']);
            delete categoryData['mainImgBase64'];
            fsUpload.upload('/img/categories/' + categoryData._id + '/' + 'main.' + imageBuffer.type, imageBuffer.data).then(function (res, err) {
                if (err) {
                    return next(err);
                } else if (res) {
                    categoryData.mainImg = 'main.' + imageBuffer.type;
                }
            });
        }

        var newCategory = new CategoryModel(userData);
        newCategory.save(function (err) {
            if (err) {
                return next(err);
            }
            return res.json(newCategory);
        });

    });
};

module.exports.update = function (req, res) {
    var categoryData = req.body;
    delete categoryData['_id'];

    if (req.body.mainImgBase64 !== undefined) {
        var imageBuffer = Base64.decodeBase64Image(req.body['mainImgBase64']);
        delete categoryData['mainImgBase64'];
        fsUpload.upload('/img/categories/' + categoryData._id + '/' + 'main.' + imageBuffer.type, imageBuffer.data).then(function (res, err) {
            if (err) {
                return next(err);
            } else if (res) {
                categoryData.mainImg = 'main.' + imageBuffer.type;
            }
        });
    }

    CategoryModel.findByIdAndUpdate(req.params.id, postData, function (err, response) {
        if (err) {
            return next(err);
        }
        res.json(response);
    });
};

module.exports.remove = function(req, res){
    CategoryModel.findByIdAndRemove(req.params.id, function(err, response){
        if(err) {
            return next(err);
        }
        return res.json(response);
    });
};