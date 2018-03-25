var categories = require('./categories.js');
module.exports.categories = categories.adminRouter;

var posts = require('./posts.js');
module.exports.posts = posts.adminRouter;

var users = require('./users.js');
module.exports.users = users.adminRouter;
