var Promise = require('promise');
var fs = require('fs');
var uploadData = require('../../config/upload-data.js');

module.exports.upload = function (fileLocation, fileData) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(uploadData.fsLocation + fileLocation, fileData, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(uploadData.fsLocation + fileLocation);
            }

        });
    });
};

module.exports.mkdir = function (dirName) {
    return new Promise(function (resolve, reject) {
        fs.mkdir(uploadData.fsLocation + dirName, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(uploadData.fsLocation + dirName);
            }
        });
    });
};