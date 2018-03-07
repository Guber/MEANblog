var express = require('express');
var adminRouter = express.Router();
var publicRouter = express.Router();
var admin_jwt = require('../helpers/auth/admin-jwt.js');
var UserController = require('../controllers/users.js');

adminRouter.get('/', function (req, res, next) {
    UserController.list(req, res, next);
});

adminRouter.get('/count', function (req, res, next) {
    UserController.count(req, res, next);
});

adminRouter.get('/self', function (req, res, next) {
    var resourceId = admin_jwt.getUserIdFromToken(req);
    if (isNaN(resourceId)) {
        return res.status(400).json({message: "Resource ID required as an integer."});
    }

    UserController.show(req, res, next, resourceId);
});

adminRouter.get('/:id', function (req, res, next) {
    var resourceId = parseInt(req.params.id);
    if (isNaN(resourceId)) {
        return res.status(400).json({message: "Resource ID required as an integer."});
    }
    UserController.show(req, res, next, resourceId);
});

adminRouter.get('/:id/posts', function (req, res, next) {
    var resourceId = parseInt(req.params.id);
    if (isNaN(resourceId)) {
        return res.status(400).json({message: "Resource ID required as an integer."});
    }
    UserController.showPosts(req, res, next, resourceId);
});

adminRouter.post('/', function (req, res, next) {
    UserController.create(req, res, next);
});

adminRouter.put('/self', function (req, res, next) {
    var resourceId = admin_jwt.getUserIdFromToken(req);
    if (isNaN(resourceId)) {
        return res.status(400).json({message: "Resource ID required as an integer."});
    }

    UserController.update(req, res, next, resourceId);
});

adminRouter.put('/:id', function (req, res, next) {
    var resourceId = parseInt(req.params.id);
    if (isNaN(resourceId)) {
        return res.status(400).json({message: "Resource ID required as an integer."});
    }

    UserController.update(req, res, next, resourceId);
});

adminRouter.delete('/:id', function (req, res, next) {
    var resourceId = parseInt(req.params.id);
    if (isNaN(resourceId)) {
        return res.status(400).json({message: "Resource ID required as an integer."});
    }

    UserController.remove(req, res, next, resourceId);
});

module.exports.adminRouter = adminRouter;


publicRouter.get('/', function (req, res, next) {
    UserController.list(req, res, next);
});

publicRouter.get('/count', function (req, res, next) {
    UserController.count(req, res, next);
});

publicRouter.get('/:id', function (req, res, next) {
    var resourceId = parseInt(req.params.id);
    if (isNaN(resourceId)) {
        return res.status(400).json({message: "Resource ID required as an integer."});
    }

    UserController.show(req, res, next, resourceId);
});

publicRouter.get('/:id/posts', function (req, res, next) {
    var resourceId = parseInt(req.params.id);
    if (isNaN(resourceId)) {
        return res.status(400).json({message: "Resource ID required as an integer."});
    }

    UserController.showPosts(req, res, next, resourceId);
});


module.exports.publicRouter = publicRouter;