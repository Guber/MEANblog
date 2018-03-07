var express = require('express');
var router = express.Router();
var authControler = require('../controllers/auth');

router.post("/login", function(req, res, next) {
    return authControler.login(req,res, next);
});

module.exports = router;