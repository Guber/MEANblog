var express = require('express');
var adminRouter = express.Router();
var publicRouter = express.Router();
var CategoryController = require('../controllers/categories.js');

adminRouter.get('/', function (req, res) {
    CategoryController.list(req, res);
});

adminRouter.get('/:id', function (req, res) {
    CategoryController.show(req, res);
});

adminRouter.get('/:id/posts', function (req, res) {
    CategoryController.listPosts(req, res);
});

adminRouter.post('/', function (req, res) {
    CategoryController.create(req, res);
});

adminRouter.put('/:id', function (req, res) {
    CategoryController.update(req, res);
});

adminRouter.delete('/:id', function(req, res){
    CategoryController.remove(req, res);
});

module.exports.adminRouter = adminRouter;

publicRouter.get('/', function (req, res) {
    CategoryController.list(req, res);
});

publicRouter.get('/:id', function (req, res) {
    CategoryController.show(req, res);
});

publicRouter.get('/:id/posts', function (req, res) {
    CategoryController.listPosts(req, res);
});

module.exports.publicRouter = adminRouter;