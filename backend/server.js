var express = require('express');
var mongoose = require('./config/database.js');
var app = express();
app.set('env', 'development');

// predefined settings from config scripts
// api data upload settings
var uploadData = require('./config/upload-data.js');
app.use(uploadData.json);
app.use(uploadData.urlencoded);
// access control header settings
var accessControl = require('./config/acccess-control.js');
app.use(accessControl.setHeader);
var errorHandling = require('./config/error-handling.js');
if (app.get('env') === 'development') {
    app.use(errorHandling.errorHandlingDev);
    process.on('uncaughtException', function (err) {
        console.log('\r\nUncaught exception:\r\n ' + err);
    });
} else {
    app.use(errorHandling.errorHandlingProd);
}

// api routes definitions
var routes = require('./routes.js');
//public api routes
app.use('/files', express.static('../files'));
app.use('/api/categories', routes.categories);
app.use('/api/posts', routes.posts);
app.use('/api/users', routes.users);
app.use('/api/auth', routes.auth);
// admin jwt-auth protected api routes
var admin_jwt = require('./helpers/auth/admin-jwt.js');
app.use('/api/admin/*', admin_jwt.verifyAdmin);
var adminRoutes = require('./routes-admin.js');
app.use('/api/admin/categories', adminRoutes.categories);
app.use('/api/admin/posts', adminRoutes.posts);
app.use('/api/admin/users', adminRoutes.users);

// dedicated app port
app.listen(3000);