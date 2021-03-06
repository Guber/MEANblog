module.exports.decodeBase64Image = function (dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

    if (matches.length !== 3) {
        return new Error('Invalid input string, must base Base64 format.');
    }

    response.type = matches[1].split('/')[1];
    response.data = new Buffer(matches[2], 'Base64');
    response.name = new Date().getUTCMilliseconds() + "" + Math.floor((Math.random() * 1e6) + 1) + '.' + response.type;

    return response;
};