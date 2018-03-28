var mongoose = require('../config/database.js');
var models = require('../models/_models.js');
var helpers = require('../helpers/_helpers.js');
var bcrypt = require('bcrypt');

var resourceData = {};

helpers.Prompt.prompt('Desired username:').then(usernamePromptResponse);

function usernamePromptResponse(input) {
    resourceData.username = input;
    models.UserModel.findOne({ 'username': input }).then(function(doc){
        if(!doc){
            return helpers.Prompt.prompt('Type password:');
        } else {
            console.log("Username already in use.");
            helpers.Prompt.prompt('Desired username:').then(usernamePromptResponse);
            //process.exit();
        }
    });
}
/*
.then(function (input) {
    resourceData.password1 = input;
    return helpers.Prompt.prompt('Re-type password:');
}).then(function (input) {
    resourceData.password2 = input;
    if (resourceData.password1 !== resourceData.password2) {
        console.log("Passwords do not match. Exiting.");
        process.exit();
    } else {
        bcrypt.hash(resourceData.password1, 10, function (err, hash) {
            resourceData.password = hash;
            delete resourceData.password1;
            delete resourceData.password2;

            helpers.SequenceValue.getNextId("users").then(function (sequence, err) {
                if (!sequence) {
                    console.log("Error fetching sequence id.");
                    process.exit();
                }
                resourceData._id = sequence.sequenceValue;
                console.log(sequence);
                helpers.FSUpload.mkdir('/img/users/' + resourceData._id+'/').then(function () {
                    var newUser = new models.UserModel(resourceData);
                    console.log(resourceData);
                    newUser.save(function (err) {
                        if (err) {
                            console.log(err);
                            process.exit();
                        }
                        console.log("Successfully created a new user: " + resourceData.username);
                        process.exit();
                    });
                }).catch(function (err) {
                    console.log(err);
                });
            })
        });
    }
});*/