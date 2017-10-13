var mongoose = require("mongoose");

module.exports = new mongoose.Schema({
    //关联字段 - 分类ID
    category: {
        //类型
        type: mongoose.Schema.Types.ObjectId,
        ref: "category"
    },

    //内容作者
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },

    //内容创建时间
    addTime: {
        type: Date,
        default: new Date()
    },

    //阅读
    views: {
        type: Number,
        default: 0
    },

    //分类标题
    title: String,

    //简介
    description: {
        type: String,
        default: ""
    },

    //内容
    content: {
        type: String,
        default: ""
    }
})