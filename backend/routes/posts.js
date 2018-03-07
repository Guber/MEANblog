var express = require('express');
var adminRouter = express.Router();
var publicRouter = express.Router();
var PostController = require('../controllers/posts.js');

adminRouter.get('/', function (req, res, next) {
    PostController.list(req, res, next);
});

adminRouter.get('/count', function (req, res, next) {
    PostController.count(req, res, next);
});

adminRouter.get('/:id', function (req, res, next) {
    var resourceId = parseInt(req.params.id);
    if (isNaN(resourceId)) {
        return res.status(400).json({message: "Resource ID required as an integer."});
    }
    PostController.show(req, res, next, resourceId);
});

adminRouter.post('/', function (req, res, next) {
    PostController.create(req, res, next);
});

adminRouter.put('/:id', function (req, res, next) {
    var resourceId = parseInt(req.params.id);
    if (isNaN(resourceId)) {
        return res.status(400).json({message: "Resource ID required as an integer."});
    }
    PostController.update(req, res, next, resourceId);
});

adminRouter.delete('/:id', function (req, res, next) {
    var resourceId = parseInt(req.params.id);
    if (isNaN(resourceId)) {
        return res.status(400).json({message: "Resource ID required as an integer."});
    }

    PostController.remove(req, res, next, resourceId);
});

adminRouter.post('/:id/newImages', function (req, res, next) {
    var resourceId = parseInt(req.params.id);
    if (isNaN(resourceId)) {
        return res.status(400).json({message: "Resource ID required as an integer."});
    }

    PostController.addImage(req, res, next, resourceId);
});

adminRouter.delete('/:id/newImages/:image_name', function (req, res, next) {
    var resourceId = parseInt(req.params.id);
    if (isNaN(resourceId)) {
        return res.status(400).json({message: "Resource ID required as an integer."});
    }

    PostController.removeImage(req,res,next, resourceId);
});

module.exports.adminRouter = adminRouter;

publicRouter.get('/', function (req, res, next) {
    PostController.list(req, res, next);
});

publicRouter.get('/count', function (req, res, next) {
    PostController.count(req, res, next);
});

publicRouter.get('/:id', function (req, res, next) {
    var resourceId = parseInt(req.params.id);
    if (isNaN(resourceId)) {
        return res.status(400).json({message: "Resource ID required as an integer."});
    }

    PostController.show(req, res, next, resourceId);
});

module.exports.publicRouter = publicRouter;