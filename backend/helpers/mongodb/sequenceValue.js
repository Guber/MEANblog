var Counter = require('../../models/counters.js').model;
var Promise = require('promise');

module.exports.getNextId = function (sequence_id) {
    return new Promise(function (resolve, reject) {
        Counter.findByIdAndUpdate(sequence_id, {$inc: {sequence_value: 1}}, function (err, response) {
            if (err) {
                reject(err);
            } else {
                resolve(response);
            }
        });
    });
};