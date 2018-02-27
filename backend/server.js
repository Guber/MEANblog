var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');

var upload = multer({
    limits: { fieldSize: 250000000 }
});
var app = express();
var mongoose = require('./config/database.js');
var admin_jwt = require('./helpers/auth/admin-jwt.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());

// Add headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, x-xsrf-token,Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


/*if (app.get('env') === 'development') {

    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
      /!*  res.render('error', {
            message: err.message,
            error: err
        });*!/
    });

}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
   /!* res.render('error', {
        message: err.message,
        error: {}
    });*!/
   res.send(err)
});*/
//routes of our resources
var routes = require('./routes.js'); 
app.use('/api/categories', routes.categories);
app.use('/api/posts', routes.posts);
app.use('/api/users', routes.users);
app.use('/api/auth', routes.auth);

var admin = require('./helpers/auth/admin-session.js');
//app.use('/admin', admin.auth);
app.use('/admin', express.static('admin/dist'));

//app.use('/public', express.static('public/dist'));
app.use('/files', express.static('files'));

app.get("/secret",[admin_jwt.verifyAdmin], function(req, res){
    res.json({message: "Success! You can not see this without a token"});
});

app.listen(3000);

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});
