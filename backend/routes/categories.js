var express = require('express');
var adminRouter = express.Router();
var publicRouter = express.Router();
var CategoryController = require('../controllers/categories.js');

adminRouter.get('/', function (req, res, next) {
    CategoryController.list(req, res, next);
});

adminRouter.get('/:id', function (req, res, next) {
    var resourceId = parseInt(req.params.id);
    if (isNaN(resourceId)) {
        return res.status(400).json({message: "Resource ID required as an integer."});
    }

    CategoryController.show(req, res, next, resourceId);
});

adminRouter.get('/:id/posts', function (req, res, next) {
    var resourceId = parseInt(req.params.id);
    if (isNaN(resourceId)) {
        return res.status(400).json({message: "Resource ID required as an integer."});
    }

    CategoryController.listPosts(req, res, next, resourceId);
});

adminRouter.post('/', function (req, res, next) {
    CategoryController.create(req, res, next);
});

adminRouter.put('/:id', function (req, res, next) {
    var resourceId = parseInt(req.params.id);
    if (isNaN(resourceId)) {
        return res.status(400).json({message: "Resource ID required as an integer."});
    }

    CategoryController.update(req, res, next, resourceId);
});

adminRouter.delete('/:id', function(req, res, next){
    var resourceId = parseInt(req.params.id);
    if (isNaN(resourceId)) {
        return res.status(400).json({message: "Resource ID required as an integer."});
    }

    CategoryController.remove(req, res, next, resourceId);
});

module.exports.adminRouter = adminRouter;

publicRouter.get('/', function (req, res, next) {
    CategoryController.list(req, res, next);
});

publicRouter.get('/:id', function (req, res, next) {
    var resourceId = parseInt(req.params.id);
    if (isNaN(resourceId)) {
        return res.status(400).json({message: "Resource ID required as an integer."});
    }

    CategoryController.show(req, res, next, resourceId);
});

publicRouter.get('/:id/posts', function (req, res, next) {
    var resourceId = parseInt(req.params.id);
    if (isNaN(resourceId)) {
        return res.status(400).json({message: "Resource ID required as an integer."});
    }

    CategoryController.listPosts(req, res, next, resourceId);
});

module.exports.publicRouter = adminRouter;