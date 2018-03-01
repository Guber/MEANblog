var User = require('../models/users.js').model;
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

login =  function(req, res) {
    if(req.body.name === undefined || req.body.password === undefined){
        return res.status(400).json({message: "Not enough data to login. Note: username and password are required."});
    }
    const username = req.body.name;
    const password = req.body.password;
    User.findOne({ 'username': username }, function (err, response) {
        if (err) {
            return next(err);
        }
        if (!response) {
            res.status(401).json({message:"No such user found."});
        }

        if (bcrypt.compareSync(password, response.password)) {
            today = new Date();
            var exp = Math.floor( today / 1000  + 604800);
            var iat = Math.floor( today / 1000 );
            var payload = {exp: exp, iat: iat, 'sub': response._id, 'admin': response.admin};
            var token = jwt.sign(payload, 'tasmanianDevil');
            res.json({message: "ok", token: token});
        } else {
            res.status(401).json({message:"Provided password doesn't match."});
        }
    }).select('+password');
};

module.exports.login = login;