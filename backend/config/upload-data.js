var bodyParser = require('body-parser');
module.exports.json = bodyParser.json({limit: '50mb', extended: true});
module.exports.urlencoded = bodyParser.urlencoded({limit: '50mb', extended: true});
module.exports.fsLocation = "../files"; // set to your desired location