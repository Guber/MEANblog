var express = require('express');
var router = express.Router();
var PostController = require('../controllers/posts.js');

router.get('/', function (req, res) {
    PostController.list(req, res);
});

router.get('/count', function (req, res) {
    PostController.count(req, res);
});

router.get('/:id', function (req, res, next) {
    PostController.show(req, res, next);
});

router.post('/', function (req, res, next) {
    PostController.create(req, res, next);
});

router.put('/:id', function (req, res, next) {
    PostController.update(req, res, next);
});

router.delete('/:id', function (req, res, next) {
    PostController.remove(req, res, next);
});

router.post('/:id/newImages', function (req, res, next) {
    PostController.addImage(req, res, next);
});

router.delete('/:id/newImages/:image_name', function (req, res, next) {
    PostController.removeImage(req,res,next);
});

module.exports = router;