var express = require('express');
var router = express.Router();

var User = require('../models/users.js').model;
var Token = require('../models/tokens.js').model;

var _ = require("lodash");
var jwt = require('jsonwebtoken');
var jwtOptions = {};
var passportJWT = require("passport-jwt");
var ExtractJwt = passportJWT.ExtractJwt;
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'tasmanianDevil';
var bcrypt = require('bcrypt');
const saltRounds = 10;


//passport stuff
router.post("/login", function(req, res) {
    if(req.body.name && req.body.password){
        var name = req.body.name;
        var password = req.body.password;
    }
    // usually this would be a database call:
    User.findOne({ 'username': name }, function (err, response) {
        if (!response) res.status(401).json({message:"No such user found."});
        if (err) res.status(500).json({message:"Error occurred while processing request."});
        if (response) {
          if (bcrypt.compareSync(req.body.password, response.password)) {
              today = new Date();
              var exp = Math.floor( today / 1000  + 604800);
              var iat = Math.floor( today / 1000 );
              var payload = {exp: exp, iat: iat, 'sub': response._id, 'admin': response.admin};
              var token = jwt.sign(payload, jwtOptions.secretOrKey);
              var mongoToken = new Token({'token': token, 'exp': exp, 'iat': iat, 'user_id': response._id, 'admin': response.admin });
              mongoToken.save();
              res.json({message: "ok", token: token});
          } else {
              res.status(401).json({message:"Provided password doesn't match."});
          }
        }
    });

});

//export this router to use in our index.js
module.exports = router;