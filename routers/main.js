
var express = require("express");
var category = require("../models/category");

var homeRouter = express.Router();

homeRouter.get("/", function (req, res, next) {

    var cate;

    cate = req.query.category;

    category.find().then(function (data) {
        res.render("main/index", {
            userInfo: req.userInfo,
            categories: data,
            category: cate
        });
    });

})

module.exports = homeRouter;