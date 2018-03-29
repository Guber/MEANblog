var express = require('express');
var mongoose = require('./config/database.js');
var app = express();
//app.set('env', 'development');

// predefined settings from config scripts
var config = require('./config/_config.js');
// api data upload settings
app.use(config.uploadData.json);
app.use(config.uploadData.urlencoded);
// access control header settings
app.use(config.accessControl.setHeader);
if (app.get('env') === 'development') {
    app.use(config.errorHandling.errorHandlingDev);
} else {
    app.use(config.errorHandling.errorHandlingProd);
}

// api routes definitions
var routes = require('./routes/_routes.js');
//public api routes
app.use('/files', express.static(config.uploadData.fsLocation));
app.use('/api/categories', routes.categories);
app.use('/api/posts', routes.posts);
app.use('/api/users', routes.users);
app.use('/api/auth', routes.auth);
// admin jwt-auth protected api routes
var admin_jwt = require('./helpers/auth/admin-jwt.js');
app.use('/api/admin/*', admin_jwt.verifyAdmin);
var adminRoutes = require('./routes/_routes-admin.js');
app.use('/api/admin/categories', adminRoutes.categories);
app.use('/api/admin/posts', adminRoutes.posts);
app.use('/api/admin/users', adminRoutes.users);

// dedicated app port
app.listen(1337);