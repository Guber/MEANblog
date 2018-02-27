var _ = require("lodash");
var jwt = require('jsonwebtoken');
var User = require('../../models/users.js').model;

module.exports.verifyAdmin = function(req, res, next){
    var auth_header = req.headers.authorization;
    var token = "";

    if (_.includes(auth_header, "bearer ")){
        token = auth_header.replace("bearer ", "");
        jwt.verify(token, 'tasmanianDevil', function(err, decoded) {
            if (decoded.admin) {
                return next();
            }
            else res.status(403).send("Token unauthorized.");
        });
    } else {
        res.status(401).send("Authorization token missing.");
    }
};

module.exports.getUserIdFromToken = function(req){
    var auth_header = req.headers.authorization;
    var token = "";
    var user_id = -1;
    if (_.includes(auth_header, "bearer ")){
        token = auth_header.replace("bearer ", "");
        jwt.verify(token, 'tasmanianDevil', function(err, decoded) {
            if (decoded) {
                user_id = decoded.sub;
            }
            else res.status(401).send("Token unauthorized.");
        });
    }

    return user_id;
};