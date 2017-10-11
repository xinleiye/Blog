
var express = require("express");
var user = require("../models/user");
var category = require("../models/category");

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
    res.render("admin/index", {
        userInfo: req.userInfo
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

/**
 * 分类首页
 */
userRouter.get("/category", function(req, res) {
    var page, pages, limit, skip;

    page = Number(req.body.page || 1);
    limit = 10;

    category.count().then(function(count) {
        pages = Math.ceil(count / limit);
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        skip = (page - 1) * limit;

        /**
         * 按照name排序, 1: 升序， -1: 降序
         */
        category.find().sort({name: -1}).limit(limit).skip(skip).then(function(data) {
            res.render("admin/category_index", {
                userInfo: req.userInfo,
                categories: data,
                page: page,
                pages: pages,
                limit: limit,
                count: count
            });
        });
    }); 
})

/**
 * 分类添加
 */
userRouter.get("/category/add", function(req, res) {
    res.render("admin/category_add", {
        userInfo: req.userInfo
    });
});

/**
 * 保存添加的分类
 */
userRouter.post("/category/add", function(req, res) {
    var name;

    name = req.body.name || "";

    if (name === "") {
        res.render("admin/error", {
            userInfo: req.userInfo,
            message: "名称不能为空"
        });
        return;
    }

    // 检查数据库中是否有重名
    category.findOne({
        name: name
    }).then(function(rs) {
        if (rs) {
            res.render("admin/error", {
                userInfo: req.userInfo,
                message: "分类已存在"
            });
            return Promise.reject();
        } else {
            console.log("save data");
            return new category({
                name: name
            }).save();
        }
    }).then(function(newdata) {
        res.render("admin/success", {
            userInfo: req.Info,
            message: "分类保存成功",
            url: "/admin/category"
        })
    })

});


module.exports = userRouter;
