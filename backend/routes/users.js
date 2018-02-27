var express = require('express');
var router = express.Router();
var UserController = require('../controllers/users.js');

router.get('/', function (req, res) {
    UserController.list(req, res);
});

router.get('/count', function (req, res) {
    UserController.count(req, res);
});

router.get('/self', function (req, res) {
    UserController.showSelf(req, res);
});

router.get('/:id', function (req, res) {
    UserController.show(req, res);
});

router.get('/:id/posts', function (req, res) {
    UserController.showPosts(req, res);
});

router.post('/', function (req, res) {
    UserController.create(req, res);
});

router.put('/self', function (req, res) {
    UserController.updateSelf(req, res);
});

router.put('/:id', function (req, res) {
    UserController.update(req, res);
});

router.delete('/:id', function (req, res, next) {
    UserController.remove(req, res, next);
});

module.exports = router;