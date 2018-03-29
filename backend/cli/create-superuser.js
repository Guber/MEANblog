var mongoose = require('../config/database.js');
var models = require('../models/_models.js');
var helpers = require('../helpers/_helpers.js');
var bcrypt = require('bcrypt');

var resourceData = {};

helpers.Prompt.prompt('Desired username:').then(usernamePromptResponse);

function usernamePromptResponse(input) {
    resourceData.username = input;
    models.UserModel.findOne({'username': input}).then(function (doc) {
        if (!doc) {
            helpers.Prompt.prompt('Type password:').then(password1PromptResponse);
        } else {
            console.log("Username already in use.");
            helpers.Prompt.prompt('Desired username:').then(usernamePromptResponse);
        }
    });
}

function password1PromptResponse(input) {
    resourceData.password1 = input;
    helpers.Prompt.prompt('Re-type password:').then(password2PromptResponse);
}


function password2PromptResponse(input) {
    resourceData.password2 = input;
    if (resourceData.password1 !== resourceData.password2) {
        console.log("Passwords do not match.");
        helpers.Prompt.prompt('Type password:').then(password1PromptResponse);
    } else {
        bcrypt.hash(resourceData.password1, 10).then(function (err, hash) {
            resourceData.password = hash;
            delete resourceData.password1;
            delete resourceData.password2;

            helpers.SequenceValue.getNextId("users").then(function (sequence) {
                if (!sequence) {
                    console.log("Error fetching sequence id.");
                    process.exit();
                }
                resourceData._id = sequence.sequenceValue;
                helpers.FSUpload.mkdir('/img/users/' + resourceData._id + '/');
            }).then(function(directory, err){
                resourceData.admin = true;
                var newUser = new models.UserModel(resourceData);
                newUser.save();
            }).then(function (doc,errr) {
                console.log("Successfully created a new user: " + resourceData.username);
                process.exit();
            }).catch(function (err) {
                console.log(err);
                process.exit();
            })
        });
    }
}