

//
$.ajax({
    url: "/api/comment",
    data: {
        contentID: $("#contentId").val()
    },
    success: function(resData) {
        renderComment(resData.data);
    }
});

$("#messageBtn").on("click", function () {
    $.ajax({
        type: "POST",
        url: "/api/comment/post",
        data: {
            contentID: $("#contentId").val(),
            content: $("#messageContent").val()
        },
        success: function(res) {
            $("#messageContnet").val("");
            renderComment(res.data.comments);
        }
    });
});

function renderComment(comments) {
    var i, len, html;
    var $ali, allPages, page, limit, start, end;

    page = 1;
    limit = 5;
    len = comments.length;
    $("#messageCount").text(len);

    allPages = Math.ceil(len / limit);
    $ali = $(".pager li");

    if (page <= 1) {
        page = 1;
        $ali.eq(0).html('<span>没有上一页了</span>');
    } else {
        $ali.eq(0).html('<a href="javascript:;">上一页</a>');
    }

    if (page >= allPages) {
        page = allPages;
        $ali.eq(2).html('<span>没有下一页了</span>');
    } else {
        $ali.eq(2).html('<a href="javascript:;">下一页</a>');
    }

    $ali.eq(1).html( page + " / " + allPages);

    start = (page - 1) * limit;
    end = page * limit;
    html = "";
    for(i = end - 1; i >= start; i--) {
        html += '<div class="messageBox">' +
                '<p class="name clear">' +
                '<span class="f1">' + comments[i].username + '</span>' +
                '<span class="fr">' + formateDate(comments[i].postTime) + '</span>' +
                '</p>' +
                '<p>' + comments[i].content + '</p>' +
                '</div>';
    }

    $(".messageList").html(html);
}

function formateDate(indate) {
    var date;

    date = new Date(indate);

    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() +
            date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

}