var Counter = require('../../models/counters.js').model;
var Promise = require('promise');

module.exports.getNextId = function (sequenceId) {
    return new Promise(function (resolve, reject) {
        Counter.findByIdAndUpdate(sequenceId, {$inc: {sequenceValue: 1}}, function (err, response) {
            if (err) {
                reject(err);
            } else {
                resolve(response);
            }
        });
    });
};