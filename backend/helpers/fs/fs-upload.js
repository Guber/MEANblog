var Promise = require('promise');
var fs = require('fs');
var uploadData = require('../../config/upload-data.js');

module.exports.upload = function (fsLocationSuffix, fileData) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(uploadData.fsLocation + fsLocationSuffix, fileData, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }

        });
    });
};