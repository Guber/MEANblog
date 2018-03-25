module.exports = {
    errorHandlingDev: function(err, req, res, next) {
        console.log({
            message: err.message,
            error: err
        });
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    },
    errorHandlingProd: function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: {}
        });
        res.send(err)
    }
};