var express = require('express');
var router = express.Router();
var authControler = require('../controllers/auth');
//passport stuff
router.post("/login", function(req, res) {
    return authControler.login(req,res);
});

module.exports = router;