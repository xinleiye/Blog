
var express = require("express");

var User = require("../models/user");
var content = require("../models/content");

var apiRouter = express.Router();

var responseData;

apiRouter.use(function (req, res, next) {
    responseData = {
        code: 0,
        message: ""
    };
    next();
});

/**
 * 用户注册
 *   验证用户名密码
 */
apiRouter.post("/user/register", function (req, res, next) {

    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;

    if (username === "") {
        responseData.code = 1;
        responseData.message = "用户名不能为空";
        res.json(responseData);
        return;
    }

    if (password === "") {
        responseData.code = 2;
        responseData.message = "密码不能为空";
        res.json(responseData);
        return;
    }

    if (password !== repassword) {
        responseData.code = 3;
        responseData.message = "两次密码不一致";
        res.json(responseData);
        return;
    }

    User.findOne({
        username: username
    }).then(function (userInfo) {
        var user;
        if ( userInfo ) {
            responseData.code = 4;
            responseData.message = "用户名已被注册";
            res.json(responseData);
            return;
        }

        user = new User({
            username: username,
            password: password
        });
        return user.save();
    }).then(function (newUserInfo) {
        responseData.message = "注册成功";
        res.json(responseData);
    });

});

apiRouter.post("/user/login", function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    if (username === "" || password === "") {
        responseData.code = 1;
        responseData.message = "用户名和密码不能为空";
        res.json(responseData);
        return;
    }

    User.findOne({
        username: username,
        password: password
    }).then(function (userInfo) {
        if (!userInfo) {
            responseData.code = 2;
            responseData.message = "用户名或密码错误";
            res.json(responseData);
            return;
        }

        responseData.code = 0;
        responseData.message = "登陆成功";
        responseData.userInfo = {
            id: userInfo._id,
            username: userInfo.username
        }
        req.cookies.set("userInfo", JSON.stringify({
            id: userInfo._id,
            username: userInfo.username
        }));
        res.json(responseData);
        return;
    });
});

/**
 * 退出
 */
apiRouter.get("/user/logout", function (req, res) {
    req.cookies.set("userInfo", null);
    res.json(responseData);
});

/**
 * 获取一篇内容的所有评论
 */
apiRouter.get("/comment", function (req, res) {
    var contentID;

    contentID = req.query.contentID || "";

    content.findOne({
        _id: contentID
    }).then(function(content) {
        responseData.data = content.comments;
        res.json(responseData);
    });
});

/**
 * 评论提交
 */
apiRouter.post("/comment/post", function (req, res) {
    var id, postData;

    id = req.body.contentID || "";
    postData = {
        username: req.userInfo.username,
        postTime: new Date(),
        content: req.body.content
    };

    content.findOne({
        _id: id
    }).then(function (content) {
        content.comments.push(postData);
        return content.save();
    }).then(function (newContent) {
        responseData.message = "评论成功";
        responseData.data = newContent;
        res.json(responseData);
    });
});

module.exports = apiRouter;
