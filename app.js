/**
 * 用户发送http请求 -> url -> 解析路由 -> 找到匹配规则 -> 执行指定的函数，返回数据
 * 静态加载：/public -> 静态文件 -> 直接读取指定目录下的文件，返回给用户
 * 动态加载：处理业务逻辑 -> 加载模板 -> 解析模板 -> 返回数据给用户
 */





/**
 * 加载express模块
 */
var express = require("express");

/**
 * 加载模板处理模块
 */
var swig = require("swig");

/**
 * 加载mong数据库
 */
var mongoDB = require("mongoose");

/**
 * 加载body-parser， 用于解析浏览器发送的数据
 */
var bodyParser = require("body-parser");

/**
 * 加载cookies模块
 */
var cookies = require("cookies");

/**
 * 加载数据模型
 */
var user = require("./models/user");

var app = express();

/**
 * 设置静态文件托管
 * 当url以/public开始, 那么直接返回对应路径下的文件
 */
app.use("/public", express.static( __dirname + "/public") );

/**
 * 配置应用模板
 */

/**
 * 1.
 * 定义当前应用所使用的模板引擎
 * para1: 模板引擎的名称，同时也是模板文件的后缀
 * para2: 解析处理模板内容的方法
 */
app.engine("html", swig.renderFile);

/**
 * 2.
 * 设置模板文件存放的目录
 * para1: 必须为views
 * para2: 目录
 */
app.set("views", "./views");

/**
 * 3.
 * 注册使用的模板引擎
 * para1: 必须是 view engine
 * para2: 模板引擎的名称
 */
app.set("view engine", "html");

/**
 * 开发模式，关闭模板缓存
 */
swig.setDefaults({cache: false});

/**
 * body-parser设置
 */
app.use(bodyParser.urlencoded({extended: true}));

/**
 * 设置cookie
 */
app.use(function (req, res, next) {
    req.cookies = new cookies(req, res);

    //解析登陆信息
    req.userInfo = {};
    if (req.cookies.get("userInfo")) {
        try {
            req.userInfo = JSON.parse(req.cookies.get("userInfo"));
            user.findById(req.userInfo.id).then(function (userInfo) {
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            })
        } catch (e) {
            next();
        }
    } else {
        next();
    }
})

/**
 * 模块划分：
 * admin: 后台管理模块
 * api  : api模块，供ajax请求使用
 * /    : 首页模块
 */
app.use("/admin", require("./routers/admin"));
app.use("/api", require("./routers/api"));
app.use("/", require("./routers/main"));

mongoDB.connect("mongodb://localhost:27018/blog", {useMongoClient: true}, function (err) {
    if (err) {
        console.log("数据库连接失败");
    } else {
        console.log("数据库链接成功");
        app.listen(8081);
    }
});
