var categories = require('./routes/categories.js');
module.exports.categories = categories.publicRouter;

var posts = require('./routes/posts.js');
module.exports.posts = posts.publicRouter;

var users = require('./routes/users.js');
module.exports.users = users.publicRouter;

var auth = require('./routes/auth.js');
module.exports.auth = auth;