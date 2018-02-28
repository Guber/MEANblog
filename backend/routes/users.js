var express = require('express');
var adminRouter = express.Router();
var publicRouter = express.Router();
var UserController = require('../controllers/users.js');

adminRouter.get('/', function (req, res) {
    UserController.list(req, res);
});

adminRouter.get('/count', function (req, res) {
    UserController.count(req, res);
});

adminRouter.get('/self', function (req, res) {
    UserController.showSelf(req, res);
});

adminRouter.get('/:id', function (req, res) {
    UserController.show(req, res);
});

adminRouter.get('/:id/posts', function (req, res) {
    UserController.showPosts(req, res);
});

adminRouter.post('/', function (req, res) {
    UserController.create(req, res);
});

adminRouter.put('/self', function (req, res) {
    UserController.updateSelf(req, res);
});

adminRouter.put('/:id', function (req, res) {
    UserController.update(req, res);
});

adminRouter.delete('/:id', function (req, res, next) {
    UserController.remove(req, res, next);
});

module.exports.adminRouter = adminRouter;


publicRouter.get('/', function (req, res) {
    UserController.list(req, res);
});

publicRouter.get('/count', function (req, res) {
    UserController.count(req, res);
});

publicRouter.get('/:id', function (req, res) {
    UserController.show(req, res);
});

publicRouter.get('/:id/posts', function (req, res) {
    UserController.showPosts(req, res);
});


module.exports.publicRouter = publicRouter;