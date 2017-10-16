
var express = require("express");
var category = require("../models/category");
var content = require("../models/content");

var homeRouter = express.Router();

//用于存储传递给 main/index 页面的数据
var data = {};

homeRouter.use(function (req, res, next) {
    data.userInfo = req.userInfo;

    category.find().then(function (categories) {
        data.categories = categories;
        next();
    });

});

homeRouter.get("/", function (req, res, next) {

    var where, page, pages, limit, skip;

    data.category = req.query.category || "";

    where = {};
    limit = 10;
    page = Number(req.query.page) || 1;

    if (data.category) {
        where.category = data.category;
    }

    content.where(where).count().then(function (count) {
        pages = Math.ceil(count / limit);
        page = Math.min(page, pages);
        page = Math.max(page, 1);

        data.count = count;
        data.page = page;
        data.pages = pages;
        data.limit = limit;
        skip = (page - 1) * limit;

        return content.where(where).find().limit(limit).skip(skip).populate(["category", "user"]).sort({addTime: -1});

    }).then(function (contents) {
        data.contents = contents;
        res.render("main/index", data);
    });

});

module.exports = homeRouter;
