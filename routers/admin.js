
var express = require("express");
var user = require("../models/user");

var userRouter = express.Router();

userRouter.use(function (req, res, next) {
    if (!req.userInfo.isAdmin) {
        res.send("Not admin");
        return
    }
    next();
});
/**
 * 用户管理首页
 */
userRouter.get("/", function (req, res, next) {
    res.render("admin/index", function () {
        userInfo: req.userInfo;
    });
});

/**
 * 用户管理
 * 数据分页显示：
 * limit(number), 限制读取的数据
 * skip(number), 忽略数据的条数
 */
userRouter.get("/user", function(req, res) {
    var page, limit, skip;
    var pages;

    limit = 2;
    pages = 0;
    page = Number(req.query.page || 1);
    user.count().then(function (count) {
        //console.log(count);
        pages = Math.ceil(count / limit);
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        skip = (page - 1) * limit;
        user.find().limit(2).skip(skip).then(function (users) {
            //console.log(users);
            res.render("admin/user_index", {
                //给user_index模板传数据
                userInfo: req.userInfo,
                users: users,
                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });
    });
});


module.exports = userRouter;
