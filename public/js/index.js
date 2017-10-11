
$(function() {
    var $loginBox = $("#loginBox");
    var $registerBox = $("#registerBox");
    var $userInfo = $("#userInfo");

    $loginBox.find("a").on("click", function() {
        $loginBox.hide();
        $registerBox.show();
    });

    $registerBox.find("a").on("click", function() {
        $registerBox.hide();
        $loginBox.show();
    });

    $registerBox.find("button").on("click", function() {
        $.ajax({
            type: "post",
            url: "/api/user/register",
            data: {
                username: $registerBox.find("[name='username']").val(),
                password: $registerBox.find("[name='password']").val(),
                repassword: $registerBox.find("[name='repassword']").val(),
            },
            dataType: "json",
            success: function(result) {
                console.log("register: %s", result);
                $registerBox.find(".colWarning").html(result.message);

                if (!result.code) {
                    setTimeout(function() {
                        $registerBox.hide();
                        $loginBox.show();
                    }, 1000);
                }
            }
        });
    });

    $loginBox.find("button").on("click", function(){
        $.ajax({
            type: "post",
            url: "api/user/login",
            data: {
                username: $loginBox.find("[name='username']").val(),
                password: $loginBox.find("[name='password']").val()
            },
            dataType: "json",
            success: function(result) {
                window.location.reload();
            }
        })
    })

    $("#logout").on("click", function() {
        $.ajax({
            url: "/api/user/logout",
            success: function(result) {
                if (!result.code) {
                    window.location.reload();
                }
            }
        })
    })
});
