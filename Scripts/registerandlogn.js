/// <autosync enabled="true" />
/// <reference path="jquery-3.4.1.js" />
/// <reference path="jquery-3.4.1.slim.js" />
/// <reference path="CommFunction.js" />

///用户登录
function userlogn()
{
    $(document).ready(function () {
        $("#Butuselogn").click(function () {            
            var dt = $("#formLogn").serializeArray();
            var u = dt[0].value;
            var p = dt[1].value;
            if (u.length == 0 || p.length==0)
            {
                window.location.href = '../logn/logn.html';
                alert("不能为空");                
                return;
            }
            var s = "{ 'userName': '" + u + "', 'pawd': '" + p + "' }";
            $.ajax({
                type: "POST",
                url: "../../WebSevers/reception.aspx/userLogn",
                contentType: "application/JSON; charset=utf-8",
                dataType: "JSON",
                data: s,                
                success: function (data) {
                    console.log(data);
                    if (data.d) {
                        window.location.href = '../index.html';
                    }
                    else
                    {
                        alert("用户名或密码错误");
                    }
                },
                error: function (err) {
                    console.log( err)
                    alert("服务器连接出错,,,");
                }

            });
        });
    });
}
///用户注册
function userRegister()
{
    //UserRegister(string userName,string email,string phone, string password)
    $(document).ready(function () {
        $("#ButRegister").click(function () {
            var dt = $("#formRegister").serializeArray();
            console.log(dt);
            var username = dt[0].value;
            var email = dt[1].value;
            var phone = dt[2].value;
            var password = dt[3].value;
            var repassword = dt[4].value;            
            var re=/^[a-zA-Z]+$/;
            var boo = re.test(username.substring(0, 1));//true,说明有英文字母。
            if (boo)
            {
                alert("用户名不能以字母开头");
                return;
            }
            if (username.length<5)
            {
                alert("用户名不能小于5个字符");
                return;
            }
            if (phone.length != 11)
            {
                alert("手机号码格式不对");
                return;
            }
            if (password != repassword) {
                alert("两次密码不一致");
                return;
            }
            if ((password ==repassword) &&(password.length<6||repassword.length<6))
            {
                alert("密码不能小于6位");
                return;
            }
            var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
            if (!reg.test(email)) {
                alert("邮箱格式不正确");
                return;
            }
            var s = "{ 'userName': '" + username +
                "', 'email': '" + email +
                "', 'phone': '" + phone +
                "', 'password': '" + password + "' }";

            $.ajax({
                type: "POST",
                url: "../../WebSevers/reception.aspx/UserRegister",
                contentType: "application/JSON; charset=utf-8",
                dataType: "JSON",
                data: s,                
                success: function (data) {
                    console.log(data);
                    if (data.d=="-1")
                    {
                        alert("用户名已存在");
                        return;
                    }
                    if (data.d=="0")
                    {
                        alert("注册失败");
                        return;
                    }
                    if (data.d=="1")
                    {
                        alert("注册成功！现在可以登录了");
                        window.location.reload();
                        return;
                    }

                },
                error: function (err) {
                    console.log("Err" + err)
                   
                }

            });

        });
    });

}
