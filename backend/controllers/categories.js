var Base64 = require('../helpers/base64/base64.js');
var Category = require('../models/categories.js').model;
var Post = require('../models/posts.js').model;
var Counter = require('../models/counters.js').model;
var fs = require('fs');

module.exports.list = function (req, res) {
    Category.find(function (err, response) {
        res.json(response);
    });
};

module.exports.show = function (req, res) {
    Category.findById(req.params.id, function (err, response) {
        res.json(response);
    });
};

module.exports.listPosts = function (req, res) {
    Post.find({'category_id': parseInt(req.params.id)}, function (err, response) {
        if (err) {
            return res.json({
                id: -1, message: "Error whilst fetching data."
            });
        }
        return res.json(response);
    });
};

module.exports.create = function (req, res) {
    var categoryData = req.body;
    if (!categoryData.name) {
        res.send("Not enough data.");
    }

    Counter.findByIdAndUpdate("category_id", {$inc: {sequence_value: 1}}, function (err, response) {
        var newCategory = new Category({
            _id: response.sequence_value,
            name: categoryData.name
        });

        if (categoryData.description) {
            newCategory.description = categoryData.description;
        }

        if (categoryData.type) {
            newCategory.type = categoryData.type;
        }

        if (categoryData.subcategories) {
            newCategory.subcategories = categoryData.subcategories;
        }

        if (categoryData.main_img_data !== undefined) {
            console.log(categoryData.main_img_data);

            var path = './public/img/categories/';

            var imageBuffer = Base64.decodeBase64Image(categoryData.main_img_data);
            fs.writeFile(path + response.sequence_value  + '.' +imageBuffer.type, imageBuffer.data, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    newCategory.main_img = response.sequence_value  + '.' +imageBuffer.type;
                }

                console.log("The file was saved!");
            });
        }
        newCategory.save(function (err) {
            if (err)
                res.send("error");
            else
                res.send("success");
        });

    });
};

module.exports.update = function (req, res) {
    var category_id = req.body._id;
    var categoryData = {};
    categoryData.name = req.body.name;
    categoryData.description = req.body.description;

    if (req.body.main_img_data !== undefined) {
        var path = './files/img/categories/';
        var imageBuffer = Base64.decodeBase64Image(req.body.main_img_data);
        categoryData.main_img = req.params.id  + '.' +imageBuffer.type;
        fs.writeFile(path + "/"+ req.params.id + "/" +  req.params.id +'.' +imageBuffer.type, imageBuffer.data, function (err) {
            if (err) {
                console.log(err);
            }


        });
    }

    Category.findByIdAndUpdate(category_id, categoryData, function (err, response) {
        res.json(response);
    });
};

module.exports.remove = function(req, res){
    Category.findByIdAndRemove(req.params.id, function(err, response){
        if(err) res.json({message: "Error in deleting category id " + req.params.id});
        else res.json({message: "Category with id " + req.params.id + " removed."});
    });
};