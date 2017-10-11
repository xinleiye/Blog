
var express = require("express");
var homeRouter = express.Router();

homeRouter.get("/", function (req, res, next) {

    res.render("main/index", {
        userInfo: req.userInfo
    });
})

module.exports = homeRouter;