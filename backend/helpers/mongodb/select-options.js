module.exports.setOptions = function(req) {
    var options = {};

    options['limit'] = parseInt(req.query.limit || req.body.limit || 0);
    options['offset'] = parseInt(req.query.offset || req.body.offset || 0);
    options['orderBy'] = req.query.order_by || req.body.order_by || "_id";
    options['orderDirection'] = req.query.order_direction || req.body.order_direction || "";
    if (req.query.filter || req.body.filter) {
        options['filter'] = new RegExp(req.query.filter || req.body.filter, 'i');
    } else {
        options['filter'] = "";
    }

    if (options['orderDirection'] === 'desc') {
        options['orderDirection'] = '-';
    } else if (options['orderDirection'] === 'asc') {
        options['orderDirection'] = '';
    }

    return options;
};