/// <autosync enabled="true" />
/// <reference path="jquery-3.4.1.js" />
/// <reference path="jquery-3.4.1.slim.js" />
/// <reference path="CommFunction.js" />


///获取用户名
var Username = "";
function getUserName()
{
    $(document).ready(function () {
        $.ajax({
            type: "POST",
            url: "../WebSevers/reception.aspx/useVerifier",
            contentType: "application/JSON; charset=utf-8",
            dataType: "JSON",
            success: function (data) {
                if (data.d != "-1")
                {
                    $("#pTexUseName").attr("value", data.d);
                    Username = data.d;
                    console.log("====");
                    console.log(getUrlParam("edit"));
                    console.log(Username);
                    if (getUrlParam("edit") != null)
                    {
                        isBelong(Username, getUrlParam("edit"))
                    }
                    
                    return;
                }
                else
                {
                    window.location.href = "404.html";
                }
            },
            error: function (err) {
                console.log("Err" + err)

            }

        });
    });
}

///获取类别条目
function getClassList()
{
    $.ajax({
        type: "POST",
        url: "../WebSevers/reception.aspx/getClassList",
        contentType: "application/JSON; charset=utf-8",
        dataType: "JSON",
        success: function (data)
        {
            console.log(data);
            var strOptionS = "<option value =";//测试条目">测试条目</option>";
            var strOptionE = "</option>";
            var _html ="";
            var arr = data.d;
            var len = arr.length;
            for (var i = 0; i < len; i++)
            {
                var clasName = arr[i].classname;
                var clasId = arr[i].ID;
                _html += strOptionS + clasId + ">" + clasName + strOptionE;
            }
            $(".ClasListT").append(_html);
        },
        error: function (err) {
            console.log("Err" + err)

        }

    });
}

///文章发布setPublish(string ClasID,string Tite ,string Content )
function setPublish()
{
    
    var ArID = "";
    var pclassid = $(".ClasListT").val();
    var pusername = $("#pTexUseName").val();
    var pcontext = $("#TextArea1Con").val();
    var ptitle = $("#TexTitle").val();
    var fliUrl = "";//预留
    if (ptitle.length <= 8 || ptitle.length >= 40)
    {
        alert("标题在8-40个字符之间");
        return;
    }
    if (pcontext.length <= 20 )
    {
        alert("内容不能少于20个字符");
        return;
    }
   
    var s = "{ 'ClasID': '" + pclassid + "', 'Tite': '" + ptitle + "', 'Content': '" + pcontext + "' }";
    
    $.ajax({
        type: "POST",
        url: "../WebSevers/reception.aspx/setPublish",
        contentType: "application/JSON; charset=utf-8",
        dataType: "JSON",
        data: s,
        beforeSend: function ()
        {
            $("#YWaitDialog").show();
            $("#ButPulishi").attr("disabled", "disabled");
            $("#ButPulishi").text("正在发布...");
        },
        complete: function () {
            $("#YWaitDialog").hide();
        },
        success: function (data) {
            console.log(data); 
            if (data.d == "0")
            {
                alert("用户验证出错请重新登录......");
                window.location.href = "logn/logn.html";
                return;
            }
            else if (data.d == "-1" || (data.d).substring(0 - 3) == "Err")
            {
                alert("未知错误，请联系管理员！");
                return;
                
            }
            else
            {
                
                ArID = data.d;                
                console.log($("#add-pic-btn")[0].files);
                if ($("#add-pic-btn")[0].files != null)
                {
                    
                    console.log("等待图片文件上传...")
                    imgFileup(ArID);
                }
                if ($("#add-fil-btn")[0].files != null)
                {
                    console.log("等待其他文件上传...")
                    othFileUp(ArID);
                }
                //
                alert("发布成功！");
            }
                       
            window.location.href = "show.html?ID=" + ArID;
            //$("#YWaitDialog").hide();

        },
        error: function (err) {
            console.log(err);
            alert("服务器出错");
        }

    });

}

function imgFileup(arID)
{
    console.log($("#add-pic-btn")[0].files);
    var files = $("#add-pic-btn")[0].files ;
    var fd = new FormData();
    for (var i = 0; i < files.length; i++)
    {
        if (files.length > 6)
        {
            alert("最多上传6张图片");
            return;
        }
        fd.append(arID + "_" + i + "_", files[i]);
        if (files[i].size >= 10485760)
        {
            alert("文件不能大于10MB");
            return;
        }
    }
    fd.append("arID", arID);
    fd.append("type", "img");
    fd.append("Username", Username);
    $.ajax({
        type: "POST",
        url: "../FileDispose.ashx",
        contentType: false,
        processData: false,
        data: fd,
        async: false,
        success: function (data) {
            console.log("上传成功");
            console.log(data);
        },
        error: function (err) {
            console.log(err);
        }

    });
   // alert(arID);
}

function othFileUp(arID)
{
    console.log($("#add-fil-btn")[0].files);
    var files = $("#add-fil-btn")[0].files;
    var fd = new FormData();
    for (var i = 0; i < files.length; i++) 
    {
        if (files.length > 6)
        {
            alert("最多上传6个文件");
            return;
        }
        if (files[i].size >= 41943040)
        {
            alert("单个文件不能大于40MB");
            return;
        }

        fd.append(arID + "_" + i + "_", files[i]);

    }
    fd.append("arID", arID);
    fd.append("type", "other");
    fd.append("Username", Username);
    $.ajax({
        type: "POST",
        url: "../FileDispose.ashx",
        contentType: false,
        processData: false,
        data: fd,
        async: false,
        success: function (data) {
            console.log("上传成功");
            console.log(data);
        },
        error: function (err) {
            console.log(err);
        }

    });
}

///获得文章info;//getartiContentByID(string artiID)
function getAriinfo(AriID)
{
    var data = "{ 'artiID': '"+AriID+"' }";
    $.ajax({
        type: "POST",
        url: "../WebSevers/reception.aspx/getartiContentByID",
        contentType: "application/JSON; charset=utf-8",
        dataType: "JSON",
        data:data,
        success: function (data) {
            console.log(data);
            var arr = data.d;
            $("#TexTitle").val(arr[0].wtitle);
            $("#TextArea1Con").val(arr[0].wcontent);
        },
        error: function (err) {
            console.log( err)

        }

    });
}

///文章修改//setAriEditor(string clasID, string ID, string wTitle, string wContext)
function setAriEditor(arID)
{
    var pclassid = $(".ClasListT").val();
    //var pusername = $("#pTexUseName").val();
    var pcontext = $("#TextArea1Con").val();
    var ptitle = $("#TexTitle").val();
    var data = "{ 'clasID': '" + pclassid + "', 'ID': '" + arID
        + "', 'wTitle': '" + ptitle
        + "', 'wContext': '" + pcontext + "' }";
    $.ajax({
        type: "POST",
        url: "../WebSevers/Management.aspx/setAriEditor",
        contentType: "application/JSON; charset=utf-8",
        dataType: "JSON",
        data: data,
        success: function (data) {
            console.log(data);
            if (data.d == "1")
            {
                alert("修改成功");
                window.location.href = "show.html?ID=" + arID;
                return;
            }
            if (data.d == "-1")
            {
                alert("失败");
                return;
            }
            if (data.d = "-2")
            {
                alert("服务器发生错误");
            }


        },
        error: function (err) {
            console.log(err)
        }

    });


}


//<select class="ClasListT">
//<option value ="测试条目">测试条目</option>
//<option value ="saab">Saab</option>
//<option value="opel">Opel</option>
//<option value="audi">Audi</option>
//</select>
//TexTitle标题
//TextArea1Con内容
