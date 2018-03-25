var categories = require('./categories.js');
module.exports.categories = categories.publicRouter;

var posts = require('./posts.js');
module.exports.posts = posts.publicRouter;

var users = require('./users.js');
module.exports.users = users.publicRouter;

var auth = require('./auth.js');
module.exports.auth = auth;