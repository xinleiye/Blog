
var express = require("express");
var category = require("../models/category");

var homeRouter = express.Router();

homeRouter.get("/", function (req, res, next) {

    category.find().then(function(data) {
        res.render("main/index", {
            userInfo: req.userInfo,
            categories: data
        });
    });
    /*res.render("main/index", {
        userInfo: req.userInfo
    });*/
})

module.exports = homeRouter;