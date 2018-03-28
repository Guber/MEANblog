var Promise = require('promise');

module.exports.prompt = function (question, callback) {
    var stdin = process.stdin,
        stdout = process.stdout;

    stdin.resume();
    stdout.write(question);

    return new Promise(function (resolve) {
        stdin.once('data', function (data) {
            resolve(data.toString().trim());
        });
    });
};