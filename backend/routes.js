var categories = require('./routes/categories.js');
module.exports.categories = categories;

var posts = require('./routes/posts.js'); 
module.exports.posts = posts;

var users = require('./routes/users.js');
module.exports.users = users;

var auth = require('./routes/auth.js');
module.exports.auth = auth;