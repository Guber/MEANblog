var fsUpload = require('../helpers/fs/fs-upload.js');
console.log("Install script initiated:");
console.log("\\r\\n##################################################\"");
console.log("Step 1/x: Creating folders...");
fsUpload.mkdir('../../../files').then(function () {
    fsUpload.mkdir('../../../files/posts');
}).then(function () {
    fsUpload.mkdir('../../../files/categories');
}).then(function () {
    fsUpload.mkdir('../../../files/users');
}).catch(function (err) {
        console.log("Error : " + err + "\r\n");
    }
);
console.log("\r\nStep 2/x: Initializing the database...");

var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/MeanBlog');

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + 'mongodb://127.0.0.1:27017/sms-dev');

    mongoose.connection.db.createCollection('users');
    mongoose.connection.db.createCollection('posts');
    mongoose.connection.db.createCollection('categories');
    CounterModel = require('../models').CounterModel;
    var postCounter = new CounterModel({"_id": "posts", "sequence_value": 0});
    postCounter.save(function (err) {
        if (err) {
            console.log("Error : " + err + "\r\n");
        }
        var categoryCounter = new CounterModel({"_id": "categories", "sequence_value": 0});
        categoryCounter.save(function (err) {
            if (err) {
                console.log("Error : " + err + "\r\n");
            }
            var userCounter = new CounterModel({"_id": "users", "sequence_value": 0});
            userCounter.save(function (err) {
                if (err) {
                    console.log("Error : " + err + "\r\n");
                }
                mongoose.connection.close(function () {
                });
            });
        });
    });
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

console.log("\\r\\n##################################################\"");
console.log("Step 3/x: Installing npm packages...");

var exec = require('child_process').exec;
child = exec('cd .. & npm install').stderr.pipe(process.stderr);

