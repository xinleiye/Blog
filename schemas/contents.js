var mongoose = require("mongoose");

module.exports = new mongoose.Schema({
    //关联字段 - 分类ID
    category: {
        //类型
        type: mongoose.Schema.Types.ObjectId,
        ref: "category"
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