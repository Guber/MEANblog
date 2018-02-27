var express = require('express');
var router = express.Router();
var CategoryController = require('../controllers/categories.js');

router.get('/', function (req, res) {
    CategoryController.list(req, res);
});

router.get('/:id', function (req, res) {
    CategoryController.show(req, res);
});

router.get('/:id/posts', function (req, res) {
    CategoryController.listPosts(req, res);
});

router.post('/', function (req, res) {
    CategoryController.create(req, res);
});

router.put('/:id', function (req, res) {
    CategoryController.update(req, res);
});

router.delete('/:id', function(req, res){
    CategoryController.remove(req, res);
});

module.exports = router;