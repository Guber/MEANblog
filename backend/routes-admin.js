var categories = require('./routes/categories.js');
module.exports.categories = categories.adminRouter;

var posts = require('./routes/posts.js'); 
module.exports.posts = posts.adminRouter;

var users = require('./routes/users.js');
module.exports.users = users.adminRouter;
