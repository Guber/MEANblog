var express = require('express');
var adminRouter = express.Router();
var publicRouter = express.Router();
var PostController = require('../controllers/posts.js');

adminRouter.get('/', function (req, res) {
    PostController.list(req, res);
});

adminRouter.get('/count', function (req, res) {
    PostController.count(req, res);
});

adminRouter.get('/:id', function (req, res, next) {
    PostController.show(req, res, next);
});

adminRouter.post('/', function (req, res, next) {
    PostController.create(req, res, next);
});

adminRouter.put('/:id', function (req, res, next) {
    PostController.update(req, res, next);
});

adminRouter.delete('/:id', function (req, res, next) {
    PostController.remove(req, res, next);
});

adminRouter.post('/:id/newImages', function (req, res, next) {
    PostController.addImage(req, res, next);
});

adminRouter.delete('/:id/newImages/:image_name', function (req, res, next) {
    PostController.removeImage(req,res,next);
});

module.exports.adminRouter = adminRouter;

publicRouter.get('/', function (req, res) {
    PostController.list(req, res);
});

publicRouter.get('/count', function (req, res) {
    PostController.count(req, res);
});

publicRouter.get('/:id', function (req, res, next) {
    PostController.show(req, res, next);
});

module.exports.publicRouter = publicRouter;