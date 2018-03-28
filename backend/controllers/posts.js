var models = require('../models/_models.js');
var helpers = require('../helpers/_helpers.js');

module.exports.list = function (req, res, next) {
    var options = helpers.SelectOptions.setOptions(req);
    var listPromise;
    if (options.filter) {
        listPromise = models.PostModel.find({$or: [{title: options.filter}, {author: options.filter}, {description: options.filter}, {content: options.filter}]})
            .skip(options.offset).limit(options.limit).sort(options.orderDirection + '' + options.orderBy);
    } else {
        listPromise = models.PostModel.find().skip(options.offset).limit(options.limit).sort(options.orderDirection + '' + options.orderBy);
    }

    listPromise.then(
        function (doc) {
            return res.json(doc);
        }
    ).catch(function (err) {
        return next(err);
    })
};
module.exports.show = function (req, res, next, resourceId) {
    models.PostModel.findById(resourceId, function (err, doc) {
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
    models.PostModel.count(function (err, response) {
        if (err) {
            return res.status(500).json({
                id: -1, message: "Error whilst fetching data from the database."
            });
        }
        return res.json(response);
    });
};

module.exports.create = function (req, res, next) {
    var createPromise;
    var newPost;
    var resourceData = req.body;
    if (resourceData['title'] === undefined) {
        return res.status(400).json({message: "Not enough data to create a a resource. Note: title is required."});
    }

    helpers.SequenceValue.getNextId("post_id")
        .then(function (sequence) {
            resourceData._id = sequence.sequence_value;
            helpers.FSUpload.mkdir('/img/posts/' + resourceData._id + "/")
        }).then(function (directory, err) {
        if (resourceData['mainImgBase64']) {
            var imageBuffer = helpers.Base64.decodeBase64Image(req.body['mainImgBase64']);
            delete resourceData['mainImgBase64'];
            resourceData.mainImg = 'main.' + imageBuffer.type;
            newPost = new models.PostModel(resourceData);
            helpers.FSUpload.upload('/img/posts/' + resourceData._id + '/' + 'main.' + imageBuffer.type, imageBuffer.data)
                .then(createPromise = newPost.save())
        } else {
            newPost = new models.PostModel(resourceData);
            createPromise = newPost.save()
        }

        createPromise.then(function (doc) {
            res.json(doc)
        }).catch(function (err) {
            return next(err);
        });

    });
}
;

module.exports.update = function (req, res, next, resourceId) {
    var resourceData = req.body;
    delete resourceData['images'];
    var updatePromise;
    if (resourceData['mainImgBase64']) {
        var imageBuffer = helpers.Base64.decodeBase64Image(resourceData['mainImgBase64']);
        resourceData.mainImg = imageBuffer.name;
        delete resourceData['mainImgBase64'];
        helpers.FSUpload.upload('/img/posts/' + resourceId + '/' + imageBuffer.name, imageBuffer.data)
            .then(updatePromise = models.PostModel.findByIdAndUpdate(resourceId, resourceData))
            .catch(function (err) {
                return next(err);
            });
    } else {
        updatePromise = models.PostModel.findByIdAndUpdate(resourceId, resourceData);
    }

    updatePromise.then(function (doc) {
        res.json(doc)
    }).catch(function (err) {
        return next(err);
    });
};

module.exports.addImage = function (req, res, next, resourceId) {
    if (req.body.imgDataBase64 === undefined) {
        return res.status(400).json({message: "Not enough data to create a a resource. Note: imgDataBase64 is required."});
    }

    var imageBuffer = helpers.Base64.decodeBase64Image(req.body.imgDataBase64);

    helpers.FSUpload.upload('/img/posts/' + resourceId + "/" + imageBuffer.name, imageBuffer.data)
        .then(models.PostModel.findByIdAndUpdate(resourceId, {$push: {"images": imageBuffer.name}}, {'new': true}).exec())
        .then(function (doc) {
            res.json(doc)
        }).catch(function (err) {
        return next(err);
    });
};

module.exports.removeImage = function (req, res, next, resourceId) {
    models.PostModel.findByIdAndUpdate(resourceId, {$pull: {"images": req.params.image_name}}, {'new': true})
        .then(helpers.FSUpload.unlink('/img/posts/' + resourceId + "/" + req.params.image_name))
        .then(res.json({message: "Deleted image for post: " + resourceId + " with a unique filename: " + req.params.image_name + "."}))
        .catch(function (err) {
            return next(err);
        });
};

module.exports.remove = function (req, res, next, resourceId) {
    models.PostModel.findByIdAndRemove(resourceId)
        .then(helpers.FSUpload.rimraf('/img/posts/' + resourceId + "/"))
        .then(res.json({message: "Post with id " + resourceId + " removed."}))
        .catch(function (err) {
            return next(err);
        });
};